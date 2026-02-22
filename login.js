const RUNTIME_CONFIG = readRuntimeConfig();
const SUPABASE_URL = RUNTIME_CONFIG.supabaseUrl;
const SUPABASE_ANON_KEY = RUNTIME_CONFIG.supabaseAnonKey;

const signinForm = document.getElementById("signin-form");
const signinEmailInput = document.getElementById("signin-email-input");
const signinPasswordInput = document.getElementById("signin-password-input");
const signinStatus = document.getElementById("signin-status");
const signinSubmitBtn = document.getElementById("signin-submit-btn");
const DEFAULT_REDIRECT_AFTER_LOGIN = "index.html#predict";
const REDIRECT_AFTER_LOGIN = getPostAuthRedirect();

const client = SUPABASE_URL && SUPABASE_ANON_KEY
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!client && signinStatus) {
  signinStatus.textContent = "Configuration error. Please try again shortly.";
}

if (signinForm && client) {
  signinForm.addEventListener("submit", onSignIn);
}
if (client) {
  handleAuthCallback();
  redirectIfAlreadySignedIn();
}

async function handleAuthCallback() {
  if (!signinStatus || !client) {
    return;
  }

  const url = new URL(window.location.href);
  const query = url.searchParams;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  let callbackDetected = false;

  if (query.has("code")) {
    callbackDetected = true;
    signinStatus.textContent = "Confirming your account...";
    const { error } = await client.auth.exchangeCodeForSession(query.get("code"));
    if (error) {
      signinStatus.textContent = `Confirmation failed: ${error.message}`;
      return;
    }
  } else if (query.has("token_hash") && query.has("type")) {
    callbackDetected = true;
    signinStatus.textContent = "Confirming your account...";
    const { error } = await client.auth.verifyOtp({
      token_hash: query.get("token_hash"),
      type: query.get("type")
    });
    if (error) {
      signinStatus.textContent = `Confirmation failed: ${error.message}`;
      return;
    }
  } else if (hash.has("access_token") || hash.has("refresh_token") || hash.get("type") === "signup") {
    callbackDetected = true;
    signinStatus.textContent = "Finalizing your sign in...";
    const { data, error } = await client.auth.getSession();
    if (error || !data?.session) {
      signinStatus.textContent = `Confirmation failed: ${error?.message || "No active session found."}`;
      return;
    }
  }

  if (!callbackDetected) {
    return;
  }

  const sessionReady = await waitForActiveSession();
  if (!sessionReady) {
    signinStatus.textContent = "Confirmation completed but no active session was found. Please sign in manually.";
    return;
  }

  url.search = "";
  url.hash = "";
  window.history.replaceState({}, document.title, url.toString());
  signinStatus.textContent = "Email confirmed. Redirecting...";
  window.setTimeout(() => {
    window.location.href = REDIRECT_AFTER_LOGIN;
  }, 800);
}

async function onSignIn(event) {
  event.preventDefault();
  if (!client) {
    if (signinStatus) signinStatus.textContent = "Configuration error. Please try again shortly.";
    return;
  }
  const email = signinEmailInput.value.trim();
  const password = signinPasswordInput.value;

  if (!email || !password) {
    return;
  }

  if (signinStatus) signinStatus.textContent = "Signing in...";
  if (signinSubmitBtn) signinSubmitBtn.disabled = true;

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    if (signinStatus) signinStatus.textContent = error.message;
    if (signinSubmitBtn) signinSubmitBtn.disabled = false;
    return;
  }

  const sessionReady = await waitForActiveSession();
  if (!sessionReady) {
    if (signinStatus) signinStatus.textContent = "Signed in, but session is still initializing. Please try again.";
    if (signinSubmitBtn) signinSubmitBtn.disabled = false;
    return;
  }

  if (signinStatus) signinStatus.textContent = "Signed in. Redirecting...";
  window.location.href = REDIRECT_AFTER_LOGIN;
}

async function redirectIfAlreadySignedIn() {
  if (!client) {
    return;
  }
  const { data, error } = await client.auth.getSession();
  if (error || !data?.session) {
    return;
  }
  window.location.href = REDIRECT_AFTER_LOGIN;
}

async function waitForActiveSession(maxAttempts = 6, delayMs = 180) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData?.session?.user) {
      return true;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (!userError && userData?.user) {
      return true;
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return false;
}

function readRuntimeConfig() {
  const cfg = window.__SW6_CONFIG__ || {};
  return {
    supabaseUrl: String(cfg.supabaseUrl || "").trim(),
    supabaseAnonKey: String(cfg.supabaseAnonKey || "").trim()
  };
}

function getPostAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect") || params.get("next") || "";
  if (!redirect) {
    return DEFAULT_REDIRECT_AFTER_LOGIN;
  }
  // Avoid open redirects.
  if (redirect.startsWith("http://") || redirect.startsWith("https://") || redirect.startsWith("//")) {
    return DEFAULT_REDIRECT_AFTER_LOGIN;
  }
  if (redirect.startsWith("#")) {
    return `index.html${redirect}`;
  }
  return redirect.startsWith("/") ? redirect : DEFAULT_REDIRECT_AFTER_LOGIN;
}
