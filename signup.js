const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";
const BANNED_USERNAME_TOKENS = [
  "fuck", "shit", "bitch", "cunt", "nigger", "nigga", "fag", "faggot", "wank", "twat",
  "prick", "dick", "cock", "pussy", "asshole", "arsehole", "whore", "slut"
];
const COUNTRIES = [
  ["AF", "Afghanistan"], ["AL", "Albania"], ["DZ", "Algeria"], ["AD", "Andorra"], ["AO", "Angola"],
  ["AG", "Antigua and Barbuda"], ["AR", "Argentina"], ["AM", "Armenia"], ["AU", "Australia"], ["AT", "Austria"],
  ["AZ", "Azerbaijan"], ["BS", "Bahamas"], ["BH", "Bahrain"], ["BD", "Bangladesh"], ["BB", "Barbados"],
  ["BY", "Belarus"], ["BE", "Belgium"], ["BZ", "Belize"], ["BJ", "Benin"], ["BT", "Bhutan"],
  ["BO", "Bolivia"], ["BA", "Bosnia and Herzegovina"], ["BW", "Botswana"], ["BR", "Brazil"], ["BN", "Brunei"],
  ["BG", "Bulgaria"], ["BF", "Burkina Faso"], ["BI", "Burundi"], ["CV", "Cabo Verde"], ["KH", "Cambodia"],
  ["CM", "Cameroon"], ["CA", "Canada"], ["CF", "Central African Republic"], ["TD", "Chad"], ["CL", "Chile"],
  ["CN", "China"], ["CO", "Colombia"], ["KM", "Comoros"], ["CG", "Congo"], ["CR", "Costa Rica"],
  ["CI", "Cote d'Ivoire"], ["HR", "Croatia"], ["CU", "Cuba"], ["CY", "Cyprus"], ["CZ", "Czechia"],
  ["CD", "Democratic Republic of the Congo"], ["DK", "Denmark"], ["DJ", "Djibouti"], ["DM", "Dominica"], ["DO", "Dominican Republic"],
  ["EC", "Ecuador"], ["EG", "Egypt"], ["SV", "El Salvador"], ["GQ", "Equatorial Guinea"], ["ER", "Eritrea"],
  ["EE", "Estonia"], ["SZ", "Eswatini"], ["ET", "Ethiopia"], ["FJ", "Fiji"], ["FI", "Finland"],
  ["FR", "France"], ["GA", "Gabon"], ["GM", "Gambia"], ["GE", "Georgia"], ["DE", "Germany"],
  ["GH", "Ghana"], ["GR", "Greece"], ["GD", "Grenada"], ["GT", "Guatemala"], ["GN", "Guinea"],
  ["GW", "Guinea-Bissau"], ["GY", "Guyana"], ["HT", "Haiti"], ["HN", "Honduras"], ["HU", "Hungary"],
  ["IS", "Iceland"], ["IN", "India"], ["ID", "Indonesia"], ["IR", "Iran"], ["IQ", "Iraq"],
  ["IE", "Ireland"], ["IL", "Israel"], ["IT", "Italy"], ["JM", "Jamaica"], ["JP", "Japan"],
  ["JO", "Jordan"], ["KZ", "Kazakhstan"], ["KE", "Kenya"], ["KI", "Kiribati"], ["KP", "North Korea"],
  ["KR", "South Korea"], ["KW", "Kuwait"], ["KG", "Kyrgyzstan"], ["LA", "Laos"], ["LV", "Latvia"],
  ["LB", "Lebanon"], ["LS", "Lesotho"], ["LR", "Liberia"], ["LY", "Libya"], ["LI", "Liechtenstein"],
  ["LT", "Lithuania"], ["LU", "Luxembourg"], ["MG", "Madagascar"], ["MW", "Malawi"], ["MY", "Malaysia"],
  ["MV", "Maldives"], ["ML", "Mali"], ["MT", "Malta"], ["MH", "Marshall Islands"], ["MR", "Mauritania"],
  ["MU", "Mauritius"], ["MX", "Mexico"], ["FM", "Micronesia"], ["MD", "Moldova"], ["MC", "Monaco"],
  ["MN", "Mongolia"], ["ME", "Montenegro"], ["MA", "Morocco"], ["MZ", "Mozambique"], ["MM", "Myanmar"],
  ["NA", "Namibia"], ["NR", "Nauru"], ["NP", "Nepal"], ["NL", "Netherlands"], ["NZ", "New Zealand"],
  ["NI", "Nicaragua"], ["NE", "Niger"], ["NG", "Nigeria"], ["MK", "North Macedonia"], ["NO", "Norway"],
  ["OM", "Oman"], ["PK", "Pakistan"], ["PW", "Palau"], ["PS", "Palestine"], ["PA", "Panama"],
  ["PG", "Papua New Guinea"], ["PY", "Paraguay"], ["PE", "Peru"], ["PH", "Philippines"], ["PL", "Poland"],
  ["PT", "Portugal"], ["QA", "Qatar"], ["RO", "Romania"], ["RU", "Russia"], ["RW", "Rwanda"],
  ["KN", "Saint Kitts and Nevis"], ["LC", "Saint Lucia"], ["VC", "Saint Vincent and the Grenadines"], ["WS", "Samoa"], ["SM", "San Marino"],
  ["ST", "Sao Tome and Principe"], ["SA", "Saudi Arabia"], ["SN", "Senegal"], ["RS", "Serbia"], ["SC", "Seychelles"],
  ["SL", "Sierra Leone"], ["SG", "Singapore"], ["SK", "Slovakia"], ["SI", "Slovenia"], ["SB", "Solomon Islands"],
  ["SO", "Somalia"], ["ZA", "South Africa"], ["SS", "South Sudan"], ["ES", "Spain"], ["LK", "Sri Lanka"],
  ["SD", "Sudan"], ["SR", "Suriname"], ["SE", "Sweden"], ["CH", "Switzerland"], ["SY", "Syria"],
  ["TJ", "Tajikistan"], ["TZ", "Tanzania"], ["TH", "Thailand"], ["TL", "Timor-Leste"], ["TG", "Togo"],
  ["TO", "Tonga"], ["TT", "Trinidad and Tobago"], ["TN", "Tunisia"], ["TR", "Turkey"], ["TM", "Turkmenistan"],
  ["TV", "Tuvalu"], ["UG", "Uganda"], ["UA", "Ukraine"], ["AE", "United Arab Emirates"], ["GB", "United Kingdom"],
  ["US", "United States"], ["UY", "Uruguay"], ["UZ", "Uzbekistan"], ["VU", "Vanuatu"], ["VA", "Vatican City"],
  ["VE", "Venezuela"], ["VN", "Vietnam"], ["YE", "Yemen"], ["ZM", "Zambia"], ["ZW", "Zimbabwe"]
];

const signupForm = document.getElementById("signup-form");
const signupNameInput = document.getElementById("signup-name-input");
const signupCountryInput = document.getElementById("signup-country-input");
const signupEmailInput = document.getElementById("signup-email-input");
const signupPasswordInput = document.getElementById("signup-password-input");
const signupStatus = document.getElementById("signup-status");

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

populateCountries();
signupForm.addEventListener("submit", onSignUp);

function populateCountries() {
  const current = signupCountryInput.value;
  COUNTRIES.forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    signupCountryInput.appendChild(option);
  });

  signupCountryInput.value = current || "GB";
}

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
  if (containsBlockedUsernameLanguage(displayName)) {
    signupStatus.textContent = "That username is not allowed. Please choose another.";
    return;
  }

  signupStatus.textContent = "Creating account...";
  const emailRedirectTo = new URL("login.html", window.location.href);
  emailRedirectTo.searchParams.set("auth", "confirm");
  const { error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: emailRedirectTo.toString(),
      data: { display_name: displayName, country_code: countryCode, country_name: countryName }
    }
  });

  if (error) {
    signupStatus.textContent = error.message;
    return;
  }

  signupStatus.textContent = "Account created. Check your verification email (including spam/junk), then continue.";
  signupForm.reset();
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
}

function containsBlockedUsernameLanguage(value) {
  const normalized = normalizeForModeration(value);
  if (!normalized) {
    return false;
  }
  return BANNED_USERNAME_TOKENS.some((token) => normalized.includes(token));
}

function normalizeForModeration(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[0]/g, "o")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[^a-z]/g, "");
}
