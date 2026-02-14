const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";

const signupForm = document.getElementById("signup-form");
const signupNameInput = document.getElementById("signup-name-input");
const signupCountryInput = document.getElementById("signup-country-input");
const signupEmailInput = document.getElementById("signup-email-input");
const signupPasswordInput = document.getElementById("signup-password-input");
const signupStatus = document.getElementById("signup-status");

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

signupForm.addEventListener("submit", onSignUp);

async function onSignUp(event) {
  event.preventDefault();
  const displayName = signupNameInput.value.trim();
  const countryCode = signupCountryInput.value.trim().toUpperCase();
  const countryName = signupCountryInput.options[signupCountryInput.selectedIndex]?.text || "";
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;

  if (!displayName || !countryCode || !email || !password) {
    return;
  }

  signupStatus.textContent = "Creating account...";
  const { error } = await client.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName, country_code: countryCode, country_name: countryName } }
  });

  if (error) {
    signupStatus.textContent = error.message;
    return;
  }

  signupStatus.textContent = "Account created. Redirecting to log in...";
  signupForm.reset();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 900);
}
