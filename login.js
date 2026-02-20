const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";

const signinForm = document.getElementById("signin-form");
const signinEmailInput = document.getElementById("signin-email-input");
const signinPasswordInput = document.getElementById("signin-password-input");
const signinStatus = document.getElementById("signin-status");
const signinSubmitBtn = document.getElementById("signin-submit-btn");
const REDIRECT_AFTER_LOGIN = "index.html#predict";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (signinForm) {
  signinForm.addEventListener("submit", onSignIn);
}
handleAuthCallback();

async function handleAuthCallback() {
  if (!signinStatus) {
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

  if (signinStatus) signinStatus.textContent = "Signed in. Redirecting...";
  window.location.href = REDIRECT_AFTER_LOGIN;
}
