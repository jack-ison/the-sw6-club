const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";
const BANNED_USERNAME_TOKENS = [
  "fuck", "shit", "bitch", "cunt", "nigger", "nigga", "fag", "faggot", "wank", "twat",
  "prick", "dick", "cock", "pussy", "asshole", "arsehole", "whore", "slut"
];

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const profileForm = document.getElementById("profile-form");
const usernameInput = document.getElementById("profile-username-input");
const actualNameInput = document.getElementById("profile-actual-name-input");
const avatarInput = document.getElementById("profile-avatar-input");
const displayModeInput = document.getElementById("profile-display-mode-input");
const statusEl = document.getElementById("profile-status");
const saveBtn = document.getElementById("profile-save-btn");
const deleteConfirmInput = document.getElementById("profile-delete-confirm-input");
const deleteBtn = document.getElementById("profile-delete-btn");

initialize();

async function initialize() {
  const { data } = await client.auth.getSession();
  const user = data?.session?.user || null;
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  hydrate(user);
}

function hydrate(user) {
  const meta = user.user_metadata || {};
  usernameInput.value = String(meta.username || meta.display_name || "");
  actualNameInput.value = String(meta.actual_name || "");
  displayModeInput.value = meta.display_mode === "actual" ? "actual" : "username";
}

if (profileForm) {
  profileForm.addEventListener("submit", onSave);
}
if (deleteBtn) {
  deleteBtn.addEventListener("click", onDeleteAccount);
}

async function onSave(event) {
  event.preventDefault();
  const { data } = await client.auth.getSession();
  const user = data?.session?.user || null;
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const username = usernameInput.value.trim();
  const actualName = actualNameInput.value.trim();
  const displayMode = displayModeInput.value === "actual" ? "actual" : "username";
  const avatarFile = avatarInput.files?.[0] || null;

  if (!username) {
    statusEl.textContent = "Username is required.";
    return;
  }
  if (containsBlockedUsernameLanguage(username)) {
    statusEl.textContent = "That username is not allowed. Please choose another.";
    return;
  }

  saveBtn.disabled = true;
  statusEl.textContent = "Saving profile...";

  let avatarUrl = user.user_metadata?.avatar_url || "";
  if (avatarFile) {
    const ext = (avatarFile.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    const path = `${user.id}/${Date.now()}.${safeExt}`;
    const upload = await client.storage.from("avatars").upload(path, avatarFile, {
      upsert: true,
      contentType: avatarFile.type || "image/jpeg"
    });
    if (upload.error) {
      statusEl.textContent = upload.error.message;
      saveBtn.disabled = false;
      return;
    }
    const { data: publicData } = client.storage.from("avatars").getPublicUrl(path);
    avatarUrl = publicData?.publicUrl || avatarUrl;
  }

  const updateData = {
    username,
    display_name: username,
    actual_name: actualName,
    display_mode: displayMode,
    avatar_url: avatarUrl
  };
  const { error } = await client.auth.updateUser({ data: updateData });
  if (error) {
    statusEl.textContent = error.message;
    saveBtn.disabled = false;
    return;
  }

  await client
    .from("league_members")
    .update({ display_name: username, avatar_url: avatarUrl || null })
    .eq("user_id", user.id);

  statusEl.textContent = "Profile updated.";
  saveBtn.disabled = false;
}

async function onDeleteAccount() {
  const confirmationText = String(deleteConfirmInput?.value || "").trim().toUpperCase();
  if (confirmationText !== "DELETE") {
    statusEl.textContent = "Type DELETE in the confirmation box to continue.";
    return;
  }

  const isConfirmed = window.confirm(
    "Delete your account and all associated data permanently? This cannot be undone."
  );
  if (!isConfirmed) {
    return;
  }

  saveBtn.disabled = true;
  if (deleteBtn) deleteBtn.disabled = true;
  statusEl.textContent = "Deleting account...";

  const { error } = await client.rpc("delete_my_account");
  if (error) {
    statusEl.textContent =
      "Unable to delete account right now. If this persists, run the latest supabase-schema.sql migration.";
    saveBtn.disabled = false;
    if (deleteBtn) deleteBtn.disabled = false;
    return;
  }

  await client.auth.signOut();
  window.location.href = "signup.html";
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
