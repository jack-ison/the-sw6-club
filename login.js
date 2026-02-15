const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";

const signinForm = document.getElementById("signin-form");
const signinEmailInput = document.getElementById("signin-email-input");
const signinPasswordInput = document.getElementById("signin-password-input");
const signinStatus = document.getElementById("signin-status");
const signinSubmitBtn = document.getElementById("signin-submit-btn");

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (signinForm) {
  signinForm.addEventListener("submit", onSignIn);
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
  window.location.href = "index.html#predict";
}
