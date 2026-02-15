const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";
const ADMIN_EMAIL = "jackwilliamison@gmail.com";
const GLOBAL_LEAGUE_NAME = "Global League";
const FIXTURE_CACHE_KEY = "cfc-upcoming-fixtures-cache-v1";
const FIXTURE_CACHE_VERSION = 3;
const PREDICTION_SCORERS_CACHE_KEY = "cfc-prediction-scorers-cache-v1";
const THE_SPORTS_DB_SCORERS_CACHE_KEY = "cfc-sportsdb-scorers-cache-v1";
const THE_SPORTS_DB_SCORERS_CACHE_VERSION = 1;
const THE_SPORTS_DB_SCORERS_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const SQUAD_CACHE_KEY = "cfc-team-squads-cache-v1";
const SQUAD_CACHE_VERSION = 3;
const SQUAD_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PREDICTION_CUTOFF_MINUTES = 90;
const CHELSEA_TEAM_ID = "133610";
const THE_SPORTS_DB_BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
const THE_SPORTS_DB_SCORER_COMPETITIONS = {
  premier_league: { leagueId: "4328", label: "Premier League 2025/26" },
  champions_league: { leagueId: "4480", label: "Champions League 2025/26" },
  fa_cup: { leagueId: "4482", label: "FA Cup 2025/26" }
};
const SCORER_COMPETITION_KEYS = ["all", "premier_league", "champions_league", "fa_cup"];
const THE_SPORTS_DB_SEASON = "2025-2026";
const SCORING = {
  exactScore: 5,
  correctResult: 2,
  correctChelseaGoals: 1,
  correctOpponentGoals: 1,
  correctGoalscorer: 1,
  correctFirstScorer: 2,
  perfectBonus: 1
};
const FALLBACK_FIXTURES = [
  { date: "2026-02-21", opponent: "Burnley", competition: "Premier League", kickoffUk: "15:00" },
  { date: "2026-03-01", opponent: "Arsenal", competition: "Premier League", kickoffUk: "16:30" },
  { date: "2026-03-04", opponent: "Aston Villa", competition: "Premier League", kickoffUk: "19:30" },
  { date: "2026-03-14", opponent: "Newcastle United", competition: "Premier League", kickoffUk: "17:30" },
  { date: "2026-03-21", opponent: "Everton", competition: "Premier League", kickoffUk: "17:30" },
  { date: "2026-04-11", opponent: "Manchester City", competition: "Premier League", kickoffUk: "TBC" },
  { date: "2026-04-18", opponent: "Manchester United", competition: "Premier League", kickoffUk: "TBC" },
  { date: "2026-04-25", opponent: "Brighton & Hove Albion", competition: "Premier League", kickoffUk: "TBC" },
  { date: "2026-05-02", opponent: "Bournemouth", competition: "Premier League", kickoffUk: "TBC" },
  { date: "2026-05-09", opponent: "Leeds United", competition: "Premier League", kickoffUk: "TBC" },
  { date: "2026-05-17", opponent: "Tottenham Hotspur", competition: "Premier League", kickoffUk: "TBC" },
  { date: "2026-05-24", opponent: "Sunderland", competition: "Premier League", kickoffUk: "16:00" }
];
const CHELSEA_FIXTURES_URL = "https://www.chelseafc.com/en/matches/mens-fixtures-and-results";
const CHELSEA_FIXTURES_PROXY_URL = `https://r.jina.ai/http://${CHELSEA_FIXTURES_URL.replace(
  /^https?:\/\//,
  ""
)}`;
const CHELSEA_SQUAD_URL = "https://www.chelseafc.com/en/teams/men";
const CHELSEA_SQUAD_PROXY_URL = `https://r.jina.ai/http://${CHELSEA_SQUAD_URL.replace(/^https?:\/\//, "")}`;
const TOP_SCORERS = [
  { name: "Joao Pedro", apps: 26, goals: 10 },
  { name: "Enzo Fernandez", apps: 25, goals: 8 },
  { name: "Cole Palmer", apps: 16, goals: 8 },
  { name: "Pedro Neto", apps: 26, goals: 5 },
  { name: "Trevoh Chalobah", apps: 25, goals: 3 },
  { name: "Moises Caicedo", apps: 21, goals: 3 },
  { name: "Reece James", apps: 23, goals: 2 },
  { name: "Malo Gusto", apps: 23, goals: 2 },
  { name: "Estevao", apps: 19, goals: 2 },
  { name: "Marc Cucurella", apps: 24, goals: 1 }
];
const FALLBACK_TOP_SCORERS_BY_COMPETITION = {
  all: {
    label: "All Competitions 2025/26",
    players: [...TOP_SCORERS],
    source: "Fallback snapshot while live TheSportsDB scorer data is unavailable."
  },
  premier_league: {
    label: "Premier League 2025/26",
    players: [...TOP_SCORERS],
    source: "Fallback snapshot while live TheSportsDB scorer data is unavailable."
  },
  champions_league: {
    label: "Champions League 2025/26",
    players: [],
    source: "No fallback scorer rows loaded for this competition."
  },
  fa_cup: {
    label: "FA Cup 2025/26",
    players: [],
    source: "No fallback scorer rows loaded for this competition."
  }
};

function cloneCompetitionDataMap(sourceMap) {
  return Object.fromEntries(
    Object.entries(sourceMap).map(([key, value]) => [
      key,
      {
        label: value.label,
        players: Array.isArray(value.players) ? value.players.map((player) => ({ ...player })) : [],
        source: value.source
      }
    ])
  );
}
const CHELSEA_REGISTERED_PLAYERS = [
  "Robert Sanchez", "Filip Jorgensen", "Teddy Sharman-Lowe", "Gaga Slonina",
  "Marc Cucurella", "Tosin Adarabioyo", "Benoit Badiashile", "Levi Colwill", "Mamadou Sarr",
  "Jorrel Hato", "Trevoh Chalobah", "Reece James", "Malo Gusto", "Wesley Fofana", "Josh Acheampong",
  "Enzo Fernandez", "Dario Essugo", "Andrey Santos", "Moises Caicedo", "Romeo Lavia", "Cole Palmer",
  "Pedro Neto", "Liam Delap", "Jamie Gittens", "Joao Pedro", "Marc Guiu", "Estevao Willian",
  "Alejandro Garnacho", "Mykhailo Mudryk"
];
const POSITION_GROUPS = ["Defenders", "Midfielders", "Forwards"];
const CHELSEA_PLAYER_POSITION_GROUP = {
  "Robert Sanchez": "Goalkeepers",
  "Filip Jorgensen": "Goalkeepers",
  "Teddy Sharman-Lowe": "Goalkeepers",
  "Gaga Slonina": "Goalkeepers",
  "Djordje Petrovic": "Goalkeepers",
  "Lucas Bergstrom": "Goalkeepers",
  "Marc Cucurella": "Defenders",
  "Tosin Adarabioyo": "Defenders",
  "Benoit Badiashile": "Defenders",
  "Levi Colwill": "Defenders",
  "Mamadou Sarr": "Defenders",
  "Jorrel Hato": "Defenders",
  "Trevoh Chalobah": "Defenders",
  "Reece James": "Defenders",
  "Malo Gusto": "Defenders",
  "Wesley Fofana": "Defenders",
  "Josh Acheampong": "Defenders",
  "Enzo Fernandez": "Midfielders",
  "Dario Essugo": "Midfielders",
  "Andrey Santos": "Midfielders",
  "Moises Caicedo": "Midfielders",
  "Romeo Lavia": "Midfielders",
  "Cole Palmer": "Midfielders",
  "Carney Chukwuemeka": "Midfielders",
  "Pedro Neto": "Forwards",
  "Liam Delap": "Forwards",
  "Jamie Gittens": "Forwards",
  "Joao Pedro": "Forwards",
  "Marc Guiu": "Forwards",
  "Estevao Willian": "Forwards",
  "Estevao": "Forwards",
  "Alejandro Garnacho": "Forwards",
  "Mykhailo Mudryk": "Forwards",
  "Noni Madueke": "Forwards",
  "Christopher Nkunku": "Forwards",
  "Nicolas Jackson": "Forwards",
  "Kendry Paez": "Forwards"
};
const BANNED_USERNAME_TOKENS = [
  "fuck", "shit", "bitch", "cunt", "nigger", "nigga", "fag", "faggot", "wank", "twat",
  "prick", "dick", "cock", "pussy", "asshole", "arsehole", "whore", "slut"
];
let overallLeaderboardLoadPromise = null;

const state = {
  client: null,
  session: null,
  leagues: [],
  activeLeagueId: null,
  activeLeagueMembers: [],
  activeLeagueFixtures: [],
  activeLeagueLeaderboard: [],
  overallLeaderboard: [],
  overallLeaderboardStatus: "Loading overall leaderboard...",
  overallLeaderboardLoaded: false,
  teamSquads: { Chelsea: [...CHELSEA_REGISTERED_PLAYERS] },
  teamSquadPositionGroup: { Chelsea: { ...CHELSEA_PLAYER_POSITION_GROUP } },
  teamSquadFetchedAt: {},
  squadFetchInFlight: {},
  showAllUpcoming: false,
  topView: "predict",
  resultsTab: "fixtures",
  scorerCompetition: "all",
  scorerDataByCompetition: cloneCompetitionDataMap(FALLBACK_TOP_SCORERS_BY_COMPETITION),
  leaderboardScope: "global",
  accountMenuOpen: false,
  loginPanelOpen: false,
  showRulesModal: false,
  upcomingFixtures: [...FALLBACK_FIXTURES],
  upcomingSourceText: "Using bundled SW6 fixture fallback list.",
  lastPredictionAck: null,
  profileAck: null,
  predictionButtonFlashTimeoutId: null,
  registeredUserCount: undefined,
  adminLeagues: []
};

const topnavPredictBtn = document.getElementById("topnav-predict");
const topnavLeaguesBtn = document.getElementById("topnav-leagues");
const topnavResultsBtn = document.getElementById("topnav-results");
const resultsFixturesTabBtn = document.getElementById("results-fixtures-tab");
const resultsPastTabBtn = document.getElementById("results-past-tab");
const resultsStatsTabBtn = document.getElementById("results-stats-tab");
const fixturesOverviewPanel = document.getElementById("fixtures-overview-panel");
const scorersOverviewPanel = document.getElementById("scorers-overview-panel");
const pastOverviewPanel = document.getElementById("past-overview-panel");
const predictViewEl = document.getElementById("predict-view");
const resultsViewEl = document.getElementById("results-view");
const loginPanelEl = document.getElementById("login-panel");
const leagueLoginPromptEl = document.getElementById("league-login-prompt");
const upcomingToggleBtn = document.getElementById("upcoming-toggle-btn");
const upcomingListEl = document.getElementById("upcoming-list");
const upcomingSourceEl = document.getElementById("upcoming-source");
const scorersTableBody = document.getElementById("scorers-table-body");
const scorersSourceEl = document.getElementById("scorers-source");
const scorersTitleEl = document.getElementById("scorers-title");
const statsAllTabBtn = document.getElementById("stats-all-tab");
const statsPlTabBtn = document.getElementById("stats-pl-tab");
const statsUclTabBtn = document.getElementById("stats-ucl-tab");
const statsFaTabBtn = document.getElementById("stats-fa-tab");
const overallLeaderboardEl = document.getElementById("overall-leaderboard");
const overallLeaderboardStatusEl = document.getElementById("overall-leaderboard-status");
const pastGamesListEl = document.getElementById("past-games-list");
const pastGamesStatusEl = document.getElementById("past-games-status");
const profileEditShellEl = document.getElementById("profile-edit-shell");
const accountSignInLink = document.getElementById("account-signin-link");
const accountSignUpLink = document.getElementById("account-signup-link");
const accountEditProfileTopLink = document.getElementById("account-edit-profile-top-link");
const accountQuickSignOutBtn = document.getElementById("account-signout-quick-btn");
const openRulesInlineBtn = document.getElementById("open-rules-inline");
const openRulesFooterBtn = document.getElementById("open-rules-footer");
const closeRulesModalBtn = document.getElementById("close-rules-modal");
const rulesModalEl = document.getElementById("rules-modal");
const profileEditForm = document.getElementById("profile-edit-form");
const profileUsernameInput = document.getElementById("profile-username-input");
const profileActualNameInput = document.getElementById("profile-actual-name-input");
const profileAvatarInput = document.getElementById("profile-avatar-input");
const profileDisplayModeInput = document.getElementById("profile-display-mode-input");
const cancelProfileBtn = document.getElementById("cancel-profile-btn");
const profileEditStatus = document.getElementById("profile-edit-status");

const authPanel = document.getElementById("auth-panel");
const loginForm = document.getElementById("login-form");
const authLoginFields = document.getElementById("auth-login-fields");
const loginEmailInput = document.getElementById("login-email-input");
const loginPasswordInput = document.getElementById("login-password-input");
const loginBtn = document.getElementById("login-btn");
const sessionStatus = document.getElementById("session-status");

const leaguePanel = document.getElementById("league-panel");
const createLeagueForm = document.getElementById("create-league-form");
const joinLeagueForm = document.getElementById("join-league-form");
const leagueNameInput = document.getElementById("league-name-input");
const leagueVisibilityInput = document.getElementById("league-visibility-input");
const leaguePasswordWrap = document.getElementById("league-password-wrap");
const leaguePasswordInput = document.getElementById("league-password-input");
const joinModeInput = document.getElementById("join-mode-input");
const joinCodeWrap = document.getElementById("join-code-wrap");
const joinCodeInput = document.getElementById("join-code-input");
const joinPrivateNameWrap = document.getElementById("join-private-name-wrap");
const joinPrivateNameInput = document.getElementById("join-private-name-input");
const joinPrivatePasswordWrap = document.getElementById("join-private-password-wrap");
const joinPrivatePasswordInput = document.getElementById("join-private-password-input");
const leagueSelect = document.getElementById("league-select");
const copyCodeBtn = document.getElementById("copy-code-btn");
const leagueMetaNoteEl = document.getElementById("league-meta-note");
const adminConsoleEl = document.getElementById("admin-console");
const adminLeagueListEl = document.getElementById("admin-league-list");
const deadlineCountdownEl = document.getElementById("deadline-countdown");
const matchdayAttendanceEl = document.getElementById("matchday-attendance");
const predictSigninPromptEl = document.getElementById("predict-signin-prompt");

const leaderboardEl = document.getElementById("leaderboard");
const fixturesListEl = document.getElementById("fixtures-list");
const fixtureTemplate = document.getElementById("fixture-template");

if (topnavPredictBtn) topnavPredictBtn.addEventListener("click", () => setTopView("predict"));
if (topnavLeaguesBtn) topnavLeaguesBtn.addEventListener("click", () => setTopView("leagues"));
if (topnavResultsBtn) topnavResultsBtn.addEventListener("click", () => setTopView("results"));
if (resultsFixturesTabBtn) resultsFixturesTabBtn.addEventListener("click", () => setResultsTab("fixtures"));
if (resultsPastTabBtn) resultsPastTabBtn.addEventListener("click", () => setResultsTab("past"));
if (resultsStatsTabBtn) resultsStatsTabBtn.addEventListener("click", () => setResultsTab("stats"));
if (statsAllTabBtn) statsAllTabBtn.addEventListener("click", () => setScorerCompetition("all"));
if (statsPlTabBtn) statsPlTabBtn.addEventListener("click", () => setScorerCompetition("premier_league"));
if (statsUclTabBtn) statsUclTabBtn.addEventListener("click", () => setScorerCompetition("champions_league"));
if (statsFaTabBtn) statsFaTabBtn.addEventListener("click", () => setScorerCompetition("fa_cup"));
if (upcomingToggleBtn) upcomingToggleBtn.addEventListener("click", () => {
  state.showAllUpcoming = !state.showAllUpcoming;
  renderUpcomingFixtures();
});
if (loginForm) loginForm.addEventListener("submit", onLogIn);
if (accountQuickSignOutBtn) accountQuickSignOutBtn.addEventListener("click", onLogOut);
if (openRulesInlineBtn) openRulesInlineBtn.addEventListener("click", onOpenRulesModal);
if (openRulesFooterBtn) openRulesFooterBtn.addEventListener("click", onOpenRulesModal);
if (closeRulesModalBtn) closeRulesModalBtn.addEventListener("click", onCloseRulesModal);
if (createLeagueForm) createLeagueForm.addEventListener("submit", onCreateLeague);
if (joinLeagueForm) joinLeagueForm.addEventListener("submit", onJoinLeague);
if (leagueVisibilityInput) leagueVisibilityInput.addEventListener("change", onLeagueVisibilityChange);
if (joinModeInput) joinModeInput.addEventListener("change", onJoinModeChange);
if (leagueSelect) leagueSelect.addEventListener("change", onSwitchLeague);
if (copyCodeBtn) copyCodeBtn.addEventListener("click", onCopyLeagueCode);
if (adminLeagueListEl) adminLeagueListEl.addEventListener("click", onAdminLeagueListClick);
if (cancelProfileBtn) cancelProfileBtn.addEventListener("click", onCancelProfileEdit);
if (profileEditForm) profileEditForm.addEventListener("submit", onSaveProfileSettings);

setInterval(renderDeadlineCountdown, 1000);
window.addEventListener("hashchange", onRouteChange);
document.addEventListener("click", onDocumentClick);
document.addEventListener("keydown", onDocumentKeydown);

initializeApp();

async function initializeApp() {
  hydrateSquadCache();
  hydrateFixtureCache();
  hydrateScorerStatsCache();
  onLeagueVisibilityChange();
  onJoinModeChange();
  applyRouteIntent(getRouteIntentFromUrl(), { syncHash: true });
  render();

  const backgroundSync = Promise.allSettled([
    syncUpcomingFixturesFromChelsea(),
    maybeRefreshChelseaSquad(),
    syncScorerStatsFromTheSportsDb()
  ]);

  if (!initSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    state.overallLeaderboardStatus = "Leaderboard unavailable right now.";
    await backgroundSync;
    render();
    return;
  }

  const {
    data: { session }
  } = await state.client.auth.getSession();
  state.session = session;
  applyRouteIntent(getRouteIntentFromUrl(), { syncHash: false });
  await loadRegisteredUserCount();
  await reloadAuthedData();
  if (state.topView === "leagues") {
    await ensureOverallLeaderboardLoaded();
  }
  render();

  state.client.auth.onAuthStateChange(async (_event, sessionUpdate) => {
    state.session = sessionUpdate;
    applyRouteIntent(getRouteIntentFromUrl(), { syncHash: false });
    render();
    await loadRegisteredUserCount();
    await reloadAuthedData();
    if (state.topView === "leagues") {
      await ensureOverallLeaderboardLoaded();
    }
    render();
  });

  await backgroundSync;
  render();
}

function onRouteChange() {
  applyRouteIntent(getRouteIntentFromUrl(), { syncHash: false });
  if (state.topView === "leagues") {
    ensureOverallLeaderboardLoaded().then(render);
    if (isAdminUser()) {
      loadAdminLeagues().then(render);
    }
  }
  render();
}

function setTopView(view) {
  state.topView = view;
  if (view !== "results") {
    state.showRulesModal = false;
  }
  if (view !== "predict") {
    state.loginPanelOpen = false;
  }
  syncRouteHash();
  if (view === "leagues") {
    ensureOverallLeaderboardLoaded().then(render);
    if (isAdminUser()) {
      loadAdminLeagues().then(render);
    }
  }
  render();
}

function setResultsTab(tab) {
  state.topView = "results";
  state.resultsTab = tab;
  state.showRulesModal = false;
  syncRouteHash();
  render();
}

function setScorerCompetition(competition) {
  state.scorerCompetition = SCORER_COMPETITION_KEYS.includes(competition) ? competition : "all";
  renderTopScorers();
  renderNavigation();
}

function setLeaderboardScope(scope) {
  state.topView = "leagues";
  state.resultsTab = "fixtures";
  state.leaderboardScope = scope === "league" ? "league" : "global";
  syncRouteHash();
  render();
}

function onToggleAccountMenu(event) {
  event.stopPropagation();
  state.accountMenuOpen = !state.accountMenuOpen;
  renderNavigation();
}

function onDocumentClick(event) {
  if (state.showRulesModal && rulesModalEl && event.target === rulesModalEl) {
    onCloseRulesModal();
    return;
  }
  if (!state.accountMenuOpen) {
    return;
  }
  const accountMenuDropdown = document.getElementById("account-menu-dropdown");
  const accountMenuBtn = document.getElementById("account-menu-btn");
  if (!accountMenuDropdown || !accountMenuBtn) {
    state.accountMenuOpen = false;
    return;
  }
  const clickedInsideMenu = accountMenuDropdown.contains(event.target) || accountMenuBtn.contains(event.target);
  if (!clickedInsideMenu) {
    state.accountMenuOpen = false;
    renderNavigation();
  }
}

function onDocumentKeydown(event) {
  if (event.key === "Escape") {
    if (state.showRulesModal) {
      onCloseRulesModal();
      return;
    }
    if (state.accountMenuOpen) {
      state.accountMenuOpen = false;
      renderNavigation();
    }
  }
}

function onOpenProfileFromAccount() {
  if (!state.session?.user) {
    return;
  }
  state.topView = "predict";
  state.accountMenuOpen = false;
  if (profileEditForm) profileEditForm.classList.remove("hidden");
  hydrateProfileEditorFields();
  syncRouteHash("profile");
  render();
}

function onOpenRulesModal() {
  state.showRulesModal = true;
  syncRouteHash("rules");
  render();
}

function onCloseRulesModal() {
  state.showRulesModal = false;
  syncRouteHash();
  render();
}

function onLeagueVisibilityChange() {
  const isPrivate = (leagueVisibilityInput?.value || "public") === "private";
  if (leaguePasswordWrap) leaguePasswordWrap.classList.toggle("inactive", !isPrivate);
  if (leaguePasswordInput) {
    leaguePasswordInput.required = isPrivate;
    if (!isPrivate) leaguePasswordInput.value = "";
  }
}

function onJoinModeChange() {
  const mode = joinModeInput?.value || "public";
  const isPrivate = mode === "private";
  if (joinCodeWrap) joinCodeWrap.classList.toggle("inactive", isPrivate);
  if (joinPrivateNameWrap) joinPrivateNameWrap.classList.toggle("inactive", !isPrivate);
  if (joinPrivatePasswordWrap) joinPrivatePasswordWrap.classList.toggle("inactive", !isPrivate);
  if (joinCodeInput) {
    joinCodeInput.required = !isPrivate;
    if (isPrivate) joinCodeInput.value = "";
  }
  if (joinPrivateNameInput) {
    joinPrivateNameInput.required = isPrivate;
    if (!isPrivate) joinPrivateNameInput.value = "";
  }
  if (joinPrivatePasswordInput) {
    joinPrivatePasswordInput.required = isPrivate;
    if (!isPrivate) joinPrivatePasswordInput.value = "";
  }
}

function getRouteIntentFromUrl() {
  const hashToken = normalizeRouteToken(window.location.hash.replace(/^#/, ""));
  const search = new URLSearchParams(window.location.search);
  const queryToken = normalizeRouteToken(search.get("tab") || search.get("view") || search.get("section") || "");
  const token = hashToken || queryToken;
  if (!token) {
    return { topView: "predict" };
  }

  if (token === "predict" || token === "home") {
    return { topView: "predict" };
  }
  if (token === "leagues" || token === "myleagues") {
    return { topView: "leagues" };
  }
  if (
    token === "results" ||
    token === "resultsfixtures" ||
    token === "fixtures" ||
    token === "fixturesoverviewpanel"
  ) {
    return { topView: "results", resultsTab: "fixtures" };
  }
  if (token === "resultspast" || token === "pastgames" || token === "past" || token === "pastoverviewpanel") {
    return { topView: "results", resultsTab: "past" };
  }
  if (token === "resultsstats" || token === "scorers" || token === "stats" || token === "scorersoverviewpanel") {
    return { topView: "results", resultsTab: "stats" };
  }
  if (
    token === "resultsleaderboards" ||
    token === "globalleaderboard" ||
    token === "leaderboard" ||
    token === "global" ||
    token === "globaloverviewpanel"
  ) {
    return { topView: "leagues", leaderboardScope: "global" };
  }
  if (token === "rules" || token === "gamerules" || token === "rulesoverviewpanel") {
    return { topView: "predict", showRulesModal: true };
  }
  if (token === "profile" || token === "editprofile" || token === "profileeditshell") {
    return { topView: "predict", openProfileEditor: true };
  }
  if (token === "leaguepanel") {
    return { topView: "leagues" };
  }
  return { topView: "predict" };
}

function normalizeRouteToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function applyRouteIntent(intent, options = {}) {
  const nextTop = ["predict", "leagues", "results"].includes(intent.topView) ? intent.topView : state.topView;
  state.topView = nextTop || "predict";
  state.resultsTab = ["fixtures", "past", "stats"].includes(intent.resultsTab)
    ? intent.resultsTab
    : state.resultsTab || "fixtures";
  state.leaderboardScope = intent.leaderboardScope === "league" ? "league" : state.leaderboardScope || "global";
  state.showRulesModal = Boolean(intent.showRulesModal);
  if (intent.openProfileEditor && state.session?.user && profileEditForm) {
    state.accountMenuOpen = true;
    profileEditForm.classList.remove("hidden");
    hydrateProfileEditorFields();
  }
  if (options.syncHash) {
    syncRouteHash();
  }
}

function syncRouteHash(forcedToken = "") {
  let token = forcedToken;
  if (!token) {
    if (state.showRulesModal) {
      token = "rules";
    } else if (state.topView === "predict") {
      token = "predict";
    } else if (state.topView === "leagues") {
      token = "leagues";
    } else if (state.topView === "results") {
      token = `results-${state.resultsTab}`;
    }
  }
  const nextHash = token ? `#${token}` : "";
  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
  }
}

function initSupabaseClient(url, key) {
  try {
    state.client = window.supabase.createClient(url, key);
    return true;
  } catch {
    state.client = null;
    return false;
  }
}

async function onLogIn(event) {
  event.preventDefault();
  if (!state.client) {
    alert("Supabase is unavailable right now.");
    return;
  }

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;
  if (!email || !password) {
    return;
  }

  const { error } = await state.client.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message);
    return;
  }

  loginForm.reset();
  state.loginPanelOpen = false;
  state.accountMenuOpen = false;
  syncRouteHash();
}

async function onLogOut() {
  if (!state.client || !state.session) {
    return;
  }
  const { error } = await state.client.auth.signOut();
  if (error) {
    alert(error.message);
    return;
  }
  state.accountMenuOpen = false;
  state.loginPanelOpen = false;
  if (profileEditForm) profileEditForm.classList.add("hidden");
  syncRouteHash();
}

async function onRefreshAll() {
  await syncUpcomingFixturesFromChelsea(true);
  await maybeRefreshChelseaSquad(true);
  await syncScorerStatsFromTheSportsDb(true);
  await ensureOverallLeaderboardLoaded(true);
  await reloadAuthedData();
  render();
}

async function loadOverallLeaderboard() {
  if (!state.client) {
    state.overallLeaderboard = [];
    state.overallLeaderboardStatus = "Leaderboard unavailable right now.";
    state.overallLeaderboardLoaded = true;
    return;
  }

  const { data, error } = await state.client.rpc("get_overall_leaderboard", { p_limit: 10 });
  if (error) {
    state.overallLeaderboard = [];
    state.overallLeaderboardStatus = "No global points data yet.";
    state.overallLeaderboardLoaded = true;
    return;
  }

  state.overallLeaderboard = Array.isArray(data) ? data : [];
  state.overallLeaderboardStatus =
    state.overallLeaderboard.length === 0 ? "No completed match results yet." : "Top players across all leagues.";
  state.overallLeaderboardLoaded = true;
}

async function ensureOverallLeaderboardLoaded(force = false) {
  if (!state.client) {
    return;
  }
  if (!force && state.overallLeaderboardLoaded) {
    return;
  }
  if (!force && overallLeaderboardLoadPromise) {
    await overallLeaderboardLoadPromise;
    return;
  }
  state.overallLeaderboardLoaded = false;
  overallLeaderboardLoadPromise = loadOverallLeaderboard().finally(() => {
    overallLeaderboardLoadPromise = null;
  });
  await overallLeaderboardLoadPromise;
}

async function loadRegisteredUserCount() {
  if (!state.client) {
    state.registeredUserCount = null;
    return;
  }

  const { data, error } = await state.client.rpc("get_registered_user_count");
  if (error) {
    state.registeredUserCount = null;
    return;
  }

  const count = Number(data);
  state.registeredUserCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : null;
}

async function reloadAuthedData() {
  state.leagues = [];
  state.activeLeagueMembers = [];
  state.activeLeagueFixtures = [];
  state.activeLeagueLeaderboard = [];
  state.adminLeagues = [];

  if (!state.client || !state.session?.user) {
    state.activeLeagueId = null;
    return;
  }

  await ensureGlobalLeagueMembership();
  await loadLeaguesForUser();
  if (state.leagues.length === 0) {
    await ensureDefaultLeagueForUser();
    await loadLeaguesForUser();
  }
  const globalLeague = getGlobalLeagueFromState();
  if (!state.activeLeagueId && state.leagues[0]) {
    state.activeLeagueId = globalLeague?.id || state.leagues[0].id;
  }

  if (!state.leagues.some((league) => league.id === state.activeLeagueId)) {
    state.activeLeagueId = globalLeague?.id || state.leagues[0]?.id || null;
  }

  if (state.activeLeagueId) {
    await loadActiveLeagueData();
    await maybeRefreshChelseaSquad();
  }

  if (isAdminUser()) {
    if (state.topView === "leagues") {
      await loadAdminLeagues();
    }
  }
}

async function ensureDefaultLeagueForUser() {
  const ownerId = state.session?.user?.id;
  if (!ownerId) {
    return;
  }

  const baseName = `${getCurrentUserDisplayName()}'s League`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const name = attempt === 0 ? baseName : `${baseName} ${attempt + 1}`;
    const { error } = await state.client.rpc("create_league", {
      p_name: name,
      p_is_public: true,
      p_join_password: null,
      p_display_name: getCurrentUserDisplayName(),
      p_country_code: getCurrentUserCountryCode()
    });
    if (!error) {
      await syncLeagueMemberProfileFields(getCurrentUserDisplayName(), getCurrentUserAvatarUrl());
      return;
    }
    if (isMissingFunctionError(error, "create_league")) {
      const created = await createLeagueLegacyPublic(name, ownerId);
      if (created) {
        await syncLeagueMemberProfileFields(getCurrentUserDisplayName(), getCurrentUserAvatarUrl());
        return;
      }
      continue;
    }
    if (!isUniqueViolation(error)) {
      console.error("Could not create default league", error?.message || error);
      return;
    }
  }
}

async function ensureGlobalLeagueMembership() {
  if (!state.client || !state.session?.user) {
    return;
  }

  const { error } = await state.client.rpc("ensure_global_league_membership", {
    p_display_name: getCurrentUserDisplayName(),
    p_country_code: getCurrentUserCountryCode()
  });
  if (!error) {
    return;
  }

  // Fallback for projects where migration hasn't been run yet.
  const ownerId = state.session.user.id;
  const existingLeagueResult = await state.client
    .from("leagues")
    .select("id, name, code, owner_id, created_at")
    .ilike("name", GLOBAL_LEAGUE_NAME)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const existingLeague = existingLeagueResult.data || null;
  const leagueId = existingLeague?.id || (await createLeagueLegacyPublic(GLOBAL_LEAGUE_NAME, ownerId))?.id;
  if (!leagueId) {
    return;
  }

  await state.client.from("league_members").upsert(
    {
      league_id: leagueId,
      user_id: ownerId,
      display_name: getCurrentUserDisplayName(),
      country_code: getCurrentUserCountryCode(),
      role: existingLeague?.owner_id === ownerId ? "owner" : "member"
    },
    { onConflict: "league_id,user_id" }
  );
}

async function onCreateLeague(event) {
  event.preventDefault();
  if (!state.session?.user) {
    return;
  }

  const name = leagueNameInput.value.trim();
  const visibility = leagueVisibilityInput?.value === "private" ? "private" : "public";
  const joinPassword = String(leaguePasswordInput?.value || "");
  if (!name) {
    return;
  }
  if (visibility === "private" && joinPassword.trim().length < 6) {
    alert("Private leagues require a password with at least 6 characters.");
    return;
  }

  const { data, error } = await state.client.rpc("create_league", {
    p_name: name,
    p_is_public: visibility === "public",
    p_join_password: visibility === "private" ? joinPassword : null,
    p_display_name: getCurrentUserDisplayName(),
    p_country_code: getCurrentUserCountryCode()
  });
  let leagueData = Array.isArray(data) ? data[0] : data;
  if (error || !leagueData) {
    if (visibility === "public" && isMissingFunctionError(error, "create_league")) {
      leagueData = await createLeagueLegacyPublic(name, state.session.user.id);
    }
    if (!leagueData) {
      alert(error?.message || "Could not create league right now.");
      return;
    }
  }

  await syncLeagueMemberProfileFields(getCurrentUserDisplayName(), getCurrentUserAvatarUrl());

  leagueNameInput.value = "";
  if (leaguePasswordInput) leaguePasswordInput.value = "";
  if (leagueVisibilityInput) leagueVisibilityInput.value = "public";
  onLeagueVisibilityChange();
  state.activeLeagueId = leagueData.id;
  await reloadAuthedData();
  render();
}

async function createLeagueLegacyPublic(name, ownerId) {
  let leagueData = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createLeagueCode();
    const result = await state.client
      .from("leagues")
      .insert({ name, code, owner_id: ownerId })
      .select("id, name, code, owner_id, created_at")
      .single();
    if (!result.error && result.data) {
      leagueData = result.data;
      break;
    }
    if (!isUniqueViolation(result.error)) {
      return null;
    }
  }
  if (!leagueData) {
    return null;
  }
  const { error: memberError } = await state.client.from("league_members").insert({
    league_id: leagueData.id,
    user_id: ownerId,
    display_name: getCurrentUserDisplayName(),
    country_code: getCurrentUserCountryCode(),
    role: "owner"
  });
  if (memberError) {
    return null;
  }
  leagueData.is_public = true;
  return leagueData;
}

async function onJoinLeague(event) {
  event.preventDefault();
  if (!state.session?.user) {
    return;
  }

  const mode = joinModeInput?.value || "public";
  let joinedLeagueId = null;
  let publicCode = "";

  if (mode === "private") {
    const privateName = String(joinPrivateNameInput?.value || "").trim();
    const privatePassword = String(joinPrivatePasswordInput?.value || "");
    if (!privateName || !privatePassword) {
      return;
    }
    const { data, error } = await state.client.rpc("join_private_league_by_name", {
      p_name: privateName,
      p_password: privatePassword,
      p_display_name: getCurrentUserDisplayName(),
      p_country_code: getCurrentUserCountryCode()
    });
    if (error) {
      alert(error.message);
      return;
    }
    joinedLeagueId = data || null;
  } else {
    publicCode = String(joinCodeInput?.value || "").trim().toUpperCase();
    if (!publicCode) {
      return;
    }
    const { data, error } = await state.client.rpc("join_league_by_code", {
      p_code: publicCode,
      p_display_name: getCurrentUserDisplayName(),
      p_country_code: getCurrentUserCountryCode()
    });
    if (error) {
      alert(error.message);
      return;
    }
    joinedLeagueId = data || null;
  }

  await syncLeagueMemberProfileFields(getCurrentUserDisplayName(), getCurrentUserAvatarUrl());

  if (joinCodeInput) joinCodeInput.value = "";
  if (joinPrivateNameInput) joinPrivateNameInput.value = "";
  if (joinPrivatePasswordInput) joinPrivatePasswordInput.value = "";
  await reloadAuthedData();
  const joined = state.leagues.find((league) => league.id === joinedLeagueId)
    || (publicCode ? state.leagues.find((league) => league.code === publicCode) : null);
  if (joined) {
    state.activeLeagueId = joined.id;
    await loadActiveLeagueData();
  }
  render();
}

function onSwitchLeague(event) {
  state.activeLeagueId = event.target.value || null;
  loadActiveLeagueData().then(render);
}

async function onCopyLeagueCode() {
  const league = getActiveLeague();
  if (!league) {
    return;
  }

  try {
    await navigator.clipboard.writeText(league.code);
    alert(`Copied ${league.code}`);
  } catch {
    alert(`League code: ${league.code}`);
  }
}

function onCancelProfileEdit() {
  if (profileEditForm) profileEditForm.classList.add("hidden");
  if (profileEditStatus) profileEditStatus.classList.add("hidden");
}

async function onSaveProfileSettings(event) {
  event.preventDefault();
  if (!state.client || !state.session?.user) {
    return;
  }

  const username = String(profileUsernameInput?.value || "").trim();
  const actualName = String(profileActualNameInput?.value || "").trim();
  const displayMode = String(profileDisplayModeInput?.value || "username");
  const preferredName = displayMode === "actual" ? actualName : username;

  if (!preferredName) {
    showProfileAck("Please choose a display name.", true);
    return;
  }
  if (username && containsBlockedUsernameLanguage(username)) {
    showProfileAck("That username is not allowed. Please choose another.", true);
    return;
  }

  const userMeta = state.session.user.user_metadata || {};
  let avatarUrl = String(userMeta.avatar_url || "").trim();
  const avatarFile = profileAvatarInput?.files?.[0];
  if (avatarFile) {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    const maxSizeBytes = 2 * 1024 * 1024;
    if (!allowedTypes.includes(avatarFile.type)) {
      showProfileAck("Please upload PNG, JPEG, or WEBP images only.", true);
      return;
    }
    if (avatarFile.size > maxSizeBytes) {
      showProfileAck("Profile picture must be 2MB or smaller.", true);
      return;
    }
    const ext = (avatarFile.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const safeExt = ext || "png";
    const path = `${state.session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const uploadResult = await state.client.storage.from("avatars").upload(path, avatarFile, {
      upsert: true,
      cacheControl: "3600",
      contentType: avatarFile.type
    });
    if (uploadResult.error) {
      showProfileAck("Avatar upload failed. Ensure the avatars storage bucket is set up.", true);
      return;
    }
    const { data: publicUrlData } = state.client.storage.from("avatars").getPublicUrl(path);
    avatarUrl = String(publicUrlData?.publicUrl || "").trim();
  }
  const nextMeta = {
    ...userMeta,
    username,
    actual_name: actualName,
    display_mode: displayMode,
    display_name: preferredName,
    avatar_url: avatarUrl
  };

  const { data: updateData, error: updateError } = await state.client.auth.updateUser({
    data: nextMeta
  });
  if (updateError) {
    showProfileAck(updateError.message, true);
    return;
  }

  const memberError = await syncLeagueMemberProfileFields(preferredName, avatarUrl);
  if (memberError) {
    showProfileAck(memberError.message, true);
    return;
  }

  if (updateData?.user && state.session) {
    state.session = { ...state.session, user: updateData.user };
  }
  showProfileAck("Profile updated successfully.", false);
  if (profileEditForm) profileEditForm.classList.add("hidden");
  await reloadAuthedData();
  render();
}

function showProfileAck(message, isError) {
  state.profileAck = {
    message,
    isError: Boolean(isError),
    at: Date.now()
  };
  renderProfileEditor();
}

function hydrateProfileEditorFields() {
  if (!state.session?.user) {
    return;
  }
  const meta = state.session.user.user_metadata || {};
  if (profileUsernameInput) profileUsernameInput.value = String(meta.username || "");
  if (profileActualNameInput) profileActualNameInput.value = String(meta.actual_name || "");
  if (profileDisplayModeInput) {
    const mode = meta.display_mode === "actual" ? "actual" : "username";
    profileDisplayModeInput.value = mode;
  }
  if (profileAvatarInput) profileAvatarInput.value = "";
  if (profileEditStatus) profileEditStatus.classList.add("hidden");
}

async function onSavePrediction(fixture, form, submitBtn = null) {
  if (!state.session?.user || !canPredictFixture(fixture)) {
    alert("Only the next fixture can be predicted, and it locks 90 minutes before kickoff.");
    return;
  }

  const hadExistingPrediction = fixture.predictions.some((row) => row.user_id === state.session.user.id);
  const idleLabel = hadExistingPrediction ? "Update Prediction" : "Save Prediction";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = hadExistingPrediction ? "Updating prediction..." : "Saving prediction...";
  }
  syncChelseaGoalsToScorerSelection(form);
  const chelseaGoals = parseGoals(form.querySelector(".pred-chelsea").value);
  const opponentGoals = parseGoals(form.querySelector(".pred-opponent").value);
  const selectedScorers = form.querySelector(".pred-scorer").value.trim();
  const predictedScorers = expandScorerSelectionsForStorage(selectedScorers);
  const firstScorerSelect = form.querySelector(".pred-first-scorer");
  let firstScorer = firstScorerSelect?.value?.trim() || "";
  if (chelseaGoals === null || opponentGoals === null) {
    return;
  }
  if (chelseaGoals > 0 && (!selectedScorers || !firstScorer)) {
    return;
  }
  if (chelseaGoals === 0) {
    firstScorer = "None";
  }

  const { error } = await state.client.from("predictions").upsert(
    {
      fixture_id: fixture.id,
      user_id: state.session.user.id,
      chelsea_goals: chelseaGoals,
      opponent_goals: opponentGoals,
      first_scorer: firstScorer,
      predicted_scorers: predictedScorers,
      submitted_at: new Date().toISOString()
    },
    { onConflict: "fixture_id,user_id" }
  );

  if (error) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = idleLabel;
    }
    alert(error.message);
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = hadExistingPrediction ? "Prediction updated" : "Prediction saved";
  }
  state.lastPredictionAck = {
    fixtureId: fixture.id,
    updated: hadExistingPrediction,
    at: Date.now()
  };
  cachePredictionScorers(fixture.id, state.session.user.id, selectedScorers);
  await loadActiveLeagueData();
  render();
  if (state.predictionButtonFlashTimeoutId) {
    clearTimeout(state.predictionButtonFlashTimeoutId);
  }
  state.predictionButtonFlashTimeoutId = setTimeout(() => {
    state.predictionButtonFlashTimeoutId = null;
    render();
  }, 5000);
}

async function onSaveResult(fixture, form) {
  const chelseaGoals = parseGoals(form.querySelector(".result-chelsea").value);
  const opponentGoals = parseGoals(form.querySelector(".result-opponent").value);
  const firstScorer = form.querySelector(".result-scorer").value.trim();
  if (chelseaGoals === null || opponentGoals === null || !firstScorer) {
    return;
  }

  const { error } = await state.client.from("results").upsert(
    {
      fixture_id: fixture.id,
      chelsea_goals: chelseaGoals,
      opponent_goals: opponentGoals,
      first_scorer: firstScorer,
      chelsea_scorers: expandScorerSelectionsForStorage(firstScorer),
      saved_by: state.session.user.id,
      saved_at: new Date().toISOString()
    },
    { onConflict: "fixture_id" }
  );

  if (error) {
    alert(error.message);
    return;
  }

  await loadActiveLeagueData();
  render();
}

async function loadLeaguesForUser() {
  let { data, error } = await state.client
    .from("league_members")
    .select("league_id, leagues(id, name, code, owner_id, created_at, is_public)")
    .eq("user_id", state.session.user.id);

  if (error && /is_public|column/i.test(error.message || "")) {
    const fallback = await state.client
      .from("league_members")
      .select("league_id, leagues(id, name, code, owner_id, created_at)")
      .eq("user_id", state.session.user.id);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    alert(error.message);
    return;
  }

  state.leagues = (data || [])
    .map((row) => (row.leagues ? { ...row.leagues, is_public: row.leagues.is_public !== false } : null))
    .filter(Boolean)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

async function loadAdminLeagues() {
  const { data, error } = await state.client.rpc("admin_list_leagues");
  if (error) {
    state.adminLeagues = [];
    return;
  }
  state.adminLeagues = Array.isArray(data) ? data : [];
}

async function loadActiveLeagueData() {
  const league = getActiveLeague();
  if (!league) {
    state.activeLeagueMembers = [];
    state.activeLeagueFixtures = [];
    return;
  }

  const [memberResult, fixtureResult] = await Promise.all([
    state.client
      .from("league_members")
      .select("user_id, display_name, country_code, role")
      .eq("league_id", league.id),
    state.client
      .from("fixtures")
      .select(
        "id, league_id, kickoff, opponent, competition, created_by, created_at, results(chelsea_goals, opponent_goals, first_scorer, chelsea_scorers)"
      )
      .eq("league_id", league.id)
      .order("kickoff", { ascending: true })
  ]);

  if (memberResult.error) {
    alert(memberResult.error.message);
    return;
  }
  if (fixtureResult.error) {
    alert(fixtureResult.error.message);
    return;
  }

  state.activeLeagueMembers = memberResult.data || [];
  state.activeLeagueFixtures = (fixtureResult.data || []).map((fixture) => ({
    ...fixture,
    predictions: [],
    result: (fixture.results && fixture.results[0]) || null
  }));

  await ensureUpcomingFixturesImported();
  await syncCompletedResultsFromChelsea();
  await Promise.all([loadMyPredictionsForActiveFixtures(), loadLeagueLeaderboard()]);
}

async function syncCompletedResultsFromChelsea() {
  const league = getActiveLeague();
  const member = getCurrentMember();
  if (!league || !member || (!isAdminUser() && member.role !== "owner") || !state.session?.user) {
    return;
  }

  const pending = state.activeLeagueFixtures.filter(
    (fixture) => !fixture.result && new Date(fixture.kickoff).getTime() < Date.now()
  );
  if (pending.length === 0) {
    return;
  }

  try {
    const response = await fetch(CHELSEA_FIXTURES_PROXY_URL);
    if (!response.ok) {
      return;
    }
    const text = await response.text();
    const parsed = parseChelseaFixturesPage(text).filter(
      (fixture) => Number.isInteger(fixture.resultChelsea) && Number.isInteger(fixture.resultOpponent)
    );
    if (parsed.length === 0) {
      return;
    }

    const byKey = new Map();
    parsed.forEach((fixture) => {
      byKey.set(
        `${fixture.date}::${normalizeOpponentName(fixture.opponent)}`,
        fixture
      );
    });

    const upserts = [];
    pending.forEach((fixture) => {
      const date = new Date(fixture.kickoff).toISOString().slice(0, 10);
      const key = `${date}::${normalizeOpponentName(fixture.opponent)}`;
      const match = byKey.get(key);
      if (!match) {
        return;
      }
      upserts.push({
        fixture_id: fixture.id,
        chelsea_goals: match.resultChelsea,
        opponent_goals: match.resultOpponent,
        first_scorer: "Unknown",
        chelsea_scorers: "",
        saved_by: state.session.user.id,
        saved_at: new Date().toISOString()
      });
    });

    if (upserts.length === 0) {
      return;
    }

    const { error } = await state.client.from("results").upsert(upserts, { onConflict: "fixture_id" });
    if (error) {
      return;
    }

    const scoreByFixture = new Map(upserts.map((row) => [row.fixture_id, row]));
    state.activeLeagueFixtures = state.activeLeagueFixtures.map((fixture) => ({
      ...fixture,
      result: scoreByFixture.has(fixture.id)
        ? {
            chelsea_goals: scoreByFixture.get(fixture.id).chelsea_goals,
            opponent_goals: scoreByFixture.get(fixture.id).opponent_goals,
            first_scorer: scoreByFixture.get(fixture.id).first_scorer,
            chelsea_scorers: scoreByFixture.get(fixture.id).chelsea_scorers
          }
        : fixture.result
    }));
  } catch {
    // Keep manual results flow if sync fails.
  }
}

async function ensureUpcomingFixturesImported() {
  const league = getActiveLeague();
  const member = getCurrentMember();
  if (!league || !member || (!isAdminUser() && member.role !== "owner")) {
    return;
  }

  const existingKeys = new Set(
    state.activeLeagueFixtures.map((fixture) => fixtureKey(fixture.kickoff, fixture.opponent, fixture.competition))
  );

  const sourceUpcoming = getUpcomingFixturesForDisplay();
  const missing = sourceUpcoming.map((f) => ({
    league_id: league.id,
    kickoff: buildFixtureKickoffIso(f.date, f.kickoffUk),
    opponent: f.opponent,
    competition: f.competition,
    created_by: state.session.user.id
  })).filter((row) => !existingKeys.has(fixtureKey(row.kickoff, row.opponent, row.competition)));

  if (missing.length === 0) {
    return;
  }

  const { error } = await state.client.from("fixtures").insert(missing);
  if (error) {
    console.error("Auto import failed", error.message);
    return;
  }

  const { data } = await state.client
    .from("fixtures")
    .select(
      "id, league_id, kickoff, opponent, competition, created_by, created_at, results(chelsea_goals, opponent_goals, first_scorer, chelsea_scorers)"
    )
    .eq("league_id", league.id)
    .order("kickoff", { ascending: true });

  state.activeLeagueFixtures = (data || []).map((fixture) => ({
    ...fixture,
    predictions: [],
    result: (fixture.results && fixture.results[0]) || null
  }));
}

async function loadMyPredictionsForActiveFixtures() {
  if (!state.session?.user || state.activeLeagueFixtures.length === 0) {
    return;
  }

  const fixtureIds = state.activeLeagueFixtures.map((fixture) => fixture.id);
  const { data, error } = await state.client
    .from("predictions")
    .select("fixture_id, user_id, chelsea_goals, opponent_goals, first_scorer, predicted_scorers")
    .eq("user_id", state.session.user.id)
    .in("fixture_id", fixtureIds);

  if (error) {
    return;
  }

  const byFixture = new Map((data || []).map((prediction) => [prediction.fixture_id, prediction]));
  state.activeLeagueFixtures = state.activeLeagueFixtures.map((fixture) => {
    const mine = byFixture.get(fixture.id);
    return {
      ...fixture,
      predictions: mine ? [mine] : []
    };
  });
}

async function loadLeagueLeaderboard() {
  const league = getActiveLeague();
  if (!league) {
    state.activeLeagueLeaderboard = [];
    return;
  }
  const { data, error } = await state.client.rpc("get_league_leaderboard", { p_league_id: league.id });
  if (error) {
    state.activeLeagueLeaderboard = [];
    return;
  }
  state.activeLeagueLeaderboard = Array.isArray(data) ? data : [];
}

function render() {
  renderNavigation();
  renderUpcomingFixtures();
  renderTopScorers();
  renderOverallLeaderboard();
  renderPastGames();
  renderProfileEditor();
  renderAdminConsole();

  const isConnected = Boolean(state.client);
  const isAuthed = Boolean(state.session?.user);
  if (authLoginFields) authLoginFields.classList.toggle("hidden", isAuthed || !state.loginPanelOpen);
  if (loginBtn) loginBtn.classList.toggle("hidden", isAuthed || !state.loginPanelOpen);
  if (loginPanelEl) loginPanelEl.classList.toggle("hidden", isAuthed || !state.loginPanelOpen);
  if (accountSignInLink) accountSignInLink.classList.toggle("hidden", isAuthed || !isConnected);
  if (accountSignUpLink) accountSignUpLink.classList.toggle("hidden", isAuthed || !isConnected);
  if (accountEditProfileTopLink) accountEditProfileTopLink.classList.toggle("hidden", !isAuthed || !isConnected);
  if (accountQuickSignOutBtn) accountQuickSignOutBtn.classList.toggle("hidden", !isAuthed || !isConnected);
  if (predictSigninPromptEl) predictSigninPromptEl.classList.toggle("hidden", isAuthed);

  if (!isConnected) {
    if (sessionStatus) {
      sessionStatus.textContent = "";
      sessionStatus.classList.add("hidden");
    }
    renderMatchdayAttendance();
    return;
  }

  if (sessionStatus) {
    sessionStatus.textContent = "";
    sessionStatus.classList.add("hidden");
  }

  if (leagueLoginPromptEl) leagueLoginPromptEl.classList.toggle("hidden", isAuthed);
  if (createLeagueForm) createLeagueForm.classList.toggle("hidden", !isAuthed);
  if (joinLeagueForm) joinLeagueForm.classList.toggle("hidden", !isAuthed);
  if (leagueSelect?.closest("label")) {
    leagueSelect.closest("label").classList.toggle("hidden", !isAuthed);
  }
  const activeLeague = getActiveLeague();
  const isGlobalActive = isGlobalLeague(activeLeague);
  if (copyCodeBtn) copyCodeBtn.classList.toggle("hidden", !isAuthed || isGlobalActive);
  if (leagueMetaNoteEl) leagueMetaNoteEl.classList.toggle("hidden", !isAuthed || !isGlobalActive);

  if (isAuthed) {
    renderLeagueSelect();
    renderLeaderboard();
  } else {
    leaderboardEl.textContent = "";
  }
  renderFixtures();
  renderDeadlineCountdown();
  renderMatchdayAttendance();
}

function renderProfileEditor() {
  if (!profileEditShellEl) {
    return;
  }
  const isAuthed = Boolean(state.session?.user);
  const isFormVisible = Boolean(profileEditForm && !profileEditForm.classList.contains("hidden"));
  const ack = state.profileAck;
  const isFresh = Boolean(ack) && Date.now() - ack.at < 7000;
  profileEditShellEl.classList.toggle("hidden", !isAuthed || (!isFormVisible && !isFresh));
  if (isAuthed && isFormVisible) {
    hydrateProfileEditorFields();
  }
  if (profileEditStatus) {
    profileEditStatus.classList.toggle("hidden", !isFresh);
    profileEditStatus.classList.toggle("error-text", Boolean(ack?.isError));
    profileEditStatus.classList.toggle("success-text", Boolean(ack && !ack.isError));
    profileEditStatus.textContent = isFresh ? ack.message : "";
  }
}

function renderOverallLeaderboard() {
  if (!overallLeaderboardEl || !overallLeaderboardStatusEl) {
    return;
  }

  overallLeaderboardEl.textContent = "";
  if (state.overallLeaderboard.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No players ranked yet. Rankings appear after the first completed match.";
    const cta = document.createElement("button");
    cta.type = "button";
    cta.className = "ghost-btn";
    cta.textContent = "Make a prediction";
    cta.addEventListener("click", () => setTopView("predict"));
    li.appendChild(cta);
    overallLeaderboardEl.appendChild(li);
  } else {
    state.overallLeaderboard.forEach((row, index) => {
      const li = document.createElement("li");
      const left = createLeaderboardIdentity(index, row.display_name || "Player", row.country_code || "GB", row.avatar_url);
      li.appendChild(left);
      const pts = document.createElement("span");
      pts.className = "leader-points";
      pts.textContent = `${row.points || 0} pts`;
      li.appendChild(pts);
      overallLeaderboardEl.appendChild(li);
    });
  }

  overallLeaderboardStatusEl.textContent = state.overallLeaderboardStatus;
}

function renderNavigation() {
  const showPredict = state.topView === "predict";
  const showLeagues = state.topView === "leagues";
  const showResults = state.topView === "results";
  if (topnavPredictBtn) {
    topnavPredictBtn.classList.toggle("active", showPredict);
    topnavPredictBtn.setAttribute("aria-selected", String(showPredict));
  }
  if (topnavLeaguesBtn) {
    topnavLeaguesBtn.classList.toggle("active", showLeagues);
    topnavLeaguesBtn.setAttribute("aria-selected", String(showLeagues));
  }
  if (topnavResultsBtn) {
    topnavResultsBtn.classList.toggle("active", showResults);
    topnavResultsBtn.setAttribute("aria-selected", String(showResults));
  }
  if (predictViewEl) predictViewEl.classList.toggle("hidden", !showPredict);
  if (resultsViewEl) resultsViewEl.classList.toggle("hidden", !showResults);
  if (leaguePanel) leaguePanel.classList.toggle("hidden", !showLeagues);

  const showFixtures = state.resultsTab === "fixtures";
  const showPast = state.resultsTab === "past";
  const showStats = state.resultsTab === "stats";
  if (resultsFixturesTabBtn) {
    resultsFixturesTabBtn.classList.toggle("active", showFixtures);
    resultsFixturesTabBtn.setAttribute("aria-selected", String(showFixtures));
  }
  if (resultsPastTabBtn) {
    resultsPastTabBtn.classList.toggle("active", showPast);
    resultsPastTabBtn.setAttribute("aria-selected", String(showPast));
  }
  if (resultsStatsTabBtn) {
    resultsStatsTabBtn.classList.toggle("active", showStats);
    resultsStatsTabBtn.setAttribute("aria-selected", String(showStats));
  }

  if (fixturesOverviewPanel) fixturesOverviewPanel.classList.toggle("hidden", !showFixtures);
  if (pastOverviewPanel) pastOverviewPanel.classList.toggle("hidden", !showPast);
  if (scorersOverviewPanel) scorersOverviewPanel.classList.toggle("hidden", !showStats);
  if (statsAllTabBtn) {
    const active = state.scorerCompetition === "all";
    statsAllTabBtn.classList.toggle("active", active);
    statsAllTabBtn.setAttribute("aria-selected", String(active));
  }
  if (statsPlTabBtn) {
    const active = state.scorerCompetition === "premier_league";
    statsPlTabBtn.classList.toggle("active", active);
    statsPlTabBtn.setAttribute("aria-selected", String(active));
  }
  if (statsUclTabBtn) {
    const active = state.scorerCompetition === "champions_league";
    statsUclTabBtn.classList.toggle("active", active);
    statsUclTabBtn.setAttribute("aria-selected", String(active));
  }
  if (statsFaTabBtn) {
    const active = state.scorerCompetition === "fa_cup";
    statsFaTabBtn.classList.toggle("active", active);
    statsFaTabBtn.setAttribute("aria-selected", String(active));
  }
  if (rulesModalEl) rulesModalEl.classList.toggle("hidden", !state.showRulesModal);
}

function renderPastGames() {
  if (!pastGamesListEl || !pastGamesStatusEl) {
    return;
  }

  pastGamesListEl.textContent = "";
  if (!state.session?.user) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "Log in to view your past predictions.";
    pastGamesListEl.appendChild(li);
    pastGamesStatusEl.textContent = "Your history appears here after you sign in.";
    return;
  }

  const completedFixtures = state.activeLeagueFixtures
    .filter((fixture) => fixture.result)
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

  if (completedFixtures.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No completed games yet.";
    pastGamesListEl.appendChild(li);
    pastGamesStatusEl.textContent = "Completed fixtures with your score will show here.";
    return;
  }

  let totalPoints = 0;
  completedFixtures.forEach((fixture) => {
    const li = document.createElement("li");
    li.className = "past-game-item";

    const myPrediction = fixture.predictions.find((row) => row.user_id === state.session.user.id);
    const headline = document.createElement("p");
    headline.className = "past-game-head";
    headline.textContent = `${formatKickoff(fixture.kickoff)} | Chelsea vs ${fixture.opponent}`;
    li.appendChild(headline);

    const result = fixture.result;
    const resultLine = document.createElement("p");
    resultLine.className = "past-game-line";
    resultLine.textContent = `Result: Chelsea ${result.chelsea_goals} - ${result.opponent_goals} ${fixture.opponent} | First scorer: ${result.first_scorer}`;
    li.appendChild(resultLine);

    if (myPrediction) {
      const detail = scorePrediction(myPrediction, result);
      totalPoints += detail.points;
      const predictionLine = document.createElement("p");
      predictionLine.className = "past-game-line";
      predictionLine.textContent = `Your prediction: Chelsea ${myPrediction.chelsea_goals} - ${myPrediction.opponent_goals} ${fixture.opponent} | First scorer: ${myPrediction.first_scorer} | Match points: ${detail.points}`;
      li.appendChild(predictionLine);
    } else {
      const missingLine = document.createElement("p");
      missingLine.className = "past-game-line";
      missingLine.textContent = "You did not submit a prediction for this game.";
      li.appendChild(missingLine);
    }

    pastGamesListEl.appendChild(li);
  });

  pastGamesStatusEl.textContent = `Your completed games: ${completedFixtures.length} | Total points from completed games: ${totalPoints}`;
}

function renderUpcomingFixtures() {
  const upcoming = getUpcomingFixturesForDisplay();

  const visible = state.showAllUpcoming ? upcoming : upcoming.slice(0, 5);
  upcomingListEl.textContent = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No upcoming fixtures in this list.";
    upcomingListEl.appendChild(empty);
  } else {
    visible.forEach((fixture) => {
      const li = document.createElement("li");
      li.textContent = `${formatFixtureDate(fixture.date)}: Chelsea vs ${fixture.opponent} (${fixture.competition}) | KO ${formatUkKickoff(
        fixture.kickoffUk
      )}`;
      upcomingListEl.appendChild(li);
    });
  }

  upcomingToggleBtn.disabled = upcoming.length <= 5;
  upcomingToggleBtn.textContent = state.showAllUpcoming ? "Show Less" : "Show All";
  upcomingSourceEl.textContent = state.upcomingSourceText;
}

function renderTopScorers() {
  if (!scorersTableBody || !scorersSourceEl) {
    return;
  }

  const key = SCORER_COMPETITION_KEYS.includes(state.scorerCompetition) ? state.scorerCompetition : "all";
  const competitionData =
    state.scorerDataByCompetition[key] || FALLBACK_TOP_SCORERS_BY_COMPETITION[key] || FALLBACK_TOP_SCORERS_BY_COMPETITION.all;
  const players = competitionData.players || [];

  scorersTableBody.textContent = "";
  if (scorersTitleEl) {
    scorersTitleEl.textContent = `Top Chelsea Scorers (${competitionData.label})`;
  }

  if (players.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No scorer data available yet for this competition.";
    row.appendChild(cell);
    scorersTableBody.appendChild(row);
    scorersSourceEl.textContent = competitionData.source;
    return;
  }

  players.forEach((player, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = String(index + 1);
    row.appendChild(rankCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = player.name;
    row.appendChild(nameCell);

    const appsCell = document.createElement("td");
    appsCell.textContent = String(player.apps);
    row.appendChild(appsCell);

    const goalsCell = document.createElement("td");
    goalsCell.textContent = String(player.goals);
    row.appendChild(goalsCell);

    const gpgCell = document.createElement("td");
    const apps = Number(player.apps) || 0;
    const goals = Number(player.goals) || 0;
    gpgCell.textContent = apps > 0 ? (goals / apps).toFixed(2) : "0.00";
    row.appendChild(gpgCell);

    scorersTableBody.appendChild(row);
  });

  scorersSourceEl.textContent = competitionData.source;
}

function renderLeagueSelect() {
  leagueSelect.textContent = "";
  if (state.leagues.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No leagues yet";
    leagueSelect.appendChild(option);
    return;
  }

  state.leagues.forEach((league) => {
    const option = document.createElement("option");
    option.value = league.id;
    const visibilityLabel = league.is_public ? "Public" : "Private";
    option.textContent = `${league.name} (${visibilityLabel} • ${league.code})`;
    leagueSelect.appendChild(option);
  });

  if (state.activeLeagueId) {
    leagueSelect.value = state.activeLeagueId;
  }
}

function renderAdminConsole() {
  if (!adminConsoleEl || !adminLeagueListEl) {
    return;
  }
  const show = Boolean(state.session?.user) && isAdminUser();
  adminConsoleEl.classList.toggle("hidden", !show);
  if (!show) {
    adminLeagueListEl.textContent = "";
    return;
  }

  adminLeagueListEl.textContent = "";
  if (state.adminLeagues.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No leagues found.";
    adminLeagueListEl.appendChild(li);
    return;
  }

  state.adminLeagues.forEach((league) => {
    const li = document.createElement("li");
    li.className = "admin-league-item";
    const meta = document.createElement("span");
    const visibility = league.is_public ? "Public" : "Private";
    meta.textContent = `${league.name} (${visibility} • ${league.code})`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "danger-btn";
    btn.dataset.leagueId = league.id;
    btn.dataset.leagueName = league.name;
    btn.textContent = "Delete league";
    li.appendChild(meta);
    li.appendChild(btn);
    adminLeagueListEl.appendChild(li);
  });
}

async function onAdminLeagueListClick(event) {
  const deleteBtn = event.target.closest("button[data-league-id]");
  if (!deleteBtn || !state.client || !isAdminUser()) {
    return;
  }
  const leagueId = deleteBtn.dataset.leagueId;
  const leagueName = deleteBtn.dataset.leagueName || "this league";
  if (!leagueId) {
    return;
  }
  const ok = window.confirm(`Delete "${leagueName}" and all associated data? This cannot be undone.`);
  if (!ok) {
    return;
  }

  deleteBtn.disabled = true;
  const { error } = await state.client.rpc("admin_delete_league", { p_league_id: leagueId });
  if (error) {
    alert(error.message);
    deleteBtn.disabled = false;
    return;
  }

  await reloadAuthedData();
  render();
}

function renderLeaderboard() {
  leaderboardEl.textContent = "";
  if (!state.activeLeagueId || state.activeLeagueLeaderboard.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No members yet.";
    leaderboardEl.appendChild(li);
    return;
  }

  const rows = state.activeLeagueLeaderboard;

  rows.forEach((row, index) => {
    const li = document.createElement("li");
    const safeName = row.display_name || "Player";
    const suffix = row.role === "owner" ? " (Owner)" : "";
    const left = createLeaderboardIdentity(index, `${safeName}${suffix}`.trim(), row.country_code, row.avatar_url);
    li.appendChild(left);
    const right = document.createElement("span");
    right.className = "leader-points";
    right.textContent = `${row.points} pts`;
    li.appendChild(right);
    leaderboardEl.appendChild(li);
  });
}

function renderFixtures() {
  fixturesListEl.textContent = "";
  const isAuthed = Boolean(state.session?.user);

  const realNextFixture = getNextFixtureForPrediction();
  const nextFixture = realNextFixture || getFallbackNextFixture();
  const fixturesToRender = nextFixture ? [nextFixture] : [];

  if (fixturesToRender.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No upcoming fixture available for prediction.";
    fixturesListEl.appendChild(li);
    return;
  }

  fixturesToRender.forEach((fixture) => {
    const fragment = fixtureTemplate.content.cloneNode(true);
    const fixtureBody = fragment.querySelector(".fixture-body");
    const titleEl = fragment.querySelector(".fixture-title");
    const badgeEl = fragment.querySelector(".status-badge");
    const metaEl = fragment.querySelector(".fixture-meta");
    const predictionForm = fragment.querySelector(".prediction-form");
    const predChelseaInput = predictionForm.querySelector(".pred-chelsea");
    const predOpponentInput = predictionForm.querySelector(".pred-opponent");
    const predScorerInput = predictionForm.querySelector(".pred-scorer");
    const predFirstScorerSelect = predictionForm.querySelector(".pred-first-scorer");
    const predictionAckEl = predictionForm.querySelector(".prediction-ack");
    const opponentNameEl = predictionForm.querySelector(".pred-opponent-name");
    const opponentScoreValueEl = predictionForm.querySelector(".score-value-opponent");
    const chelseaScoreValueEl = predictionForm.querySelector(".score-value-chelsea");
    const opponentMinusBtn = predictionForm.querySelector(".score-minus-opponent");
    const opponentPlusBtn = predictionForm.querySelector(".score-plus-opponent");
    const chelseaMinusBtn = predictionForm.querySelector(".score-minus-chelsea");
    const chelseaPlusBtn = predictionForm.querySelector(".score-plus-chelsea");
    const savePredictionBtn = predictionForm.querySelector("button[type='submit']");
    const scorerSelectedEl = predictionForm.querySelector(".selected-scorer-value");
    const scorerListEl = predictionForm.querySelector(".selected-scorer-list");
    const chelseaChipWrap = predictionForm.querySelector(".player-chip-wrap-chelsea");

    titleEl.textContent = `Chelsea vs ${fixture.opponent}`;
    metaEl.textContent = `${formatKickoff(fixture.kickoff)} | ${fixture.competition}`;
    const isFallbackFixture = String(fixture.id || "").startsWith("fallback-");
    const isNextFixture = Boolean(realNextFixture && fixture.id === realNextFixture.id);
    const locked = isFixtureLockedForPrediction(fixture);
    const predictionEnabled = isAuthed && isNextFixture && !locked;
    const hasStarted = Date.now() >= new Date(fixture.kickoff).getTime();

    const myPrediction = isAuthed
      ? fixture.predictions.find((row) => row.user_id === state.session.user.id)
      : null;
    if (isFallbackFixture) {
      badgeEl.textContent = "Loading fixture...";
    } else if (!isAuthed) {
      badgeEl.textContent = "Log in to submit";
    } else if (fixture.result) {
      badgeEl.textContent = "Result Saved";
    } else if (hasStarted) {
      badgeEl.textContent = "Closed";
    } else if (locked) {
      badgeEl.textContent = "Locked (90m cutoff)";
    } else if (myPrediction) {
      badgeEl.textContent = "Saved (editable)";
    } else {
      badgeEl.textContent = "Open";
    }

    predChelseaInput.value = "0";
    predOpponentInput.value = "0";
    predScorerInput.value = "";
    let initialFirstScorer = "";
    if (myPrediction) {
      predChelseaInput.value = String(myPrediction.chelsea_goals);
      predOpponentInput.value = String(myPrediction.opponent_goals);
      initialFirstScorer = normalizeFirstScorerValue(myPrediction.first_scorer);
      const cachedSelections = readCachedPredictionScorers(fixture.id, state.session.user.id);
      if (cachedSelections) {
        predScorerInput.value = cachedSelections;
      } else if (myPrediction.predicted_scorers) {
        predScorerInput.value = compressExpandedScorerStorage(myPrediction.predicted_scorers);
      } else if (looksLikeScorerSelections(myPrediction.first_scorer)) {
        predScorerInput.value = myPrediction.first_scorer;
        if (!initialFirstScorer) {
          initialFirstScorer = parseScorerSelections(myPrediction.first_scorer)[0]?.name || "";
        }
      }
    }
    predFirstScorerSelect.dataset.initialValue = initialFirstScorer;

    opponentNameEl.textContent = fixture.opponent;
    const chelseaPlayers = getChelseaRegisteredPlayers();
    renderScorerButtons(
      chelseaChipWrap,
      chelseaPlayers,
      predScorerInput,
      scorerSelectedEl,
      scorerListEl
    );
    parseScorerList(predScorerInput.value).forEach((name) => {
      if (!chelseaPlayers.some((player) => player.toLowerCase() === name.toLowerCase())) {
        appendCustomScorerButton(chelseaChipWrap, name, predScorerInput, scorerSelectedEl, scorerListEl);
      }
    });
    refreshScorerState(predictionForm, predScorerInput.value, scorerSelectedEl, scorerListEl);

    const syncScoreDisplay = () => {
      const opponentValue = Number.parseInt(predOpponentInput.value || "0", 10);
      const chelseaValue = Number.parseInt(predChelseaInput.value || "0", 10);
      opponentScoreValueEl.textContent = String(Number.isFinite(opponentValue) ? Math.max(opponentValue, 0) : 0);
      chelseaScoreValueEl.textContent = String(Number.isFinite(chelseaValue) ? Math.max(chelseaValue, 0) : 0);
    };
    syncScoreDisplay();

    const stepScore = (inputEl, delta) => {
      const current = Number.parseInt(inputEl.value || "0", 10);
      const safeCurrent = Number.isFinite(current) ? current : 0;
      inputEl.value = String(Math.max(0, safeCurrent + delta));
      syncScoreDisplay();
    };
    opponentMinusBtn.addEventListener("click", () => stepScore(predOpponentInput, -1));
    opponentPlusBtn.addEventListener("click", () => stepScore(predOpponentInput, 1));
    chelseaMinusBtn.disabled = true;
    chelseaPlusBtn.disabled = true;
    chelseaMinusBtn.title = "Chelsea goals are auto-set from selected goalscorers.";
    chelseaPlusBtn.title = "Chelsea goals are auto-set from selected goalscorers.";
    if (savePredictionBtn) {
      savePredictionBtn.textContent = myPrediction ? "Update Prediction" : "Save Prediction";
      savePredictionBtn.title = predictionEnabled
        ? "You can edit your prediction until 90 minutes before kick-off."
        : "";
    }
    const ack = state.lastPredictionAck;
    const isRecentAck =
      Boolean(ack) &&
      ack.fixtureId === fixture.id &&
      Date.now() - ack.at < 120000;
    const isVeryRecentAck =
      Boolean(ack) &&
      ack.fixtureId === fixture.id &&
      Date.now() - ack.at < 3500;
    if (savePredictionBtn && predictionEnabled && isVeryRecentAck) {
      savePredictionBtn.textContent = ack.updated ? "Prediction updated" : "Prediction saved";
    }
    if (predictionAckEl && myPrediction) {
      // Button-level feedback now handles update confirmation; keep the banner for first-time saves only.
      const shouldShowAck = !(isRecentAck && ack?.updated);
      if (!shouldShowAck) {
        predictionAckEl.classList.add("hidden");
        predictionAckEl.classList.remove("fresh");
        predictionForm.classList.remove("saved-state");
        predictionAckEl.textContent = "";
      } else {
      predictionAckEl.classList.remove("hidden");
      predictionAckEl.classList.toggle("fresh", isRecentAck);
      predictionForm.classList.toggle("saved-state", isRecentAck);
      predictionAckEl.textContent = isRecentAck
        ? ack.updated
          ? "Prediction updated. Nice one."
          : "Prediction saved. Nice one."
        : "Prediction saved. You can edit it until lock time.";
      }
    } else if (predictionAckEl) {
      predictionAckEl.classList.add("hidden");
      predictionAckEl.classList.remove("fresh");
      predictionForm.classList.remove("saved-state");
      predictionAckEl.textContent = "";
    }

    if (!predictionEnabled) {
      predictionForm.querySelectorAll("input, button, select").forEach((node) => {
        node.disabled = true;
      });
      if (isFallbackFixture && savePredictionBtn) {
        savePredictionBtn.textContent = "Loading next fixture...";
      } else if (!isAuthed && savePredictionBtn) {
        savePredictionBtn.textContent = "Create account to submit";
      }
    }

    predictionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      onSavePrediction(fixture, predictionForm, savePredictionBtn);
    });

    fixturesListEl.appendChild(fragment);
  });
}

function renderScorerButtons(container, players, targetInput, selectedLabelEl, selectedListEl) {
  container.textContent = "";
  container.classList.add("position-groups-layout");
  const grouped = new Map(POSITION_GROUPS.map((group) => [group, []]));
  players.forEach((player) => {
    if (isGoalkeeperName(player)) {
      return;
    }
    const group = getPositionGroupForPlayer(player);
    if (!grouped.has(group)) {
      grouped.set("Midfielders", []);
    }
    grouped.get(group).push(player);
  });

  POSITION_GROUPS.forEach((group) => {
    const names = (grouped.get(group) || []).slice().sort((a, b) => a.localeCompare(b));
    if (names.length === 0) {
      return;
    }
    const chipsWrap = ensurePositionGroupChipWrap(container, group);
    names.forEach((player) => {
      chipsWrap.appendChild(
        createPlayerChipButton(container, player, targetInput, selectedLabelEl, selectedListEl)
      );
    });
  });
}

function appendCustomScorerButton(container, player, targetInput, selectedLabelEl, selectedListEl) {
  if (isGoalkeeperName(player)) {
    return;
  }
  const chipsWrap = ensurePositionGroupChipWrap(container, getPositionGroupForPlayer(player));
  chipsWrap.appendChild(createPlayerChipButton(container, player, targetInput, selectedLabelEl, selectedListEl));
}

function createPlayerChipButton(container, player, targetInput, selectedLabelEl, selectedListEl) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "player-chip";
  button.dataset.player = player;
  button.dataset.baseLabel = player;
  button.textContent = player;
  button.addEventListener("click", () => {
    incrementScorerSelection(
      container.closest(".prediction-form"),
      targetInput,
      player,
      selectedLabelEl,
      selectedListEl
    );
  });
  return button;
}

function ensurePositionGroupChipWrap(container, groupName) {
  const groupKey = groupName.toLowerCase().replace(/\s+/g, "-");
  let groupEl = container.querySelector(`.position-group[data-group='${groupKey}']`);
  if (!groupEl) {
    groupEl = document.createElement("div");
    groupEl.className = "position-group";
    groupEl.dataset.group = groupKey;

    const title = document.createElement("p");
    title.className = "position-group-title";
    title.textContent = groupName;

    const chipsWrap = document.createElement("div");
    chipsWrap.className = "player-chip-wrap";

    groupEl.appendChild(title);
    groupEl.appendChild(chipsWrap);
    container.appendChild(groupEl);
  }
  return groupEl.querySelector(".player-chip-wrap");
}

function getPositionGroupForPlayer(playerName) {
  return getPositionGroupFromMap(playerName) || "Midfielders";
}

function isGoalkeeperName(playerName) {
  return getPositionGroupFromMap(playerName) === "Goalkeepers";
}

function getPositionGroupFromMap(playerName) {
  const dynamicMap = state.teamSquadPositionGroup?.Chelsea || {};
  return dynamicMap[playerName] || CHELSEA_PLAYER_POSITION_GROUP[playerName] || "";
}

function inferPositionGroupFromText(text) {
  const raw = String(text || "").toLowerCase();
  if (!raw.trim()) {
    return "";
  }
  if (raw.includes("goalkeeper")) {
    return "Goalkeepers";
  }
  if (
    raw.includes("defender") ||
    raw.includes("wing-back") ||
    raw.includes("right-back") ||
    raw.includes("left-back") ||
    raw.includes("centre-back") ||
    raw.includes("center-back") ||
    raw.includes("full-back")
  ) {
    return "Defenders";
  }
  if (raw.includes("midfielder") || raw.includes("midfield")) {
    return "Midfielders";
  }
  if (raw.includes("winger") || raw.includes("forward") || raw.includes("striker")) {
    return "Forwards";
  }
  return "";
}

function incrementScorerSelection(formEl, targetInput, player, selectedLabelEl, selectedListEl) {
  const current = parseScorerSelections(targetInput.value);
  const index = current.findIndex((entry) => entry.name.toLowerCase() === player.toLowerCase());
  const maxGoalsPerPlayer = 5;

  if (index === -1) {
    current.push({ name: player, count: 1 });
  } else {
    const nextCount = current[index].count + 1;
    if (nextCount > maxGoalsPerPlayer) {
      current.splice(index, 1);
    } else {
      current[index].count = nextCount;
    }
  }

  targetInput.value = serializeScorerSelections(current);
  refreshScorerState(formEl, targetInput.value, selectedLabelEl, selectedListEl);
}

function refreshScorerState(formEl, selectedRaw, selectedLabelEl, selectedListEl) {
  const selectedPlayers = parseScorerSelections(selectedRaw);
  formEl.querySelectorAll(".player-chip").forEach((chip) => {
    const match = selectedPlayers.find((entry) => entry.name.toLowerCase() === chip.dataset.player.toLowerCase());
    chip.classList.toggle("active", Boolean(match));
    const baseLabel = chip.dataset.baseLabel || chip.dataset.player;
    chip.textContent = match && match.count > 1 ? `${baseLabel} x${match.count}` : baseLabel;
  });
  selectedLabelEl.textContent =
    selectedPlayers.length > 0
      ? selectedPlayers.map((entry) => (entry.count > 1 ? `${entry.name} x${entry.count}` : entry.name)).join(", ")
      : "None";
  renderSelectedScorerList(formEl, selectedPlayers, selectedListEl);
  syncFirstScorerControl(formEl, selectedPlayers);
  syncChelseaGoalsToScorerSelection(formEl, selectedPlayers);
}

function syncFirstScorerControl(formEl, selectedPlayers) {
  const selectEl = formEl.querySelector(".pred-first-scorer");
  if (!selectEl) {
    return;
  }
  const previousValue = (selectEl.value || selectEl.dataset.initialValue || "").trim();
  selectEl.textContent = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent =
    selectedPlayers.length > 0 ? "Select from chosen scorers" : "No scorer if Chelsea score 0";
  selectEl.appendChild(placeholder);

  selectedPlayers.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.name;
    option.textContent = entry.name;
    selectEl.appendChild(option);
  });

  const matched = selectedPlayers.find((entry) => entry.name.toLowerCase() === previousValue.toLowerCase());
  selectEl.value = matched ? matched.name : "";
  selectEl.disabled = selectedPlayers.length === 0;
  selectEl.required = selectedPlayers.length > 0;
  delete selectEl.dataset.initialValue;
}

function syncChelseaGoalsToScorerSelection(formEl, selectedPlayers) {
  const predChelseaInput = formEl.querySelector(".pred-chelsea");
  if (!predChelseaInput) {
    return;
  }
  const selections =
    selectedPlayers ||
    parseScorerSelections(formEl.querySelector(".pred-scorer")?.value || "");
  const goals = selections.reduce((sum, entry) => sum + entry.count, 0);
  predChelseaInput.value = String(goals);
  const chelseaScoreValueEl = formEl.querySelector(".score-value-chelsea");
  if (chelseaScoreValueEl) {
    chelseaScoreValueEl.textContent = String(goals);
  }
}

function renderSelectedScorerList(formEl, selections, listEl) {
  if (!listEl) {
    return;
  }
  listEl.textContent = "";
  if (selections.length === 0) {
    const li = document.createElement("li");
    li.className = "selected-scorer-item empty";
    li.textContent = "No goalscorers selected yet.";
    listEl.appendChild(li);
    return;
  }

  const targetInput = formEl.querySelector(".pred-scorer");
  const selectedLabelEl = formEl.querySelector(".selected-scorer-value");
  selections.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "selected-scorer-item";

    const name = document.createElement("span");
    name.textContent = entry.name;

    const controls = document.createElement("div");
    controls.className = "selected-scorer-controls";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "mini-step-btn";
    minusBtn.textContent = "-";
    minusBtn.addEventListener("click", () => {
      adjustScorerCount(formEl, targetInput, entry.name, -1, selectedLabelEl, listEl);
    });

    const count = document.createElement("span");
    count.className = "selected-scorer-count";
    count.textContent = String(entry.count);

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "mini-step-btn";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => {
      adjustScorerCount(formEl, targetInput, entry.name, 1, selectedLabelEl, listEl);
    });

    controls.appendChild(minusBtn);
    controls.appendChild(count);
    controls.appendChild(plusBtn);
    li.appendChild(name);
    li.appendChild(controls);
    listEl.appendChild(li);
  });
}

function adjustScorerCount(formEl, targetInput, player, delta, selectedLabelEl, selectedListEl) {
  const current = parseScorerSelections(targetInput.value);
  const index = current.findIndex((entry) => entry.name.toLowerCase() === player.toLowerCase());
  if (index === -1) {
    return;
  }
  current[index].count += delta;
  if (current[index].count <= 0) {
    current.splice(index, 1);
  } else if (current[index].count > 5) {
    current[index].count = 5;
  }
  targetInput.value = serializeScorerSelections(current);
  refreshScorerState(formEl, targetInput.value, selectedLabelEl, selectedListEl);
}

function getChelseaRegisteredPlayers() {
  const squad = state.teamSquads.Chelsea || CHELSEA_REGISTERED_PLAYERS;
  return squad.filter((name) => !isGoalkeeperName(name));
}

async function maybeRefreshChelseaSquad(force = false) {
  const teamName = "Chelsea";
  const fetchedAt = state.teamSquadFetchedAt[teamName] || 0;
  if (!force && fetchedAt && Date.now() - fetchedAt < SQUAD_CACHE_MAX_AGE_MS) {
    return;
  }
  if (state.squadFetchInFlight[teamName]) {
    return;
  }
  state.squadFetchInFlight[teamName] = true;
  try {
    const { players, positionGroups } = await fetchChelseaSquadFromOfficial();
    if (players.length >= 15) {
      state.teamSquads.Chelsea = players;
      if (positionGroups && typeof positionGroups === "object") {
        state.teamSquadPositionGroup.Chelsea = {
          ...CHELSEA_PLAYER_POSITION_GROUP,
          ...positionGroups
        };
      }
      state.teamSquadFetchedAt[teamName] = Date.now();
      persistSquadCache();
      render();
    }
  } catch {
    // Keep fallback list if official fetch fails.
  } finally {
    delete state.squadFetchInFlight[teamName];
  }
}

async function fetchChelseaSquadFromOfficial() {
  const response = await fetch(CHELSEA_SQUAD_PROXY_URL);
  if (!response.ok) {
    throw new Error(`Chelsea squad fetch failed: ${response.status}`);
  }
  const text = await response.text();
  const lines = text.split("\n");
  const re = /\[([^\]]+)\]\(https:\/\/www\.chelseafc\.com\/en\/teams\/profile\/[^)]+\)/g;
  const names = [];
  const positionGroups = {};
  const seen = new Set();
  let match;
  while ((match = re.exec(text)) !== null) {
    const name = (match[1] || "").trim();
    if (!name || name.length < 3) {
      continue;
    }
    const key = name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    names.push(name);

    const linkLineIndex = lines.findIndex((line) => line.includes(`[${name}](`));
    if (linkLineIndex !== -1) {
      const context = lines.slice(Math.max(0, linkLineIndex - 3), linkLineIndex + 1).join(" ");
      const inferredGroup = inferPositionGroupFromText(context);
      if (inferredGroup) {
        positionGroups[name] = inferredGroup;
      }
    }
  }
  return {
    players: names.sort((a, b) => a.localeCompare(b)),
    positionGroups
  };
}

function summarizeMemberScore(userId) {
  return state.activeLeagueFixtures.reduce(
    (acc, fixture) => {
      if (!fixture.result) {
        return acc;
      }
      const prediction = fixture.predictions.find((row) => row.user_id === userId);
      if (!prediction) {
        return acc;
      }
      const detail = scorePrediction(prediction, fixture.result);
      acc.points += detail.points;
      acc.exact += detail.exact ? 1 : 0;
      acc.correctResult += detail.correctResult ? 1 : 0;
      return acc;
    },
    { points: 0, exact: 0, correctResult: 0 }
  );
}

function scorePrediction(prediction, result) {
  const exact =
    prediction.chelsea_goals === result.chelsea_goals &&
    prediction.opponent_goals === result.opponent_goals;
  const correctResult =
    getOutcome(prediction.chelsea_goals, prediction.opponent_goals) ===
    getOutcome(result.chelsea_goals, result.opponent_goals);
  const predictedFirstScorer = normalizeFirstScorerValue(prediction.first_scorer);
  const resultFirstScorer = normalizeFirstScorerValue(result.first_scorer);
  const predictedScorerSelections = prediction.predicted_scorers
    ? parseScorerSelections(compressExpandedScorerStorage(prediction.predicted_scorers))
    : parseScorerSelections(prediction.first_scorer);
  const resultScorerSelections = result.chelsea_scorers
    ? parseScorerSelections(compressExpandedScorerStorage(result.chelsea_scorers))
    : parseScorerSelections(result.first_scorer);
  const correctGoalscorers = countCorrectGoalscorers(predictedScorerSelections, resultScorerSelections);
  const correctScorer =
    result.chelsea_goals > 0 &&
    Boolean(predictedFirstScorer) &&
    Boolean(resultFirstScorer) &&
    predictedFirstScorer.toLowerCase() === resultFirstScorer.toLowerCase();
  const correctChelseaGoals = prediction.chelsea_goals === result.chelsea_goals;
  const correctOpponentGoals = prediction.opponent_goals === result.opponent_goals;
  const perfect = exact && correctScorer;

  let points = 0;
  if (exact) {
    points += SCORING.exactScore;
  } else if (correctResult) {
    points += SCORING.correctResult;
  }
  if (correctChelseaGoals) {
    points += SCORING.correctChelseaGoals;
  }
  if (correctOpponentGoals) {
    points += SCORING.correctOpponentGoals;
  }
  if (correctGoalscorers > 0) {
    points += correctGoalscorers * SCORING.correctGoalscorer;
  }
  if (correctScorer) {
    points += SCORING.correctFirstScorer;
  }
  if (perfect) {
    points += SCORING.perfectBonus;
  }

  return {
    points,
    exact,
    correctResult,
    correctScorer,
    correctGoalscorers,
    correctChelseaGoals,
    correctOpponentGoals,
    perfect
  };
}

function getOutcome(chelsea, opponent) {
  if (chelsea > opponent) return "W";
  if (chelsea < opponent) return "L";
  return "D";
}

function getActiveLeague() {
  return state.leagues.find((league) => league.id === state.activeLeagueId) || null;
}

function getGlobalLeagueFromState() {
  return state.leagues.find((league) => String(league.name || "").trim().toLowerCase() === GLOBAL_LEAGUE_NAME.toLowerCase())
    || null;
}

function isGlobalLeague(league) {
  return String(league?.name || "").trim().toLowerCase() === GLOBAL_LEAGUE_NAME.toLowerCase();
}

function getCurrentMember() {
  if (!state.session?.user) {
    return null;
  }
  return state.activeLeagueMembers.find((member) => member.user_id === state.session.user.id) || null;
}

function getCurrentUserDisplayName() {
  const metaName = state.session?.user?.user_metadata?.display_name;
  if (typeof metaName === "string" && metaName.trim()) {
    return metaName.trim();
  }
  const email = state.session?.user?.email || "player";
  return email.split("@")[0];
}

function getCurrentUserCountryCode() {
  const raw = state.session?.user?.user_metadata?.country_code;
  if (typeof raw !== "string") {
    return "GB";
  }
  const code = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "GB";
}

function getCurrentUserAvatarUrl() {
  const raw = state.session?.user?.user_metadata?.avatar_url;
  return typeof raw === "string" ? raw.trim() : "";
}

function isAdminUser() {
  const email = String(state.session?.user?.email || "").trim().toLowerCase();
  return email === ADMIN_EMAIL;
}

function countryCodeToFlag(code) {
  if (!/^[A-Z]{2}$/.test(code || "")) {
    return "";
  }
  const chars = [...code].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...chars);
}

function formatMemberName(displayName, countryCode) {
  const flag = countryCodeToFlag(countryCode || "");
  return flag ? `${flag} ${displayName}` : displayName;
}

function createLeaderboardIdentity(index, displayName, countryCode, avatarUrl) {
  const wrap = document.createElement("div");
  wrap.className = "leader-identity";

  const rank = document.createElement("span");
  rank.className = "leader-rank";
  rank.textContent = `${index + 1}.`;

  const avatar = createAvatarElement(displayName, avatarUrl);

  const name = document.createElement("span");
  name.className = "leader-name";
  name.textContent = formatMemberName(displayName, countryCode || "GB");

  wrap.appendChild(rank);
  wrap.appendChild(avatar);
  wrap.appendChild(name);
  return wrap;
}

function createAvatarElement(displayName, avatarUrl) {
  const fallback = document.createElement("span");
  fallback.className = "leader-avatar fallback";
  const initial = String(displayName || "P").trim().charAt(0).toUpperCase() || "P";
  fallback.textContent = initial;

  const cleanUrl = String(avatarUrl || "").trim();
  if (!cleanUrl) {
    return fallback;
  }

  const img = document.createElement("img");
  img.className = "leader-avatar";
  img.src = cleanUrl;
  img.alt = `${displayName} avatar`;
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("error", () => {
    img.replaceWith(fallback);
  });
  return img;
}

function createLeagueCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SW6";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function isUniqueViolation(error) {
  return error?.code === "23505" || /duplicate|unique/i.test(error?.message || "");
}

function isMissingFunctionError(error, fnName) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("does not exist") && message.includes(String(fnName || "").toLowerCase());
}

async function syncLeagueMemberProfileFields(displayName, avatarUrl) {
  if (!state.client || !state.session?.user) {
    return null;
  }
  const payload = { display_name: displayName };
  if (avatarUrl) {
    payload.avatar_url = avatarUrl;
  }

  let { error } = await state.client
    .from("league_members")
    .update(payload)
    .eq("user_id", state.session.user.id);

  if (error && /avatar_url/i.test(error.message || "")) {
    const retry = await state.client
      .from("league_members")
      .update({ display_name: displayName })
      .eq("user_id", state.session.user.id);
    error = retry.error;
  }
  return error || null;
}

function isFixtureLocked(fixture) {
  return isFixtureLockedForPrediction(fixture);
}

function formatKickoff(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatFixtureDate(value) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function parseGoals(value) {
  const number = Number.parseInt(value, 10);
  if (!Number.isInteger(number) || number < 0) {
    return null;
  }
  return number;
}

function parseScorerList(rawValue) {
  return parseScorerSelections(rawValue).map((entry) => entry.name);
}

function looksLikeScorerSelections(rawValue) {
  const value = String(rawValue || "").trim();
  return value.includes(",") || /\sx\d+\b/i.test(value);
}

function normalizeFirstScorerValue(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value || /^none$/i.test(value) || /^unknown$/i.test(value)) {
    return "";
  }
  if (!looksLikeScorerSelections(value)) {
    return value;
  }
  return parseScorerSelections(value)[0]?.name || "";
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

function countCorrectGoalscorers(predictedSelections, resultSelections) {
  if (!Array.isArray(predictedSelections) || !Array.isArray(resultSelections)) {
    return 0;
  }
  const resultCounts = new Map();
  resultSelections.forEach((entry) => {
    const key = String(entry.name || "").trim().toLowerCase();
    if (!key || key === "unknown" || key === "none") {
      return;
    }
    const current = resultCounts.get(key) || 0;
    resultCounts.set(key, current + Math.max(1, Number.parseInt(entry.count, 10) || 1));
  });

  let matches = 0;
  predictedSelections.forEach((entry) => {
    const key = String(entry.name || "").trim().toLowerCase();
    if (!key || key === "unknown" || key === "none") {
      return;
    }
    const predictedCount = Math.max(1, Number.parseInt(entry.count, 10) || 1);
    const available = resultCounts.get(key) || 0;
    const hit = Math.min(predictedCount, available);
    if (hit > 0) {
      matches += hit;
      resultCounts.set(key, available - hit);
    }
  });
  return matches;
}

function expandScorerSelectionsForStorage(rawValue) {
  const selections = parseScorerSelections(rawValue);
  const expanded = [];
  selections.forEach((entry) => {
    const count = Math.max(1, Number.parseInt(entry.count, 10) || 1);
    for (let i = 0; i < count; i += 1) {
      expanded.push(entry.name);
    }
  });
  return expanded.join(", ");
}

function compressExpandedScorerStorage(rawValue) {
  const selections = parseScorerSelections(rawValue);
  return serializeScorerSelections(selections);
}

function readCachedPredictionScorers(fixtureId, userId) {
  const cache = getPredictionScorersCache();
  return cache[`${fixtureId}:${userId}`] || "";
}

function cachePredictionScorers(fixtureId, userId, scorerValue) {
  const cache = getPredictionScorersCache();
  const key = `${fixtureId}:${userId}`;
  const value = String(scorerValue || "").trim();
  if (!value) {
    delete cache[key];
  } else {
    cache[key] = value;
  }
  try {
    localStorage.setItem(PREDICTION_SCORERS_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache write failures.
  }
}

function getPredictionScorersCache() {
  const raw = localStorage.getItem(PREDICTION_SCORERS_CACHE_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function parseScorerSelections(rawValue) {
  const byName = new Map();
  String(rawValue || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((part) => {
      const match = part.match(/^(.+?)(?:\s*x(\d+))?$/i);
      const name = (match?.[1] || "").trim();
      const parsedCount = Number.parseInt(match?.[2] || "1", 10);
      const count = Number.isInteger(parsedCount) && parsedCount > 0 ? parsedCount : 1;
      if (!name) {
        return;
      }
      const key = name.toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        existing.count += count;
      } else {
        byName.set(key, { name, count });
      }
    });
  return [...byName.values()];
}

function serializeScorerSelections(selections) {
  return selections
    .map((entry) => (entry.count > 1 ? `${entry.name} x${entry.count}` : entry.name))
    .join(", ");
}

function getUpcomingFixturesForDisplay() {
  const now = Date.now();
  return state.upcomingFixtures.filter((fixture) => {
    const kickoff = new Date(`${fixture.date}T00:00:00`).getTime();
    return Number.isFinite(kickoff) && kickoff >= now - 24 * 60 * 60 * 1000;
  });
}

function hydrateSquadCache() {
  const raw = localStorage.getItem(SQUAD_CACHE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.version !== SQUAD_CACHE_VERSION) {
      return;
    }
    const squads = parsed.squads && typeof parsed.squads === "object" ? parsed.squads : {};
    const positionGroups =
      parsed.positionGroups && typeof parsed.positionGroups === "object" ? parsed.positionGroups : {};
    const fetchedAt = parsed.fetchedAt && typeof parsed.fetchedAt === "object" ? parsed.fetchedAt : {};
    Object.entries(squads).forEach(([teamName, players]) => {
      if (!Array.isArray(players) || players.length === 0) {
        return;
      }
      state.teamSquads[teamName] = players.filter((name) => typeof name === "string");
    });
    Object.entries(positionGroups).forEach(([teamName, positionMap]) => {
      if (!positionMap || typeof positionMap !== "object") {
        return;
      }
      state.teamSquadPositionGroup[teamName] = {
        ...(state.teamSquadPositionGroup[teamName] || {}),
        ...positionMap
      };
    });
    Object.entries(fetchedAt).forEach(([teamName, ts]) => {
      if (typeof ts === "number" && Number.isFinite(ts)) {
        state.teamSquadFetchedAt[teamName] = ts;
      }
    });
  } catch {
    // Ignore malformed squad cache.
  }
}

function persistSquadCache() {
  try {
    localStorage.setItem(
      SQUAD_CACHE_KEY,
      JSON.stringify({
        version: SQUAD_CACHE_VERSION,
        squads: state.teamSquads,
        positionGroups: state.teamSquadPositionGroup,
        fetchedAt: state.teamSquadFetchedAt
      })
    );
  } catch {
    // Ignore localStorage write failures.
  }
}

function hydrateScorerStatsCache() {
  const raw = localStorage.getItem(THE_SPORTS_DB_SCORERS_CACHE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.version !== THE_SPORTS_DB_SCORERS_CACHE_VERSION ||
      parsed.season !== THE_SPORTS_DB_SEASON ||
      typeof parsed.syncedAt !== "string" ||
      !parsed.data ||
      typeof parsed.data !== "object"
    ) {
      return;
    }
    const nextData = cloneCompetitionDataMap(FALLBACK_TOP_SCORERS_BY_COMPETITION);
    SCORER_COMPETITION_KEYS.forEach((key) => {
      const row = parsed.data[key];
      if (!row || typeof row !== "object") {
        return;
      }
      const safePlayers = Array.isArray(row.players)
        ? row.players
            .map((player) => ({
              name: String(player?.name || "").trim(),
              apps: Number.parseInt(player?.apps, 10) || 0,
              goals: Number.parseInt(player?.goals, 10) || 0
            }))
            .filter((player) => player.name)
        : [];
      nextData[key] = {
        label: String(row.label || nextData[key].label),
        players: safePlayers,
        source: String(row.source || nextData[key].source)
      };
    });
    state.scorerDataByCompetition = nextData;
  } catch {
    // Ignore malformed scorer cache.
  }
}

function persistScorerStatsCache(dataByCompetition, syncedAtIso) {
  try {
    localStorage.setItem(
      THE_SPORTS_DB_SCORERS_CACHE_KEY,
      JSON.stringify({
        version: THE_SPORTS_DB_SCORERS_CACHE_VERSION,
        season: THE_SPORTS_DB_SEASON,
        syncedAt: syncedAtIso,
        data: dataByCompetition
      })
    );
  } catch {
    // Ignore localStorage write failures.
  }
}

function getCachedScorerStatsSyncTime() {
  const raw = localStorage.getItem(THE_SPORTS_DB_SCORERS_CACHE_KEY);
  if (!raw) {
    return 0;
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed.version !== THE_SPORTS_DB_SCORERS_CACHE_VERSION ||
      parsed.season !== THE_SPORTS_DB_SEASON ||
      typeof parsed.syncedAt !== "string"
    ) {
      return 0;
    }
    const syncedAt = new Date(parsed.syncedAt).getTime();
    return Number.isFinite(syncedAt) ? syncedAt : 0;
  } catch {
    return 0;
  }
}

function normalizeSportsDbScorerRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  const name = String(row.strPlayer || row.strPlayerName || row.strPlayerAlternate || "").trim();
  if (!name) {
    return null;
  }
  const goals = Number.parseInt(
    row.intGoals || row.strGoals || row.intGoal || row.goals || "0",
    10
  );
  const apps = Number.parseInt(
    row.intApps || row.intAppearances || row.intGames || row.strAppearances || "0",
    10
  );
  return {
    name,
    goals: Number.isFinite(goals) ? Math.max(0, goals) : 0,
    apps: Number.isFinite(apps) ? Math.max(0, apps) : 0,
    teamId: String(row.idTeam || "").trim(),
    teamName: String(row.strTeam || "").trim()
  };
}

function toSportsDbScorerRows(payload) {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const buckets = [
    payload.topscorers,
    payload.playerstats,
    payload.player,
    payload.players,
    payload.table
  ];
  for (const bucket of buckets) {
    if (!Array.isArray(bucket)) {
      continue;
    }
    const rows = bucket
      .map(normalizeSportsDbScorerRow)
      .filter(Boolean)
      .filter((row) => row.teamId === CHELSEA_TEAM_ID || row.teamName.toLowerCase() === "chelsea")
      .map((row) => ({ name: row.name, apps: row.apps, goals: row.goals }))
      .filter((row) => row.goals > 0 || row.apps > 0);
    if (rows.length > 0) {
      return rows;
    }
  }
  return [];
}

function mergeScorerRows(rows) {
  const byName = new Map();
  rows.forEach((row) => {
    const name = String(row?.name || "").trim();
    if (!name) {
      return;
    }
    const key = name.toLowerCase();
    const current = byName.get(key) || { name, apps: 0, goals: 0 };
    current.apps += Number.parseInt(row.apps, 10) || 0;
    current.goals += Number.parseInt(row.goals, 10) || 0;
    byName.set(key, current);
  });
  return [...byName.values()]
    .sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.apps !== a.apps) return b.apps - a.apps;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 20);
}

async function fetchSportsDbTopScorersForLeague(leagueId) {
  const url = new URL(`${THE_SPORTS_DB_BASE_URL}/lookuptopscorers.php`);
  url.searchParams.set("l", leagueId);
  url.searchParams.set("s", THE_SPORTS_DB_SEASON);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const payload = await response.json();
  return mergeScorerRows(toSportsDbScorerRows(payload));
}

function getEmptyScorerCompetitionData() {
  const blank = cloneCompetitionDataMap(FALLBACK_TOP_SCORERS_BY_COMPETITION);
  blank.all.players = [];
  blank.all.source = "Loading scorer data from TheSportsDB...";
  blank.premier_league.players = [];
  blank.champions_league.players = [];
  blank.fa_cup.players = [];
  return blank;
}

async function syncScorerStatsFromTheSportsDb(force = false) {
  const cachedAt = getCachedScorerStatsSyncTime();
  if (!force && cachedAt && Date.now() - cachedAt < THE_SPORTS_DB_SCORERS_CACHE_MAX_AGE_MS) {
    return;
  }

  const nextData = getEmptyScorerCompetitionData();
  const syncedAtIso = new Date().toISOString();
  const syncedAtLabel = new Date(syncedAtIso).toLocaleString();
  const sourcePrefix = "Data source: TheSportsDB official endpoint lookuptopscorers.php";
  let liveRowsCount = 0;

  await Promise.all(
    Object.entries(THE_SPORTS_DB_SCORER_COMPETITIONS).map(async ([key, competition]) => {
      try {
        const rows = await fetchSportsDbTopScorersForLeague(competition.leagueId);
        nextData[key] = {
          label: competition.label,
          players: rows,
          source:
            rows.length > 0
              ? `${sourcePrefix} (league ${competition.leagueId}, season ${THE_SPORTS_DB_SEASON}). Last updated: ${syncedAtLabel}.`
              : `${sourcePrefix} returned no Chelsea scorer rows for this competition (league ${competition.leagueId}, season ${THE_SPORTS_DB_SEASON}). Last checked: ${syncedAtLabel}.`
        };
        if (rows.length > 0) {
          liveRowsCount += rows.length;
        }
      } catch (error) {
        nextData[key] = {
          label: competition.label,
          players: [],
          source: `${sourcePrefix} unavailable right now for this competition. Last checked: ${syncedAtLabel}.`
        };
      }
    })
  );

  const aggregateRows = mergeScorerRows([
    ...nextData.premier_league.players,
    ...nextData.champions_league.players,
    ...nextData.fa_cup.players
  ]);
  nextData.all = {
    label: "All Competitions 2025/26",
    players: aggregateRows.length > 0 ? aggregateRows : FALLBACK_TOP_SCORERS_BY_COMPETITION.all.players,
    source:
      aggregateRows.length > 0
        ? `${sourcePrefix} aggregated across Premier League, Champions League, and FA Cup. Last updated: ${syncedAtLabel}.`
        : liveRowsCount > 0
          ? `${sourcePrefix} provided partial competition data only. Last checked: ${syncedAtLabel}.`
          : FALLBACK_TOP_SCORERS_BY_COMPETITION.all.source
  };

  state.scorerDataByCompetition = nextData;
  persistScorerStatsCache(nextData, syncedAtIso);
}

function hydrateFixtureCache() {
  const raw = localStorage.getItem(FIXTURE_CACHE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed.version !== FIXTURE_CACHE_VERSION ||
      parsed.sourceUrl !== CHELSEA_FIXTURES_URL ||
      !Array.isArray(parsed.fixtures) ||
      typeof parsed.syncedAt !== "string"
    ) {
      return;
    }
    if (!parsed.fixtures.every((entry) => typeof entry.kickoffUk === "string")) {
      return;
    }
    state.upcomingFixtures = parsed.fixtures;
    state.upcomingSourceText = `Auto-updated from official fixtures feed (${new Date(parsed.syncedAt).toLocaleString()}).`;
  } catch {
    // Ignore cache parse errors.
  }
}

async function syncUpcomingFixturesFromChelsea(force = false) {
  const raw = localStorage.getItem(FIXTURE_CACHE_KEY);
  if (!force && raw) {
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed.version !== FIXTURE_CACHE_VERSION ||
        parsed.sourceUrl !== CHELSEA_FIXTURES_URL ||
        !Array.isArray(parsed.fixtures) ||
        !parsed.fixtures.every((entry) => typeof entry.kickoffUk === "string")
      ) {
        throw new Error("Outdated fixture cache");
      }
      const syncedAt = new Date(parsed.syncedAt).getTime();
      if (Number.isFinite(syncedAt) && Date.now() - syncedAt < 12 * 60 * 60 * 1000) {
        return;
      }
    } catch {
      // fall through to fetch.
    }
  }

  try {
    const response = await fetch(CHELSEA_FIXTURES_PROXY_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    const parsedFixtures = parseChelseaFixturesPage(text);
    if (parsedFixtures.length >= 5) {
      state.upcomingFixtures = parsedFixtures;
      const syncedAt = new Date().toISOString();
      state.upcomingSourceText = `Auto-updated from official fixtures feed (${new Date(syncedAt).toLocaleString()}).`;
      localStorage.setItem(
        FIXTURE_CACHE_KEY,
        JSON.stringify({
          version: FIXTURE_CACHE_VERSION,
          sourceUrl: CHELSEA_FIXTURES_URL,
          syncedAt,
          fixtures: parsedFixtures
        })
      );
      return;
    }
    throw new Error("Could not parse sufficient fixtures");
  } catch {
    state.upcomingSourceText = "Live fixture sync unavailable. Showing fallback fixture list.";
  }
}

function parseChelseaFixturesPage(text) {
  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };

  const lines = text.split("\n");
  const fixtures = [];
  const seen = new Set();
  const datePattern =
    /^(Sat|Sun|Mon|Tue|Wed|Thu|Fri)\s+(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/i;

  for (let i = 0; i < lines.length; i += 1) {
    const head = normalizeLine(lines[i]);
    const dateMatch = head.match(datePattern);
    if (!dateMatch) {
      continue;
    }

    const day = Number.parseInt(dateMatch[2], 10);
    const month = monthMap[dateMatch[3]];
    const year = Number.parseInt(dateMatch[4], 10);
    if (!month || !Number.isInteger(day) || !Number.isInteger(year)) {
      continue;
    }

    const block = [];
    for (let j = i + 1; j < Math.min(i + 24, lines.length); j += 1) {
      const line = normalizeLine(lines[j]);
      if (!line) {
        continue;
      }
      if (datePattern.test(line)) {
        break;
      }
      if (line.startsWith("![") || line.startsWith("[") || line === "More") {
        continue;
      }
      block.push(line);
    }

    const timeIndex = block.findIndex((line) => /^\d{1,2}:\d{2}$/.test(line) || line === "TBC");
    const scoreIndex = block.findIndex(
      (line, idx) => /^\d{1,2}$/.test(line) && /^\d{1,2}$/.test(block[idx + 1] || "")
    );
    if (timeIndex < 1 && scoreIndex < 0) {
      continue;
    }
    const kickoffUk = timeIndex >= 1 ? block[timeIndex] : "TBC";
    const anchorIndex = timeIndex >= 1 ? timeIndex : scoreIndex;

    const team1 = findNearestTeam(block, anchorIndex, -1);
    const team2 = findNearestTeam(block, anchorIndex + (scoreIndex >= 0 ? 1 : 0), 1);
    if (!team1 || !team2 || (team1 !== "Chelsea" && team2 !== "Chelsea")) {
      continue;
    }

    const competition =
      block.find((line) => /league|cup|champions league|uefa/i.test(line)) || "Competition";
    const opponent = team1 === "Chelsea" ? team2 : team1;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const key = `${date}::${opponent.toLowerCase()}::${competition.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    let resultChelsea = null;
    let resultOpponent = null;
    if (scoreIndex >= 0) {
      const scoreA = Number.parseInt(block[scoreIndex], 10);
      const scoreB = Number.parseInt(block[scoreIndex + 1], 10);
      if (Number.isInteger(scoreA) && Number.isInteger(scoreB)) {
        if (team1 === "Chelsea") {
          resultChelsea = scoreA;
          resultOpponent = scoreB;
        } else {
          resultChelsea = scoreB;
          resultOpponent = scoreA;
        }
      }
    }
    fixtures.push({
      date,
      opponent,
      competition,
      kickoffUk,
      resultChelsea,
      resultOpponent
    });
  }

  fixtures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return fixtures;
}

function normalizeOpponentName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/football club/g, "")
    .replace(/united/g, "")
    .replace(/hotspur/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function findNearestTeam(block, startIndex, direction) {
  for (
    let idx = startIndex + direction;
    idx >= 0 && idx < block.length;
    idx += direction
  ) {
    const line = block[idx];
    if (isTeamName(line)) {
      return line;
    }
  }
  return null;
}

function isTeamName(value) {
  if (!value || /\d/.test(value)) {
    return false;
  }
  const lowered = value.toLowerCase();
  if (
    lowered.includes("stadium") ||
    lowered.includes("bridge") ||
    lowered.includes("park") ||
    lowered.includes("road") ||
    lowered.includes("centre") ||
    lowered.includes("window") ||
    lowered.includes("dates/times") ||
    lowered.includes("all competitions") ||
    lowered === "fixtures results tables"
  ) {
    return false;
  }
  return /^[a-zA-Z&' .-]+$/.test(value);
}

function normalizeLine(value) {
  return value.trim().replace(/\u00a0/g, " ").replace(/\u2013/g, "-").replace(/\*/g, "");
}

function formatUkKickoff(value) {
  if (!value || value === "TBC") {
    return "TBC (UK)";
  }
  return `${value} (UK)`;
}

function fixtureKey(kickoff, opponent, competition) {
  return `${new Date(kickoff).toISOString().slice(0, 10)}::${opponent.toLowerCase()}::${competition.toLowerCase()}`;
}

function getNextFixtureForPrediction() {
  return (
    state.activeLeagueFixtures
      .filter((fixture) => !fixture.result)
      .filter((fixture) => Number.isFinite(new Date(fixture.kickoff).getTime()))
      .filter((fixture) => new Date(fixture.kickoff).getTime() > Date.now())
      .slice()
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())[0] || null
  );
}

function getFallbackNextFixture() {
  const scheduleNext = getNextUpcomingFixtureFromSchedule();
  if (!scheduleNext) {
    return null;
  }
  return {
    id: `fallback-${scheduleNext.date}-${scheduleNext.opponent.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    kickoff: buildFixtureKickoffIso(scheduleNext.date, scheduleNext.kickoffUk),
    opponent: scheduleNext.opponent,
    competition: scheduleNext.competition,
    predictions: [],
    result: null
  };
}

function canPredictFixture(fixture) {
  const nextFixture = getNextFixtureForPrediction();
  if (!nextFixture || nextFixture.id !== fixture.id) {
    return false;
  }
  return !isFixtureLockedForPrediction(fixture);
}

function isFixtureLockedForPrediction(fixture) {
  if (fixture.result) {
    return true;
  }
  const kickoffMs = new Date(fixture.kickoff).getTime();
  if (!Number.isFinite(kickoffMs)) {
    return true;
  }
  return Date.now() >= kickoffMs - PREDICTION_CUTOFF_MINUTES * 60 * 1000;
}

function renderDeadlineCountdown() {
  if (!deadlineCountdownEl) {
    return;
  }

  const nextFixture = getNextUpcomingFixtureFromSchedule();
  if (!nextFixture) {
    deadlineCountdownEl.textContent = "No upcoming fixture deadline.";
    return;
  }

  const kickoffIso = buildFixtureKickoffIso(nextFixture.date, nextFixture.kickoffUk);
  const kickoffMs = new Date(kickoffIso).getTime();
  if (!Number.isFinite(kickoffMs)) {
    deadlineCountdownEl.textContent = `Next fixture: Chelsea vs ${nextFixture.opponent}. Kickoff time TBC.`;
    return;
  }

  const deadlineMs = kickoffMs - PREDICTION_CUTOFF_MINUTES * 60 * 1000;
  const remainingMs = deadlineMs - Date.now();
  const fixtureLabel = `Chelsea vs ${nextFixture.opponent}`;

  if (remainingMs <= 0) {
    deadlineCountdownEl.textContent = `Prediction deadline passed for ${fixtureLabel}.`;
    return;
  }

  deadlineCountdownEl.textContent = `Next deadline (${fixtureLabel}): ${formatDuration(remainingMs)} remaining`;
}

function renderMatchdayAttendance() {
  if (!matchdayAttendanceEl) {
    return;
  }
  const count = state.registeredUserCount;
  if (typeof count === "undefined") {
    matchdayAttendanceEl.textContent = "Matchday attendance: ...";
    return;
  }
  if (!Number.isFinite(count)) {
    matchdayAttendanceEl.textContent = "Matchday attendance: unavailable";
    return;
  }
  matchdayAttendanceEl.textContent = `Matchday attendance: ${count} registered users`;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return `${hours}h ${minutes}m ${seconds}s`;
}

function getNextUpcomingFixtureFromSchedule() {
  const upcoming = getUpcomingFixturesForDisplay()
    .filter((fixture) => fixture.kickoffUk && fixture.kickoffUk !== "TBC")
    .slice()
    .sort((a, b) => {
      const aMs = new Date(buildFixtureKickoffIso(a.date, a.kickoffUk)).getTime();
      const bMs = new Date(buildFixtureKickoffIso(b.date, b.kickoffUk)).getTime();
      return aMs - bMs;
    });

  if (upcoming.length > 0) {
    return upcoming[0];
  }

  return getUpcomingFixturesForDisplay()[0] || null;
}

function buildFixtureKickoffIso(date, kickoffUk) {
  const safeKickoff = /^\d{1,2}:\d{2}$/.test(kickoffUk || "") ? kickoffUk : "15:00";
  return londonLocalDateTimeToIso(date, safeKickoff);
}

function londonLocalDateTimeToIso(dateValue, timeValue) {
  const [yearRaw, monthRaw, dayRaw] = dateValue.split("-").map((part) => Number.parseInt(part, 10));
  const [hourRaw, minuteRaw] = timeValue.split(":").map((part) => Number.parseInt(part, 10));
  if (
    !Number.isInteger(yearRaw) ||
    !Number.isInteger(monthRaw) ||
    !Number.isInteger(dayRaw) ||
    !Number.isInteger(hourRaw) ||
    !Number.isInteger(minuteRaw)
  ) {
    return new Date(`${dateValue}T${timeValue}:00Z`).toISOString();
  }

  const utcGuess = Date.UTC(yearRaw, monthRaw - 1, dayRaw, hourRaw, minuteRaw);
  const offsetMinutes = getLondonOffsetMinutes(utcGuess);
  return new Date(utcGuess - offsetMinutes * 60 * 1000).toISOString();
}

function getLondonOffsetMinutes(utcTimestamp) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    timeZoneName: "shortOffset",
    hour: "2-digit"
  });
  const tzPart = formatter.formatToParts(new Date(utcTimestamp)).find((part) => part.type === "timeZoneName");
  const label = tzPart?.value || "GMT";
  const match = label.match(/^GMT([+-]\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    return 0;
  }
  const hourOffset = Number.parseInt(match[1], 10);
  const minuteOffset = Number.parseInt(match[2] || "0", 10);
  return hourOffset * 60 + Math.sign(hourOffset || 1) * minuteOffset;
}
