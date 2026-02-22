const RUNTIME_CONFIG = readRuntimeConfig();
const SUPABASE_URL = RUNTIME_CONFIG.supabaseUrl;
const SUPABASE_ANON_KEY = RUNTIME_CONFIG.supabaseAnonKey;
const FEATURE_CARDS_ENABLED = RUNTIME_CONFIG.features.cards;
const GLOBAL_LEAGUE_NAME = "Global League";
const FIXTURE_CACHE_KEY = "cfc-upcoming-fixtures-cache-v1";
const FIXTURE_CACHE_VERSION = 3;
const PREDICTION_SCORERS_CACHE_KEY = "cfc-prediction-scorers-cache-v1";
const VISITOR_TOKEN_KEY = "cfc-visitor-token-v1";
const THE_SPORTS_DB_SCORERS_CACHE_KEY = "cfc-sportsdb-scorers-cache-v1";
const THE_SPORTS_DB_SCORERS_CACHE_VERSION = 1;
const THE_SPORTS_DB_SCORERS_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const REGISTERED_USER_COUNT_CACHE_KEY = "cfc-registered-user-count-cache-v1";
const REGISTERED_USER_COUNT_CACHE_MAX_AGE_MS = 2 * 60 * 1000;
const VISITOR_COUNT_CACHE_KEY = "cfc-visitor-count-cache-v1";
const VISITOR_COUNT_CACHE_MAX_AGE_MS = 2 * 60 * 1000;
const FORUM_THREADS_CACHE_KEY = "cfc-forum-threads-cache-v1";
const FORUM_THREADS_CACHE_VERSION = 1;
const FORUM_THREADS_CACHE_MAX_AGE_MS = 2 * 60 * 1000;
const CARD_TEMPLATES_CACHE_KEY = "cfc-card-templates-cache-v1";
const CARD_TEMPLATES_CACHE_VERSION = 1;
const CARD_TEMPLATES_CACHE_MAX_AGE_MS = 10 * 60 * 1000;
const USER_CARDS_CACHE_KEY = "cfc-user-cards-cache-v1";
const USER_CARDS_CACHE_VERSION = 1;
const USER_CARDS_CACHE_MAX_AGE_MS = 2 * 60 * 1000;
const LEAGUE_LEADERBOARD_CACHE_KEY = "cfc-league-leaderboard-cache-v1";
const LEAGUE_LEADERBOARD_CACHE_VERSION = 1;
const LEAGUE_LEADERBOARD_CACHE_MAX_AGE_MS = 2 * 60 * 1000;
const LEAGUES_CACHE_KEY = "cfc-user-leagues-cache-v1";
const LEAGUES_CACHE_VERSION = 1;
const LEAGUES_CACHE_MAX_AGE_MS = 5 * 60 * 1000;
const LEAGUE_PAYLOAD_CACHE_KEY = "cfc-league-payload-cache-v1";
const LEAGUE_PAYLOAD_CACHE_VERSION = 1;
const LEAGUE_PAYLOAD_CACHE_MAX_AGE_MS = 2 * 60 * 1000;
const PAST_GAMES_CACHE_KEY = "cfc-past-games-cache-v1";
const PAST_GAMES_CACHE_VERSION = 1;
const PAST_GAMES_CACHE_MAX_AGE_MS = 60 * 1000;
const LEAGUE_BREAKDOWN_CACHE_KEY = "cfc-league-breakdown-cache-v1";
const LEAGUE_BREAKDOWN_CACHE_VERSION = 1;
const LEAGUE_BREAKDOWN_CACHE_MAX_AGE_MS = 60 * 1000;
const OVERALL_LEADERBOARD_CACHE_KEY = "cfc-overall-leaderboard-cache-v1";
const OVERALL_LEADERBOARD_CACHE_VERSION = 1;
const OVERALL_LEADERBOARD_CACHE_MAX_AGE_MS = 60 * 1000;
const ACTIVE_LEAGUE_HYDRATE_MIN_INTERVAL_MS = 30 * 1000;
const COMPLETED_RESULTS_SYNC_MIN_INTERVAL_MS = 2 * 60 * 1000;
const SQUAD_CACHE_KEY = "cfc-team-squads-cache-v1";
const SQUAD_CACHE_VERSION = 3;
const SQUAD_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DRAFT_PREDICTION_STORAGE_PREFIX = "sw6:draftPrediction";
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
const DEFAULT_CARD_TEMPLATES = [
  { id: 1, slug: "correct-result", name: "Correct Result", description: "Predicted the right match result.", rarity: "common", active: true },
  { id: 2, slug: "correct-scorer", name: "Correct Scorer", description: "Picked at least one correct Chelsea goalscorer.", rarity: "common", active: true },
  { id: 3, slug: "exact-scoreline", name: "Exact Scoreline", description: "Predicted the exact final score.", rarity: "legendary", active: true },
  { id: 4, slug: "first-chelsea-scorer", name: "First Chelsea Scorer", description: "Picked the first Chelsea goalscorer correctly.", rarity: "common", active: true },
  { id: 5, slug: "top-5-percent", name: "Top 5%", description: "Finished in the top 5% for the matchday.", rarity: "rare", active: true },
  { id: 6, slug: "league-winner", name: "League Winner", description: "Top scorer in your league for that fixture.", rarity: "rare", active: true },
  { id: 7, slug: "comeback-win", name: "Comeback Win", description: "Chelsea won after trailing.", rarity: "rare", active: true },
  { id: 8, slug: "clean-sheet", name: "Clean Sheet", description: "Opponent scored zero.", rarity: "common", active: true }
];
const ADMIN_EMAIL_ALLOWLIST = new Set([
  "jackwilliamison@gmail.com"
]);
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
let reloadAuthedDataPromise = null;
let loadActiveLeagueDataPromise = null;
let loadActiveLeagueDataLeagueId = null;
let loadPastGamesPromise = null;
let cardsLoadPromise = null;
let upcomingFixturesSyncPromise = null;
let scorerStatsSyncPromise = null;
let registeredUserCountPromise = null;
let visitorCountPromise = null;
let adminAccessPromise = null;
let authWarmupRunId = 0;
let authedDataInitialized = false;
let ensureAuthedDataLoadedPromise = null;
let forumThreadsRefreshPromise = null;
const leagueLeaderboardRefreshPromises = new Map();
const leagueBreakdownRefreshPromises = new Map();
const activeLeagueHydratedAtByLeague = new Map();
const completedResultsSyncedAtByLeague = new Map();
let upcomingFixturesAbortController = null;
let scorerStatsAbortController = null;
let renderScheduled = false;
let deadlineCountdownIntervalId = null;
const draftAutosaveTimers = new Map();
let detachedAuthedFormsApplied = null;
const TOP_VIEW_MODULE_URLS = {
  predict: "",
  leagues: "./view-leagues.js",
  forum: "./view-forum.js",
  results: "./view-results.js",
  cards: ""
};
const topViewModuleCache = new Map();
const topViewModuleLoadPromises = new Map();

const state = {
  client: null,
  session: null,
  authResolved: false,
  isAdmin: false,
  configError: false,
  leagues: [],
  activeLeagueId: null,
  activeLeagueMembers: [],
  activeLeagueFixtures: [],
  activeLeagueLeaderboard: [],
  leagueLastGameBreakdownByUser: {},
  expandedLeaderboardUserId: "",
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
  cardsFixtureFilter: "all",
  cardsRarityFilter: "all",
  cards: [],
  cardTemplates: [],
  cardsLoaded: false,
  cardsStatus: "Loading cards...",
  activeCardId: "",
  forumThreads: [],
  forumReplies: [],
  activeForumThreadId: null,
  forumStatus: "",
  forumUnreadCount: 0,
  pastGamesRows: [],
  pastGamesLoaded: false,
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
  adminScoreAck: null,
  predictionButtonFlashTimeoutId: null,
  registeredUserCount: undefined,
  visitorCount: null,
  adminLeagues: [],
  adminResultFixtureId: "",
  cardDeepLinkId: "",
  pendingJoinCode: "",
  user: null,
  isAuthed: false,
  draftModalOpen: false,
  draftLoadedFixtureId: "",
  draftNeedsReviewFixtureId: "",
  previewTop10Loaded: false,
  upcomingLastUpdatedAt: ""
};

function readRuntimeConfig() {
  const config = window.__SW6_CONFIG__ || {};
  const featureCardsRaw =
    config?.features?.cards ??
    config?.SW6_FEATURE_CARDS ??
    config?.sw6FeatureCards ??
    true;
  const featureCards = [true, "true", "1", 1, "yes", "on"].includes(
    typeof featureCardsRaw === "string" ? featureCardsRaw.trim().toLowerCase() : featureCardsRaw
  );
  return {
    supabaseUrl: String(config.supabaseUrl || "").trim(),
    supabaseAnonKey: String(config.supabaseAnonKey || "").trim(),
    features: {
      cards: featureCards
    }
  };
}

function hydrateOverallLeaderboardCache() {
  const cached = readObjectCache(
    OVERALL_LEADERBOARD_CACHE_KEY,
    OVERALL_LEADERBOARD_CACHE_VERSION,
    OVERALL_LEADERBOARD_CACHE_MAX_AGE_MS
  );
  if (!cached || typeof cached !== "object") {
    return;
  }
  const rows = Array.isArray(cached.rows) ? cached.rows : [];
  const status = typeof cached.status === "string" ? cached.status : "";
  state.overallLeaderboard = rows;
  state.overallLeaderboardStatus = status || (rows.length > 0 ? "Top players across all leagues." : "No completed match results yet.");
  state.overallLeaderboardLoaded = true;
}

function persistOverallLeaderboardCache(rows, status) {
  writeObjectCache(
    OVERALL_LEADERBOARD_CACHE_KEY,
    OVERALL_LEADERBOARD_CACHE_VERSION,
    {
      rows: Array.isArray(rows) ? rows : [],
      status: String(status || "")
    }
  );
}

function hasRuntimeSupabaseConfig() {
  return Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);
}

const topnavPredictBtn = document.getElementById("topnav-predict");
const topnavLeaguesBtn = document.getElementById("topnav-leagues");
const topnavForumBtn = document.getElementById("topnav-forum");
const forumUnreadBadgeEl = document.getElementById("forum-unread-badge");
const topnavResultsBtn = document.getElementById("topnav-results");
const topnavCardsBtn = document.getElementById("topnav-cards");
const resultsFixturesTabBtn = document.getElementById("results-fixtures-tab");
const resultsPastTabBtn = document.getElementById("results-past-tab");
const resultsStatsTabBtn = document.getElementById("results-stats-tab");
const fixturesOverviewPanel = document.getElementById("fixtures-overview-panel");
const scorersOverviewPanel = document.getElementById("scorers-overview-panel");
const pastOverviewPanel = document.getElementById("past-overview-panel");
const predictViewEl = document.getElementById("predict-view");
const forumPanelEl = document.getElementById("forum-panel");
const resultsViewEl = document.getElementById("results-view");
const cardsPanelEl = document.getElementById("cards-panel");
const loginPanelEl = document.getElementById("login-panel");
const predictAuthGateEl = document.getElementById("predict-auth-gate");
const signedoutPreviewPanelEl = document.getElementById("signedout-preview-panel");
const signedoutNextFixtureLineEl = document.getElementById("signedout-next-fixture-line");
const signedoutNextFixtureMetaEl = document.getElementById("signedout-next-fixture-meta");
const signedoutNextFixtureUpdatedEl = document.getElementById("signedout-next-fixture-updated");
const signedoutLockCountdownEl = document.getElementById("signedout-lock-countdown");
const signedoutTop10ListEl = document.getElementById("signedout-top10-list");
const signedoutTop10StatusEl = document.getElementById("signedout-top10-status");
const configErrorBannerEl = document.getElementById("config-error-banner");
const leagueAuthGateEl = document.getElementById("league-auth-gate");
const leagueAuthContentEl = document.getElementById("league-auth-content");
const forumAuthGateEl = document.getElementById("forum-auth-gate");
const cardsAuthGateEl = document.getElementById("cards-auth-gate");
const cardsContentEl = document.getElementById("cards-content");
const cardsSummaryEl = document.getElementById("cards-summary");
const cardsEmptyEl = document.getElementById("cards-empty");
const cardsGridEl = document.getElementById("cards-grid");
const cardsFilterAllBtn = document.getElementById("cards-filter-all");
const cardsFilterMatchBtn = document.getElementById("cards-filter-match");
const cardsRarityAllBtn = document.getElementById("cards-rarity-all");
const cardsRarityCommonBtn = document.getElementById("cards-rarity-common");
const cardsRarityRareBtn = document.getElementById("cards-rarity-rare");
const cardsRarityLegendaryBtn = document.getElementById("cards-rarity-legendary");
const cardDetailModalEl = document.getElementById("card-detail-modal");
const closeCardDetailModalBtn = document.getElementById("close-card-detail-modal");
const cardDetailBodyEl = document.getElementById("card-detail-body");
const draftSaveModalEl = document.getElementById("draft-save-modal");
const closeDraftSaveModalBtn = document.getElementById("close-draft-save-modal");
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
const copyInviteLinkBtn = document.getElementById("copy-invite-link-btn");
const leagueMetaNoteEl = document.getElementById("league-meta-note");
const leagueLeaderboardStatusEl = document.getElementById("league-leaderboard-status");
let adminConsoleEl = null;
let adminLeagueListEl = null;
const deadlineCountdownEl = document.getElementById("deadline-countdown");
const matchdayAttendanceEl = document.getElementById("matchday-attendance");
const visitorCountEl = document.getElementById("visitor-count");
const adminScorePanelEl = document.getElementById("admin-score-panel");

const leaderboardEl = document.getElementById("leaderboard");
const fixturesListEl = document.getElementById("fixtures-list");
const fixtureTemplate = document.getElementById("fixture-template");
const forumThreadFormEl = document.getElementById("forum-thread-form");
const forumThreadTitleInputEl = document.getElementById("forum-thread-title-input");
const forumThreadBodyInputEl = document.getElementById("forum-thread-body-input");
const forumThreadSubmitBtnEl = document.getElementById("forum-thread-submit-btn");
const forumStatusEl = document.getElementById("forum-status");
const forumSortToolbarEl = document.getElementById("forum-sort-toolbar");
const forumSortNewBtnEl = document.getElementById("forum-sort-new");
const forumSortTopBtnEl = document.getElementById("forum-sort-top");
const forumThreadListEl = document.getElementById("forum-thread-list");
const forumThreadDetailEl = document.getElementById("forum-thread-detail");
const forumBackBtnEl = document.getElementById("forum-back-btn");
const forumDeleteThreadBtnEl = document.getElementById("forum-delete-thread-btn");
const forumThreadDetailTitleEl = document.getElementById("forum-thread-detail-title");
const forumThreadDetailMetaEl = document.getElementById("forum-thread-detail-meta");
const forumThreadDetailBodyEl = document.getElementById("forum-thread-detail-body");
const forumReplyListEl = document.getElementById("forum-reply-list");
const forumReplyFormEl = document.getElementById("forum-reply-form");
const forumReplyBodyInputEl = document.getElementById("forum-reply-body-input");
const forumReplySubmitBtnEl = document.getElementById("forum-reply-submit-btn");

const authOnlyFormMounts = [
  createLeagueForm,
  joinLeagueForm,
  forumThreadFormEl,
  forumReplyFormEl
]
  .filter(Boolean)
  .map((node) => ({
    node,
    parent: node.parentNode,
    nextSibling: node.nextSibling,
    mounted: Boolean(node.parentNode),
    placeholder: document.createComment(`auth-only:${node.id || "form"}`)
  }));

if (topnavPredictBtn) topnavPredictBtn.addEventListener("click", () => setTopView("predict"));
if (topnavLeaguesBtn) topnavLeaguesBtn.addEventListener("click", () => setTopView("leagues"));
if (topnavForumBtn) topnavForumBtn.addEventListener("click", () => setTopView("forum"));
if (topnavResultsBtn) topnavResultsBtn.addEventListener("click", () => setTopView("results"));
if (topnavCardsBtn) topnavCardsBtn.addEventListener("click", () => setTopView("cards"));
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
if (copyInviteLinkBtn) copyInviteLinkBtn.addEventListener("click", onCopyInviteLink);
if (cancelProfileBtn) cancelProfileBtn.addEventListener("click", onCancelProfileEdit);
if (profileEditForm) profileEditForm.addEventListener("submit", onSaveProfileSettings);
if (cardsFilterAllBtn) cardsFilterAllBtn.addEventListener("click", () => setCardsFixtureFilter("all"));
if (cardsFilterMatchBtn) cardsFilterMatchBtn.addEventListener("click", () => setCardsFixtureFilter("match"));
if (cardsRarityAllBtn) cardsRarityAllBtn.addEventListener("click", () => setCardsRarityFilter("all"));
if (cardsRarityCommonBtn) cardsRarityCommonBtn.addEventListener("click", () => setCardsRarityFilter("common"));
if (cardsRarityRareBtn) cardsRarityRareBtn.addEventListener("click", () => setCardsRarityFilter("rare"));
if (cardsRarityLegendaryBtn) cardsRarityLegendaryBtn.addEventListener("click", () => setCardsRarityFilter("legendary"));
if (closeCardDetailModalBtn) closeCardDetailModalBtn.addEventListener("click", onCloseCardDetailModal);
if (closeDraftSaveModalBtn) closeDraftSaveModalBtn.addEventListener("click", onCloseDraftSaveModal);
startDeadlineCountdownTicker();
window.addEventListener("hashchange", onRouteChange);
document.addEventListener("visibilitychange", onVisibilityChange);
document.addEventListener("click", onDocumentClick);
document.addEventListener("keydown", onDocumentKeydown);

initializeApp();

async function getAuthUser() {
  if (!state.client) {
    state.user = null;
    state.session = null;
    state.isAuthed = false;
    state.forumUnreadCount = 0;
    state.draftNeedsReviewFixtureId = "";
    return null;
  }
  const { data, error } = await state.client.auth.getUser();
  if (error || !data?.user) {
    state.user = null;
    state.session = null;
    state.isAuthed = false;
    state.forumUnreadCount = 0;
    state.draftNeedsReviewFixtureId = "";
    return null;
  }
  state.user = data.user;
  state.session = { user: data.user };
  state.isAuthed = true;
  return data.user;
}

function startDeadlineCountdownTicker() {
  if (deadlineCountdownIntervalId !== null) {
    return;
  }
  deadlineCountdownIntervalId = window.setInterval(() => {
    renderDeadlineCountdown();
  }, 1000);
}

function stopDeadlineCountdownTicker() {
  if (deadlineCountdownIntervalId === null) {
    return;
  }
  clearInterval(deadlineCountdownIntervalId);
  deadlineCountdownIntervalId = null;
}

function onVisibilityChange() {
  if (document.hidden) {
    stopDeadlineCountdownTicker();
    return;
  }
  startDeadlineCountdownTicker();
  renderDeadlineCountdown();
}

async function initializeApp() {
  setupTopNavPreload();
  hydrateSquadCache();
  hydrateFixtureCache();
  hydrateScorerStatsCache();
  hydrateOverallLeaderboardCache();
  onLeagueVisibilityChange();
  onJoinModeChange();
  applyRouteIntent(getRouteIntentFromUrl(), { syncHash: true });
  render();

  const backgroundSync = Promise.allSettled([syncUpcomingFixturesFromChelsea()]).then(() => {
    render();
  });

  if (!hasRuntimeSupabaseConfig()) {
    state.configError = true;
    state.authResolved = true;
    render();
    await backgroundSync;
    return;
  }

  if (!initSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    state.authResolved = true;
    state.configError = true;
    state.overallLeaderboardStatus = "Leaderboard unavailable right now.";
    await backgroundSync;
    await runTopViewEnterEffects();
    render();
    return;
  }

  await processAuthCallbackIfPresent();
  await getAuthUser();
  state.authResolved = true;
  applyRouteIntent(getRouteIntentFromUrl(), { syncHash: false });
  render();
  runPostAuthWarmup();

  state.client.auth.onAuthStateChange(async () => {
    await getAuthUser();
    state.authResolved = true;
    state.isAdmin = false;
    authedDataInitialized = false;
    applyRouteIntent(getRouteIntentFromUrl(), { syncHash: false });
    render();
    runPostAuthWarmup();
  });

  await backgroundSync;
}

async function processAuthCallbackIfPresent() {
  if (!state.client) {
    return false;
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  let handled = false;

  try {
    if (params.has("code")) {
      handled = true;
      const { error } = await state.client.auth.exchangeCodeForSession(params.get("code"));
      if (error) {
        console.error("[auth-callback] exchangeCodeForSession failed:", error.message);
      }
    } else if (params.has("token_hash") && params.has("type")) {
      handled = true;
      const { error } = await state.client.auth.verifyOtp({
        token_hash: params.get("token_hash"),
        type: params.get("type")
      });
      if (error) {
        console.error("[auth-callback] verifyOtp failed:", error.message);
      }
    } else if (
      hashParams.has("access_token") ||
      hashParams.has("refresh_token") ||
      hashParams.get("type") === "signup"
    ) {
      handled = true;
      const { error } = await state.client.auth.getSession();
      if (error) {
        console.error("[auth-callback] getSession failed:", error.message);
      }
    }
  } catch (error) {
    handled = true;
    console.error("[auth-callback] processing failed:", error?.message || error);
  }

  if (!handled) {
    return false;
  }

  params.delete("code");
  params.delete("token_hash");
  params.delete("type");
  params.delete("auth");
  params.delete("next");
  url.search = params.toString();
  if (hashParams.has("access_token") || hashParams.has("refresh_token") || hashParams.get("type") === "signup") {
    url.hash = "#predict";
  }
  window.history.replaceState({}, document.title, url.toString());
  return true;
}

function canWriteActions() {
  return !state.configError && Boolean(state.client);
}

function trackEvent(name, payload = {}) {
  try {
    if (window?.__SW6_META__) {
      // Dev-friendly lightweight instrumentation hook.
      console.debug("[sw6-event]", name, payload);
    }
  } catch {
    // Keep analytics optional.
  }
}

function setupTopNavPreload() {
  const entries = [
    [topnavPredictBtn, "predict"],
    [topnavLeaguesBtn, "leagues"],
    [topnavResultsBtn, "results"],
    [topnavCardsBtn, "cards"],
    [topnavForumBtn, "forum"]
  ];
  entries.forEach(([btn, view]) => {
    if (!btn) {
      return;
    }
    const preload = () => {
      ensureTopViewModule(view).catch(() => {
        // Keep interaction robust even if prefetch fails.
      });
    };
    btn.addEventListener("mouseenter", preload, { passive: true, once: true });
    btn.addEventListener("touchstart", preload, { passive: true, once: true });
    btn.addEventListener("focus", preload, { once: true });
  });
}

function runPostAuthWarmup() {
  const runId = ++authWarmupRunId;
  (async () => {
    await Promise.allSettled([
      trackSiteVisit(),
      loadRegisteredUserCount(),
      loadForumUnreadCount(),
      loadMyCards({ background: true }),
      runTopViewEnterEffects()
    ]);
    await loadAdminAccess();
    await loadVisitorCount();
    await maybeHandleJoinDeepLink();
  })().then(() => {
    if (runId !== authWarmupRunId) {
      return;
    }
    render();
  });
}

function onRouteChange() {
  applyRouteIntent(getRouteIntentFromUrl(), { syncHash: false });
  runTopViewEnterEffects().then(render);
  render();
}

async function ensureTopViewModule(topView) {
  const key = ["predict", "leagues", "forum", "results", "cards"].includes(topView) ? topView : "predict";
  if (topViewModuleCache.has(key)) {
    return topViewModuleCache.get(key);
  }
  if (topViewModuleLoadPromises.has(key)) {
    return topViewModuleLoadPromises.get(key);
  }

  const moduleUrl = TOP_VIEW_MODULE_URLS[key];
  if (!moduleUrl) {
    const emptyModule = {};
    topViewModuleCache.set(key, emptyModule);
    return emptyModule;
  }
  const loadPromise = import(moduleUrl)
    .then((moduleNs) => {
      topViewModuleCache.set(key, moduleNs);
      topViewModuleLoadPromises.delete(key);
      return moduleNs;
    })
    .catch((error) => {
      topViewModuleLoadPromises.delete(key);
      throw error;
    });

  topViewModuleLoadPromises.set(key, loadPromise);
  return loadPromise;
}

async function runTopViewEnterEffects() {
  if (state.topView === "cards") {
    if (state.session?.user) {
      await ensureAuthedDataLoaded();
      await loadMyCards({ background: false });
    }
    return;
  }
  try {
    const moduleNs = await ensureTopViewModule(state.topView);
    const onEnter = moduleNs && typeof moduleNs.onEnter === "function" ? moduleNs.onEnter : null;
    if (!onEnter) {
      return;
    }
    await onEnter({
      state,
      isAdminUser,
      render,
      ensureAuthedDataLoaded,
      ensureOverallLeaderboardLoaded,
      loadAdminLeagues,
      ...getForumViewContext(),
      syncUpcomingFixturesFromChelsea,
      maybeRefreshChelseaSquad,
      syncScorerStatsFromTheSportsDb
    });
  } catch {
    // If a lazy view module fails to load, keep core app usable.
  }
}

function getForumViewContext() {
  return {
    formatKickoff,
    getCurrentUserDisplayName,
    canWriteActions,
    loadForumUnreadCount,
    markForumNotificationsRead,
    syncRouteHash,
    readObjectCache,
    writeObjectCache,
    runtime: {
      get forumThreadsRefreshPromise() {
        return forumThreadsRefreshPromise;
      },
      set forumThreadsRefreshPromise(value) {
        forumThreadsRefreshPromise = value;
      }
    },
    els: {
      forumAuthGateEl,
      forumThreadFormEl,
      forumThreadTitleInputEl,
      forumThreadBodyInputEl,
      forumThreadSubmitBtnEl,
      forumStatusEl,
      forumSortToolbarEl,
      forumSortNewBtnEl,
      forumSortTopBtnEl,
      forumThreadListEl,
      forumThreadDetailEl,
      forumBackBtnEl,
      forumDeleteThreadBtnEl,
      forumThreadDetailTitleEl,
      forumThreadDetailMetaEl,
      forumThreadDetailBodyEl,
      forumReplyListEl,
      forumReplyFormEl,
      forumReplyBodyInputEl,
      forumReplySubmitBtnEl
    }
  };
}

async function loadForumUnreadCount() {
  if (!state.client || !state.session?.user) {
    state.forumUnreadCount = 0;
    return;
  }
  const { data, error } = await state.client.rpc("get_unread_forum_notification_count");
  if (error) {
    state.forumUnreadCount = 0;
    return;
  }
  const count = Number.parseInt(String(data ?? "0"), 10);
  state.forumUnreadCount = Number.isFinite(count) ? Math.max(0, count) : 0;
}

async function markForumNotificationsRead(threadId) {
  if (!state.client || !state.session?.user) {
    return;
  }
  await state.client.rpc("mark_forum_notifications_read", {
    p_thread_id: threadId || null
  });
  await loadForumUnreadCount();
}

function setTopView(view) {
  if (view === "forum") {
    state.activeForumThreadId = null;
    state.forumReplies = [];
  }
  if (view !== "cards") {
    state.activeCardId = "";
    state.cardDeepLinkId = "";
  }
  state.topView = view;
  if (view !== "results") {
    state.showRulesModal = false;
  }
  if (view !== "predict") {
    state.loginPanelOpen = false;
  }
  if (view === "cards") {
    trackEvent("cards_tab_opened");
  }
  syncRouteHash();
  runTopViewEnterEffects().then(render);
  render();
}

function setResultsTab(tab) {
  state.topView = "results";
  state.resultsTab = tab === "past" ? "past" : "fixtures";
  state.showRulesModal = false;
  syncRouteHash();
  render();
}

function setScorerCompetition(competition) {
  state.scorerCompetition = SCORER_COMPETITION_KEYS.includes(competition) ? competition : "all";
  renderTopScorers();
  renderNavigation();
}

function setCardsFixtureFilter(filter) {
  state.cardsFixtureFilter = filter === "match" ? "match" : "all";
  trackEvent("card_filter_used", { filter: `fixture:${state.cardsFixtureFilter}` });
  renderCardsPanel();
}

function setCardsRarityFilter(rarity) {
  state.cardsRarityFilter = ["common", "rare", "legendary"].includes(rarity) ? rarity : "all";
  trackEvent("card_filter_used", { filter: `rarity:${state.cardsRarityFilter}` });
  renderCardsPanel();
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
  if (state.draftModalOpen && draftSaveModalEl && event.target === draftSaveModalEl) {
    onCloseDraftSaveModal();
    return;
  }
  if (state.activeCardId && cardDetailModalEl && event.target === cardDetailModalEl) {
    onCloseCardDetailModal();
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
    if (state.draftModalOpen) {
      onCloseDraftSaveModal();
      return;
    }
    if (state.activeCardId) {
      onCloseCardDetailModal();
      return;
    }
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

function onCloseCardDetailModal() {
  state.activeCardId = "";
  syncRouteHash();
  render();
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

function clearJoinParamFromUrl() {
  const params = new URLSearchParams(window.location.search);
  params.delete("join");
  const nextSearch = params.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentUrl !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

async function maybeHandleJoinDeepLink() {
  const code = String(state.pendingJoinCode || "").trim().toUpperCase();
  if (!code || !state.client || !state.session?.user) {
    return;
  }

  state.pendingJoinCode = "";
  const confirmed = window.confirm(`Join league ${code}?`);
  if (!confirmed) {
    clearJoinParamFromUrl();
    return;
  }

  await ensureAuthedDataLoaded();
  const existing = state.leagues.find((league) => String(league.code || "").toUpperCase() === code);
  if (existing) {
    state.activeLeagueId = existing.id;
    state.topView = "leagues";
    await loadActiveLeagueData();
    clearJoinParamFromUrl();
    return;
  }

  const { data, error } = await state.client.rpc("join_league_by_code", {
    p_code: code,
    p_display_name: getCurrentUserDisplayName(),
    p_country_code: getCurrentUserCountryCode()
  });
  if (error) {
    alert(error.message || "Could not join league from invite link.");
    clearJoinParamFromUrl();
    return;
  }

  await reloadAuthedData();
  const joinedLeague = state.leagues.find((league) => league.id === data) || state.leagues.find((league) => league.code === code);
  if (joinedLeague) {
    state.activeLeagueId = joinedLeague.id;
  }
  state.topView = "leagues";
  await loadActiveLeagueData();
  clearJoinParamFromUrl();
  alert(`Joined ${joinedLeague?.name || "league"} successfully.`);
}

function getRouteIntentFromUrl() {
  const rawHash = String(window.location.hash || "").replace(/^#/, "").trim();
  const hashThreadId = extractForumThreadIdFromRoute(rawHash);
  if (hashThreadId) {
    return { topView: "forum", forumThreadId: hashThreadId };
  }

  const hashToken = normalizeRouteToken(rawHash);
  const search = new URLSearchParams(window.location.search);
  const queryCardId = String(search.get("card") || "").trim();
  const queryJoinCode = String(search.get("join") || "").trim().toUpperCase();
  const queryRaw = String(search.get("tab") || search.get("view") || search.get("section") || "").trim();
  const queryThreadId = extractForumThreadIdFromRoute(queryRaw) || parseUuidLike(search.get("thread"));
  if (queryThreadId) {
    return { topView: "forum", forumThreadId: queryThreadId };
  }

  const queryToken = normalizeRouteToken(queryRaw);
  const token = hashToken || queryToken;
  if (!token) {
    return { topView: "predict" };
  }

  if (token === "predict" || token === "home") {
    return { topView: "predict" };
  }
  if (token === "leagues" || token === "myleagues") {
    return { topView: "leagues", joinCode: queryJoinCode };
  }
  if (token === "forum" || token === "threads" || token === "community" || token === "forumpanel") {
    return { topView: "forum" };
  }
  if (token === "cards" || token === "binder" || token === "moments") {
    return { topView: "cards", cardId: queryCardId };
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
    return { topView: "results", resultsTab: "fixtures" };
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
  return { topView: "predict", cardId: queryCardId, joinCode: queryJoinCode };
}

function normalizeRouteToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function extractForumThreadIdFromRoute(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) {
    return "";
  }
  const patterns = [
    /^forum-thread\/([0-9a-f-]{36})$/i,
    /^forumthread\/([0-9a-f-]{36})$/i,
    /^forum-thread-([0-9a-f-]{36})$/i,
    /^thread\/([0-9a-f-]{36})$/i,
    /^forum\/([0-9a-f-]{36})$/i
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match && match[1]) {
      return parseUuidLike(match[1]);
    }
  }
  return "";
}

function parseUuidLike(value) {
  const parsed = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed) ? parsed : "";
}

function applyRouteIntent(intent, options = {}) {
  const nextTop = ["predict", "leagues", "forum", "results", "cards"].includes(intent.topView) ? intent.topView : state.topView;
  if (intent.joinCode) {
    state.pendingJoinCode = intent.joinCode;
    if (joinModeInput) joinModeInput.value = "public";
    if (joinCodeInput) joinCodeInput.value = intent.joinCode;
    onJoinModeChange();
  }
  state.topView = nextTop || "predict";
  state.resultsTab = intent.resultsTab === "past"
    ? "past"
    : "fixtures";
  state.leaderboardScope = intent.leaderboardScope === "league" ? "league" : state.leaderboardScope || "global";
  state.showRulesModal = Boolean(intent.showRulesModal);
  if (nextTop === "forum") {
    state.activeForumThreadId = parseUuidLike(intent.forumThreadId) || state.activeForumThreadId;
  } else if (intent.forumThreadId) {
    state.activeForumThreadId = parseUuidLike(intent.forumThreadId);
  }
  if (intent.cardId) {
    state.cardDeepLinkId = intent.cardId;
  }
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
    } else if (state.topView === "forum") {
      token = state.activeForumThreadId ? `forum-thread/${state.activeForumThreadId}` : "forum";
    } else if (state.topView === "results") {
      token = `results-${state.resultsTab}`;
    } else if (state.topView === "cards") {
      token = "cards";
    }
  }
  const nextHash = token ? `#${token}` : "";
  const params = new URLSearchParams(window.location.search);
  if (state.topView === "cards" && state.activeCardId) {
    params.set("card", state.activeCardId);
    params.set("tab", "cards");
  } else {
    params.delete("card");
    if (params.get("tab") === "cards") {
      params.delete("tab");
    }
  }
  const nextSearch = params.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${nextHash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentUrl !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
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
  const confirmed = window.confirm("Sign out now?");
  if (!confirmed) {
    return;
  }
  const { error } = await state.client.auth.signOut();
  if (error) {
    alert(error.message);
    return;
  }
  state.accountMenuOpen = false;
  state.loginPanelOpen = false;
  state.isAdmin = false;
  state.forumUnreadCount = 0;
  authedDataInitialized = false;
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
    state.overallLeaderboardStatus = state.isAuthed
      ? "No global points data yet."
      : "Sign in to view live standings.";
    state.overallLeaderboardLoaded = true;
    return;
  }

  state.overallLeaderboard = Array.isArray(data) ? data : [];
  state.overallLeaderboardStatus =
    state.overallLeaderboard.length === 0 ? "No completed match results yet." : "Top players across all leagues.";
  state.overallLeaderboardLoaded = true;
  persistOverallLeaderboardCache(state.overallLeaderboard, state.overallLeaderboardStatus);
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

function readNumericCache(cacheKey, maxAgeMs) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const value = Number(parsed?.value);
    const syncedAt = new Date(parsed?.syncedAt || "").getTime();
    if (!Number.isFinite(value) || !Number.isFinite(syncedAt)) {
      return null;
    }
    if (Date.now() - syncedAt > maxAgeMs) {
      return null;
    }
    return Math.max(0, Math.floor(value));
  } catch {
    return null;
  }
}

function writeNumericCache(cacheKey, value) {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        value: Math.max(0, Math.floor(Number(value) || 0)),
        syncedAt: new Date().toISOString()
      })
    );
  } catch {
    // Ignore local cache failures.
  }
}

function readObjectCache(cacheKey, version, maxAgeMs) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const syncedAt = new Date(parsed?.syncedAt || "").getTime();
    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.version !== version ||
      !Number.isFinite(syncedAt) ||
      Date.now() - syncedAt > maxAgeMs
    ) {
      return null;
    }
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

function writeObjectCache(cacheKey, version, data) {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        version,
        syncedAt: new Date().toISOString(),
        data
      })
    );
  } catch {
    // Ignore local cache failures.
  }
}

function getUserCardsCacheKey(userId) {
  return `${USER_CARDS_CACHE_KEY}:${userId}`;
}

function readCardTemplatesCache() {
  const cached = readObjectCache(
    CARD_TEMPLATES_CACHE_KEY,
    CARD_TEMPLATES_CACHE_VERSION,
    CARD_TEMPLATES_CACHE_MAX_AGE_MS
  );
  if (!Array.isArray(cached) || cached.length === 0) {
    return null;
  }
  return cached;
}

function writeCardTemplatesCache(rows) {
  writeObjectCache(
    CARD_TEMPLATES_CACHE_KEY,
    CARD_TEMPLATES_CACHE_VERSION,
    Array.isArray(rows) ? rows : []
  );
}

function readUserCardsCache(userId) {
  const cached = readObjectCache(
    getUserCardsCacheKey(userId),
    USER_CARDS_CACHE_VERSION,
    USER_CARDS_CACHE_MAX_AGE_MS
  );
  return Array.isArray(cached) ? cached : [];
}

function writeUserCardsCache(userId, rows) {
  writeObjectCache(
    getUserCardsCacheKey(userId),
    USER_CARDS_CACHE_VERSION,
    Array.isArray(rows) ? rows : []
  );
}

async function loadRegisteredUserCount(force = false) {
  if (!force && registeredUserCountPromise) {
    await registeredUserCountPromise;
    return;
  }
  if (!force) {
    const cached = readNumericCache(REGISTERED_USER_COUNT_CACHE_KEY, REGISTERED_USER_COUNT_CACHE_MAX_AGE_MS);
    if (cached !== null) {
      state.registeredUserCount = cached;
      return;
    }
  }

  registeredUserCountPromise = (async () => {
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
  if (state.registeredUserCount !== null) {
    writeNumericCache(REGISTERED_USER_COUNT_CACHE_KEY, state.registeredUserCount);
  }
  })();

  try {
    await registeredUserCountPromise;
  } finally {
    registeredUserCountPromise = null;
  }
}

async function loadAdminAccess(force = false) {
  if (!state.client || !state.session?.user) {
    state.isAdmin = false;
    return;
  }
  if (isAllowlistedAdminEmail()) {
    state.isAdmin = true;
    return;
  }
  if (!force && adminAccessPromise) {
    await adminAccessPromise;
    return;
  }
  adminAccessPromise = (async () => {
    const { data, error } = await state.client.rpc("is_configured_admin");
    if (error) {
      state.isAdmin = isAllowlistedAdminEmail();
      return;
    }
    state.isAdmin = Boolean(data) || isAllowlistedAdminEmail();
  })();
  try {
    await adminAccessPromise;
  } finally {
    adminAccessPromise = null;
  }
}

function getVisitorToken() {
  try {
    const existing = String(localStorage.getItem(VISITOR_TOKEN_KEY) || "").trim();
    if (existing) {
      return existing;
    }
    const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(VISITOR_TOKEN_KEY, token);
    return token;
  } catch {
    return `ephemeral-${Math.random().toString(36).slice(2, 12)}`;
  }
}

async function trackSiteVisit() {
  if (!state.client) {
    return;
  }
  const token = getVisitorToken();
  await state.client.rpc("log_site_visit", { p_visitor_token: token });
}

async function loadVisitorCount(force = false) {
  if (!state.client || !state.session?.user || !isAdminUser()) {
    state.visitorCount = null;
    return;
  }
  if (!force && visitorCountPromise) {
    await visitorCountPromise;
    return;
  }
  if (!force) {
    const cached = readNumericCache(VISITOR_COUNT_CACHE_KEY, VISITOR_COUNT_CACHE_MAX_AGE_MS);
    if (cached !== null) {
      state.visitorCount = cached;
      return;
    }
  }

  visitorCountPromise = (async () => {
  const { data, error } = await state.client.rpc("get_site_visitor_count");
  if (error) {
    state.visitorCount = null;
    return;
  }
  const count = Number(data);
  state.visitorCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : null;
  if (state.visitorCount !== null) {
    writeNumericCache(VISITOR_COUNT_CACHE_KEY, state.visitorCount);
  }
  })();

  try {
    await visitorCountPromise;
  } finally {
    visitorCountPromise = null;
  }
}

async function reloadAuthedData() {
  if (reloadAuthedDataPromise) {
    return reloadAuthedDataPromise;
  }

  reloadAuthedDataPromise = (async () => {
  state.leagues = [];
  state.activeLeagueMembers = [];
  state.activeLeagueFixtures = [];
  state.activeLeagueLeaderboard = [];
  state.leagueLastGameBreakdownByUser = {};
  state.expandedLeaderboardUserId = "";
  state.adminLeagues = [];

  if (!state.client || !state.session?.user) {
    state.activeLeagueId = null;
    authedDataInitialized = false;
    return;
  }

  const userId = state.session.user.id;
  const cachedLeaguesState = readLeaguesCache(userId);
  if (cachedLeaguesState && cachedLeaguesState.leagues.length > 0) {
    state.leagues = cachedLeaguesState.leagues;
    if (!state.activeLeagueId && cachedLeaguesState.activeLeagueId) {
      state.activeLeagueId = cachedLeaguesState.activeLeagueId;
    }
    const cachedActiveLeague = state.leagues.find((league) => league.id === state.activeLeagueId) || state.leagues[0];
    if (cachedActiveLeague) {
      state.activeLeagueId = cachedActiveLeague.id;
      const cachedPayload = readLeaguePayloadCache(cachedActiveLeague.id, userId);
      if (cachedPayload) {
        state.activeLeagueMembers = cachedPayload.members;
        state.activeLeagueFixtures = cachedPayload.fixtures;
      }
      render();
    }
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
  state.pastGamesLoaded = false;

  if (isAdminUser()) {
    if (state.topView === "leagues") {
      await loadAdminLeagues();
    }
  }
  if (state.session?.user?.id) {
    writeLeaguesCache(state.session.user.id, state.leagues, state.activeLeagueId);
  }
  authedDataInitialized = true;
  })();

  try {
    await reloadAuthedDataPromise;
  } finally {
    reloadAuthedDataPromise = null;
  }
}

async function loadPastGamesForUser(options = {}) {
  const force = Boolean(options.force);
  const background = Boolean(options.background);
  if (!state.client || !state.session?.user) {
    state.pastGamesRows = [];
    state.pastGamesLoaded = false;
    return;
  }
  const userId = state.session.user.id;
  if (!force) {
    const cachedRows = readPastGamesCache(userId);
    if (cachedRows.length > 0) {
      state.pastGamesRows = cachedRows;
      state.pastGamesLoaded = true;
      if (background) {
        if (!loadPastGamesPromise) {
          loadPastGamesPromise = loadPastGamesForUser({ force: true }).finally(() => {
            loadPastGamesPromise = null;
          });
        }
        return;
      }
    }
  }
  if (!force && loadPastGamesPromise) {
    await loadPastGamesPromise;
    return;
  }
  if (force && loadPastGamesPromise) {
    await loadPastGamesPromise;
    return;
  }
  loadPastGamesPromise = (async () => {
  const predictionsResult = await state.client
    .from("predictions")
    .select("fixture_id, user_id, chelsea_goals, opponent_goals, first_scorer, predicted_scorers, submitted_at")
    .eq("user_id", state.session.user.id)
    .order("submitted_at", { ascending: false });

  if (predictionsResult.error) {
    state.pastGamesRows = [];
    state.pastGamesLoaded = true;
    return;
  }
  const predictions = Array.isArray(predictionsResult.data) ? predictionsResult.data : [];
  if (predictions.length === 0) {
    state.pastGamesRows = [];
    state.pastGamesLoaded = true;
    writePastGamesCache(userId, []);
    return;
  }
  const predictionFixtureIds = [...new Set(predictions.map((row) => row.fixture_id).filter(Boolean))];
  if (predictionFixtureIds.length === 0) {
    state.pastGamesRows = [];
    state.pastGamesLoaded = true;
    writePastGamesCache(userId, []);
    return;
  }

  const predictionFixturesResult = await state.client
    .from("fixtures")
    .select("id, league_id, kickoff, opponent, competition")
    .in("id", predictionFixtureIds);

  if (predictionFixturesResult.error) {
    state.pastGamesRows = [];
    state.pastGamesLoaded = true;
    return;
  }
  const predictionFixtures = Array.isArray(predictionFixturesResult.data) ? predictionFixturesResult.data : [];
  const predictionFixtureById = new Map(predictionFixtures.map((fixture) => [fixture.id, fixture]));

  const directResultsResult = await state.client
    .from("results")
    .select("fixture_id, chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at")
    .in("fixture_id", predictionFixtureIds);

  const directResultByFixtureId = new Map();
  if (!directResultsResult.error) {
    (directResultsResult.data || []).forEach((row) => {
      directResultByFixtureId.set(row.fixture_id, row);
    });
  }

  const leagueIdsFromPredictions = [...new Set(predictionFixtures.map((fixture) => fixture.league_id).filter(Boolean))];
  let resultFixtureByScheduleKey = new Map();
  if (leagueIdsFromPredictions.length > 0) {
    const leagueFixturesResult = await fetchCompletedFixturesForPastGames(leagueIdsFromPredictions);
    if (!leagueFixturesResult.error) {
      const completedFixtures = (leagueFixturesResult.data || [])
        .map((fixture) => ({
          ...fixture,
          result: Array.isArray(fixture.results) ? fixture.results[0] : null
        }))
        .filter((fixture) => fixture.result);
      resultFixtureByScheduleKey = new Map(
        completedFixtures.map((fixture) => [
          fixtureScheduleKey(fixture.kickoff, fixture.opponent, fixture.competition),
          fixture
        ])
      );
    }
  }

  state.pastGamesRows = predictions
    .map((prediction) => {
      const fixture = predictionFixtureById.get(prediction.fixture_id);
      if (!fixture) {
        return null;
      }
      let result = directResultByFixtureId.get(prediction.fixture_id) || null;
      if (!result) {
        const scheduleKey = fixtureScheduleKey(fixture.kickoff, fixture.opponent, fixture.competition);
        const matchedFixture = resultFixtureByScheduleKey.get(scheduleKey);
        result = matchedFixture?.result || null;
      }
      if (!result) {
        return null;
      }
      return {
        fixture: {
          id: fixture.id,
          kickoff: fixture.kickoff,
          opponent: fixture.opponent,
          competition: fixture.competition
        },
        prediction,
        result,
        points: scorePrediction(prediction, result).points
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.fixture.kickoff).getTime() - new Date(a.fixture.kickoff).getTime());
  writePastGamesCache(userId, state.pastGamesRows);
  state.pastGamesLoaded = true;
  })();
  try {
    await loadPastGamesPromise;
  } finally {
    loadPastGamesPromise = null;
  }
}

async function fetchCompletedFixturesForPastGames(leagueIds) {
  let result = await state.client
    .from("fixtures")
    .select("id, league_id, kickoff, opponent, competition, results(chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at)")
    .in("league_id", leagueIds)
    .order("kickoff", { ascending: false });
  if (!result.error) {
    return result;
  }

  // Backward-compatible fallback for projects missing chelsea_scorers on results.
  result = await state.client
    .from("fixtures")
    .select("id, league_id, kickoff, opponent, competition, results(chelsea_goals, opponent_goals, first_scorer, saved_at)")
    .in("league_id", leagueIds)
    .order("kickoff", { ascending: false });
  return result;
}

async function ensureAuthedDataLoaded(force = false) {
  if (!state.client || !state.session?.user) {
    authedDataInitialized = false;
    return;
  }
  if (!force && authedDataInitialized) {
    return;
  }
  if (!force && ensureAuthedDataLoadedPromise) {
    await ensureAuthedDataLoadedPromise;
    return;
  }
  ensureAuthedDataLoadedPromise = (async () => {
    await reloadAuthedData();
    authedDataInitialized = true;
  })();
  try {
    await ensureAuthedDataLoadedPromise;
  } finally {
    ensureAuthedDataLoadedPromise = null;
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
  if (!state.session?.user || !canWriteActions()) {
    if (state.configError) {
      alert("Configuration error. Please contact the site admin.");
    }
    return;
  }

  const name = leagueNameInput.value.trim();
  const visibility = leagueVisibilityInput?.value === "private" ? "private" : "public";
  const joinPassword = String(leaguePasswordInput?.value || "").trim();
  if (!name) {
    return;
  }
  if (visibility === "private" && joinPassword.trim().length < 6) {
    alert("Private leagues require a password with at least 6 characters.");
    return;
  }

  const createAttempts = [
    {
      p_name: name,
      p_is_public: visibility === "public",
      p_join_password: visibility === "private" ? joinPassword : null,
      p_display_name: getCurrentUserDisplayName(),
      p_country_code: getCurrentUserCountryCode()
    },
    {
      // Backward-compatible call shape for older DB function signatures.
      p_name: name,
      p_join_password: visibility === "private" ? joinPassword : null,
      p_display_name: getCurrentUserDisplayName(),
      p_country_code: getCurrentUserCountryCode()
    }
  ];
  let data = null;
  let error = null;
  for (const payload of createAttempts) {
    const result = await state.client.rpc("create_league", payload);
    data = result.data;
    error = result.error;
    if (!error) {
      break;
    }
    const message = String(error?.message || "").toLowerCase();
    if (!/function|signature|does not exist|could not find/.test(message)) {
      break;
    }
  }
  let leagueData = Array.isArray(data) ? data[0] : data;
  if (error || !leagueData) {
    if (visibility === "public" && isMissingFunctionError(error, "create_league")) {
      leagueData = await createLeagueLegacyPublic(name, state.session.user.id);
    }
    if (!leagueData) {
      const message = String(error?.message || "");
      if (/gen_salt|crypt\(/i.test(message)) {
        alert(
          "Private league password hashing is not enabled yet. In Supabase SQL Editor run: create extension if not exists pgcrypto with schema extensions;"
        );
        return;
      }
      if (visibility === "private" && isMissingFunctionError(error, "create_league")) {
        alert(
          "Private leagues are not enabled in your current database schema yet. Run the latest supabase-schema.sql, then try again."
        );
        return;
      }
      alert(message || "Could not create league right now.");
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
  if (!state.session?.user || !canWriteActions()) {
    if (state.configError) {
      alert("Configuration error. Please contact the site admin.");
    }
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
      if (/gen_salt|crypt\(/i.test(String(error.message || ""))) {
        alert(
          "Private league password hashing is not enabled yet. In Supabase SQL Editor run: create extension if not exists pgcrypto with schema extensions;"
        );
        return;
      }
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

async function onSwitchLeague(event) {
  state.activeLeagueId = event.target.value || null;
  if (state.session?.user?.id) {
    writeLeaguesCache(state.session.user.id, state.leagues, state.activeLeagueId);
  }
  await loadActiveLeagueData();
  if (isGlobalLeague(getActiveLeague())) {
    await ensureOverallLeaderboardLoaded();
  }
  render();
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

async function onCopyInviteLink() {
  const league = getActiveLeague();
  if (!league || isGlobalLeague(league)) {
    return;
  }
  const url = `${window.location.origin}${window.location.pathname}?tab=leagues&join=${encodeURIComponent(league.code)}#leagues`;
  try {
    await navigator.clipboard.writeText(url);
    alert("Invite link copied.");
  } catch {
    alert(url);
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
  const resetSubmitButton = (label = null) => {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    if (label) submitBtn.textContent = label;
  };

  if (!canWriteActions()) {
    if (state.configError) {
      alert("Configuration error. Please contact the site admin.");
    }
    resetSubmitButton("Save Prediction");
    return;
  }

  const isFallbackFixture = String(fixture?.id || "").startsWith("fallback-");
  if (state.session?.user && (!state.activeLeagueId || isFallbackFixture)) {
    await ensureAuthedDataLoaded();
  }

  let targetFixture = fixture;
  if (isFallbackFixture) {
    const materialized = await materializeFixtureForPrediction(fixture);
    if (!materialized) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save Prediction";
      }
      return;
    }
    targetFixture = materialized;
  }

  if (!state.session?.user) {
    alert("Please sign in to submit.");
    resetSubmitButton("Save Prediction");
    return;
  }

  if (isFixtureLockedForPrediction(targetFixture)) {
    alert("Prediction is locked for this fixture (90 minutes before kickoff).");
    resetSubmitButton("Prediction locked");
    return;
  }

  const nextRealFixture = getNextFixtureForPrediction();
  if (nextRealFixture && nextRealFixture.id !== targetFixture.id) {
    alert("Only the next fixture can be predicted.");
    resetSubmitButton("Save Prediction");
    return;
  }

  const requestedUpdate = String(submitBtn?.textContent || "").toLowerCase().includes("update");
  const hadExistingPrediction =
    requestedUpdate ||
    targetFixture.predictions.some((row) => row.user_id === state.session.user.id);
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
    alert("Please set a valid score.");
    resetSubmitButton(idleLabel);
    return;
  }
  if (chelseaGoals > 0 && (!selectedScorers || !firstScorer)) {
    alert("Pick Chelsea goalscorers and choose the first Chelsea goalscorer before submitting.");
    resetSubmitButton(idleLabel);
    return;
  }
  if (chelseaGoals === 0) {
    firstScorer = "None";
  }

  const submittedAt = new Date().toISOString();
  const { error } = await state.client.from("predictions").upsert(
    {
      fixture_id: targetFixture.id,
      user_id: state.session.user.id,
      chelsea_goals: chelseaGoals,
      opponent_goals: opponentGoals,
      first_scorer: firstScorer,
      predicted_scorers: predictedScorers,
      submitted_at: submittedAt
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
  const scoreOpponentEl = form.querySelector(".score-value-opponent");
  const scoreChelseaEl = form.querySelector(".score-value-chelsea");
  if (scoreOpponentEl) scoreOpponentEl.textContent = String(opponentGoals);
  if (scoreChelseaEl) scoreChelseaEl.textContent = String(chelseaGoals);
  state.draftNeedsReviewFixtureId = "";
  state.draftLoadedFixtureId = "";
  clearDraftPrediction(targetFixture.id);
  cachePredictionScorers(targetFixture.id, state.session.user.id, selectedScorers);

  const savedPrediction = {
    fixture_id: targetFixture.id,
    user_id: state.session.user.id,
    chelsea_goals: chelseaGoals,
    opponent_goals: opponentGoals,
    first_scorer: firstScorer,
    predicted_scorers: predictedScorers,
    submitted_at: submittedAt
  };

  syncPredictionAcrossMyLeagues(targetFixture, {
    chelsea_goals: chelseaGoals,
    opponent_goals: opponentGoals,
    first_scorer: firstScorer,
    predicted_scorers: predictedScorers,
    submitted_at: submittedAt
  }).catch(() => {
    // Keep local save success even if cross-league propagation is temporarily unavailable.
  });

  state.activeLeagueFixtures = state.activeLeagueFixtures.map((row) =>
    row.id === targetFixture.id
      ? {
          ...row,
          predictions: [savedPrediction]
        }
      : row
  );
  state.activeLeagueLeaderboard = state.activeLeagueLeaderboard.map((row) => ({
    ...row,
    has_prediction:
      row?.user_id === state.session.user.id
        ? true
        : Boolean(row?.has_prediction)
  }));
  state.overallLeaderboard = state.overallLeaderboard.map((row) => ({
    ...row,
    has_prediction:
      row?.user_id === state.session.user.id
        ? true
        : Boolean(row?.has_prediction)
  }));
  state.lastPredictionAck = {
    fixtureId: targetFixture.id,
    updated: hadExistingPrediction,
    at: Date.now()
  };
  render();
  // Background refresh keeps UX snappy after submit without blocking the confirmation state.
  Promise.allSettled([
    loadActiveLeagueData(),
    ensureOverallLeaderboardLoaded(true),
    state.activeLeagueId ? refreshLeaderboardPredictionFlags(state.activeLeagueId) : Promise.resolve()
  ]).then(() => {
    refreshVisibleSectionsFast();
  });
  if (state.predictionButtonFlashTimeoutId) {
    clearTimeout(state.predictionButtonFlashTimeoutId);
  }
  state.predictionButtonFlashTimeoutId = setTimeout(() => {
    state.predictionButtonFlashTimeoutId = null;
    render();
  }, 5000);
}

async function syncPredictionAcrossMyLeagues(sourceFixture, payload) {
  if (!state.client || !state.session?.user || !sourceFixture) {
    return;
  }
  const leagueIds = (state.leagues || []).map((league) => league.id).filter(Boolean);
  if (leagueIds.length === 0) {
    return;
  }

  const kickoffMs = new Date(sourceFixture.kickoff).getTime();
  if (!Number.isFinite(kickoffMs)) {
    return;
  }

  const windowStart = new Date(kickoffMs - 18 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(kickoffMs + 18 * 60 * 60 * 1000).toISOString();
  const fixtureRows = await state.client
    .from("fixtures")
    .select("id, league_id, kickoff")
    .in("league_id", leagueIds)
    .eq("opponent", sourceFixture.opponent)
    .eq("competition", sourceFixture.competition)
    .gte("kickoff", windowStart)
    .lte("kickoff", windowEnd);

  if (fixtureRows.error || !Array.isArray(fixtureRows.data) || fixtureRows.data.length === 0) {
    return;
  }

  const upserts = fixtureRows.data.map((row) => ({
    fixture_id: row.id,
    user_id: state.session.user.id,
    chelsea_goals: payload.chelsea_goals,
    opponent_goals: payload.opponent_goals,
    first_scorer: payload.first_scorer,
    predicted_scorers: payload.predicted_scorers,
    submitted_at: payload.submitted_at
  }));

  const { error } = await state.client.from("predictions").upsert(upserts, {
    onConflict: "fixture_id,user_id"
  });
  if (error) {
    console.warn("Cross-league prediction sync skipped:", error.message);
  }
}

async function materializeFixtureForPrediction(fallbackFixture) {
  if (!state.client || !state.session?.user) {
    alert("Please sign in first.");
    return null;
  }

  if (!state.activeLeagueId) {
    await ensureAuthedDataLoaded(true);
  }

  const league = getActiveLeague();
  if (!league) {
    alert("Could not find your active league. Refresh and try again.");
    return null;
  }

  const kickoff = fallbackFixture.kickoff;
  const opponent = fallbackFixture.opponent;
  const competition = fallbackFixture.competition;

  const existing = await state.client
    .from("fixtures")
    .select("id")
    .eq("league_id", league.id)
    .eq("kickoff", kickoff)
    .eq("opponent", opponent)
    .eq("competition", competition)
    .limit(1)
    .maybeSingle();

  if (!existing.error && existing.data?.id) {
    await loadActiveLeagueData(true);
    return getNextFixtureForPrediction();
  }

  // Handle slight kickoff mismatches by matching same league/opponent/competition within +/- 18 hours.
  const kickoffMs = new Date(kickoff).getTime();
  if (Number.isFinite(kickoffMs)) {
    const windowStart = new Date(kickoffMs - 18 * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(kickoffMs + 18 * 60 * 60 * 1000).toISOString();
    const nearMatch = await state.client
      .from("fixtures")
      .select("id, kickoff")
      .eq("league_id", league.id)
      .eq("opponent", opponent)
      .eq("competition", competition)
      .gte("kickoff", windowStart)
      .lte("kickoff", windowEnd)
      .order("kickoff", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!nearMatch.error && nearMatch.data?.id) {
      await loadActiveLeagueData(true);
      return getNextFixtureForPrediction();
    }
  }

  const { error: insertError } = await state.client.from("fixtures").insert({
    league_id: league.id,
    kickoff,
    opponent,
    competition,
    created_by: state.session.user.id
  });

  if (insertError) {
    const message = String(insertError.message || "Could not prepare fixture.");
    if (/policy|permission|row-level security|rls/i.test(message)) {
      alert("Fixture sync permissions are still blocked in Supabase. Please run the latest fixtures policy SQL.");
    } else {
      alert(message);
    }
    return null;
  }

  await loadActiveLeagueData(true);
  return getNextFixtureForPrediction();
}

async function onSaveResult(fixture, form) {
  if (!state.session?.user || !canManageResults()) {
    return;
  }
  const chelseaGoals = parseGoals(form.querySelector(".result-chelsea").value);
  const opponentGoals = parseGoals(form.querySelector(".result-opponent").value);
  let firstScorer = String(form.querySelector(".result-scorer")?.value || "").trim();
  if (chelseaGoals === null || opponentGoals === null) {
    return;
  }
  if (chelseaGoals === 0) {
    firstScorer = "None";
  } else if (!firstScorer) {
    firstScorer = "Unknown";
  }
  const scorerStorageValue =
    firstScorer && !["none", "unknown"].includes(firstScorer.toLowerCase())
      ? expandScorerSelectionsForStorage(firstScorer)
      : "";

  const { error } = await state.client.from("results").upsert(
    {
      fixture_id: fixture.id,
      chelsea_goals: chelseaGoals,
      opponent_goals: opponentGoals,
      first_scorer: firstScorer,
      chelsea_scorers: scorerStorageValue,
      saved_by: state.session.user.id,
      saved_at: new Date().toISOString()
    },
    { onConflict: "fixture_id" }
  );

  if (error) {
    state.adminScoreAck = {
      message: error.message,
      isError: true,
      at: Date.now()
    };
    alert(error.message);
    render();
    return;
  }

  await syncResultAcrossMyLeagues(fixture, {
    chelsea_goals: chelseaGoals,
    opponent_goals: opponentGoals,
    first_scorer: firstScorer,
    chelsea_scorers: scorerStorageValue,
    saved_at: new Date().toISOString()
  });

  let settlementNote = "Settlement complete.";
  const settlementResult = await state.client.rpc("get_fixture_settlement", { p_fixture_id: fixture.id });
  if (!settlementResult.error && Array.isArray(settlementResult.data) && settlementResult.data[0]) {
    const row = settlementResult.data[0];
    const status = String(row.status || "settled");
    const predCount = Number.parseInt(String(row.predictions_count ?? "0"), 10) || 0;
    settlementNote = status === "settled"
      ? `Settlement complete (${predCount} predictions processed).`
      : "Settlement encountered an issue. Please retry.";
  }

  await loadActiveLeagueData(true);
  await loadPastGamesForUser({ force: true });
  await ensureOverallLeaderboardLoaded(true);
  state.adminScoreAck = {
    message: `Result saved. ${settlementNote}`,
    isError: false,
    at: Date.now()
  };
  render();
}

async function syncResultAcrossMyLeagues(sourceFixture, payload) {
  if (!state.client || !sourceFixture) {
    return;
  }
  const leagueIds = (state.leagues || []).map((league) => league.id).filter(Boolean);
  if (leagueIds.length === 0) {
    return;
  }

  const kickoffMs = new Date(sourceFixture.kickoff).getTime();
  if (!Number.isFinite(kickoffMs)) {
    return;
  }
  const windowStart = new Date(kickoffMs - 18 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(kickoffMs + 18 * 60 * 60 * 1000).toISOString();

  const fixtureRows = await state.client
    .from("fixtures")
    .select("id")
    .in("league_id", leagueIds)
    .eq("opponent", sourceFixture.opponent)
    .eq("competition", sourceFixture.competition)
    .gte("kickoff", windowStart)
    .lte("kickoff", windowEnd);

  if (fixtureRows.error || !Array.isArray(fixtureRows.data) || fixtureRows.data.length === 0) {
    return;
  }

  const resultRows = fixtureRows.data.map((row) => ({
    fixture_id: row.id,
    chelsea_goals: payload.chelsea_goals,
    opponent_goals: payload.opponent_goals,
    first_scorer: payload.first_scorer,
    chelsea_scorers: payload.chelsea_scorers,
    saved_by: state.session.user.id,
    saved_at: payload.saved_at
  }));
  const upsertResult = await state.client.from("results").upsert(resultRows, { onConflict: "fixture_id" });
  if (upsertResult.error) {
    console.warn("Cross-league result sync skipped:", upsertResult.error.message);
  }
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
  if (state.session?.user?.id) {
    writeLeaguesCache(state.session.user.id, state.leagues, state.activeLeagueId);
  }
}

async function loadAdminLeagues() {
  const { data, error } = await state.client.rpc("admin_list_leagues");
  if (error) {
    state.adminLeagues = [];
    return;
  }
  state.adminLeagues = Array.isArray(data) ? data : [];
}

async function loadActiveLeagueData(force = false) {
  const league = getActiveLeague();
  const leagueId = league?.id || null;
  if (loadActiveLeagueDataPromise && loadActiveLeagueDataLeagueId === leagueId) {
    return loadActiveLeagueDataPromise;
  }

  loadActiveLeagueDataLeagueId = leagueId;
  loadActiveLeagueDataPromise = (async () => {
  if (!league) {
    state.activeLeagueMembers = [];
    state.activeLeagueFixtures = [];
    return;
  }

  const lastHydratedAt = Number(activeLeagueHydratedAtByLeague.get(league.id) || 0);
  const hasInMemoryLeagueData = state.activeLeagueFixtures.length > 0 || state.activeLeagueMembers.length > 0;
  if (!force && hasInMemoryLeagueData && Date.now() - lastHydratedAt < ACTIVE_LEAGUE_HYDRATE_MIN_INTERVAL_MS) {
    await loadLeagueLeaderboard({ background: true });
    await loadLeagueLastGameBreakdown(league.id, { background: true });
    return;
  }

  const userId = state.session?.user?.id || "";
  const cachedPayload = readLeaguePayloadCache(league.id, userId);
  if (cachedPayload) {
    state.activeLeagueMembers = cachedPayload.members;
    state.activeLeagueFixtures = cachedPayload.fixtures;
    render();
  }

  const [memberResult, fixtureResult] = await Promise.all([
    state.client
      .from("league_members")
      .select("user_id, display_name, country_code, role")
      .eq("league_id", league.id),
    fetchLeagueFixturesWithResults(league.id)
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
  await loadMyPredictionsForActiveFixtures();
  await loadLeagueLeaderboard({ background: true });
  await refreshLeaderboardPredictionFlags(league.id);
  await loadLeagueLastGameBreakdown(league.id);
  activeLeagueHydratedAtByLeague.set(league.id, Date.now());
  writeLeaguePayloadCache(league.id, userId, {
    members: state.activeLeagueMembers,
    fixtures: state.activeLeagueFixtures
  });

  const lastResultSync = Number(completedResultsSyncedAtByLeague.get(league.id) || 0);
  if (Date.now() - lastResultSync >= COMPLETED_RESULTS_SYNC_MIN_INTERVAL_MS) {
    completedResultsSyncedAtByLeague.set(league.id, Date.now());
    syncCompletedResultsFromChelsea()
      .then(async () => {
        await Promise.allSettled([
          loadLeagueLeaderboard({ background: true }),
          loadLeagueLastGameBreakdown(league.id)
        ]);
        render();
      })
      .catch(() => {
        // Keep manual results flow if sync fails.
      });
  }
  })();

  try {
    await loadActiveLeagueDataPromise;
  } finally {
    loadActiveLeagueDataPromise = null;
    loadActiveLeagueDataLeagueId = null;
  }
}

async function refreshLeaderboardPredictionFlags(leagueId) {
  if (!state.client || !leagueId) {
    return;
  }
  const currentUserId = state.session?.user?.id || "";
  const nextFixture = getNextFixtureForPrediction();
  const currentUserHasPrediction = Boolean(
    currentUserId &&
    nextFixture?.predictions?.some((row) => row.user_id === currentUserId)
  );
  const { data, error } = await state.client.rpc("get_next_fixture_prediction_status", {
    p_league_id: leagueId
  });
  if (error) {
    if (!currentUserId) {
      return;
    }
    state.activeLeagueLeaderboard = state.activeLeagueLeaderboard.map((row) => ({
      ...row,
      has_prediction: row?.user_id === currentUserId ? currentUserHasPrediction : Boolean(row?.has_prediction)
    }));
    state.overallLeaderboard = state.overallLeaderboard.map((row) => ({
      ...row,
      has_prediction: row?.user_id === currentUserId ? currentUserHasPrediction : Boolean(row?.has_prediction)
    }));
    return;
  }
  const submitted = new Set((Array.isArray(data) ? data : []).map((row) => row.user_id).filter(Boolean));
  state.activeLeagueLeaderboard = state.activeLeagueLeaderboard.map((row) => ({
    ...row,
    has_prediction: submitted.has(row.user_id)
  }));
  state.overallLeaderboard = state.overallLeaderboard.map((row) => ({
    ...row,
    has_prediction: submitted.has(row.user_id)
  }));
}

async function loadLeagueLastGameBreakdown(leagueId, options = {}) {
  const force = Boolean(options.force);
  const background = Boolean(options.background);
  if (!state.client || !leagueId) {
    state.leagueLastGameBreakdownByUser = {};
    return;
  }
  if (!force) {
    const cached = readLeagueBreakdownCache(leagueId);
    if (Object.keys(cached).length > 0) {
      state.leagueLastGameBreakdownByUser = cached;
      if (background) {
        if (!leagueBreakdownRefreshPromises.has(leagueId)) {
          const promise = loadLeagueLastGameBreakdown(leagueId, { force: true }).finally(() => {
            leagueBreakdownRefreshPromises.delete(leagueId);
          });
          leagueBreakdownRefreshPromises.set(leagueId, promise);
        }
        return;
      }
    }
  }
  if (leagueBreakdownRefreshPromises.has(leagueId)) {
    await leagueBreakdownRefreshPromises.get(leagueId);
    return;
  }
  const runPromise = (async () => {
    const { data, error } = await state.client.rpc("get_league_last_game_breakdown", {
      p_league_id: leagueId
    });
    if (error) {
      state.leagueLastGameBreakdownByUser = {};
      return;
    }
    const byUser = {};
    (Array.isArray(data) ? data : []).forEach((row) => {
      if (!row?.user_id) return;
      byUser[row.user_id] = row;
    });
    state.leagueLastGameBreakdownByUser = byUser;
    writeLeagueBreakdownCache(leagueId, byUser);
  })();
  leagueBreakdownRefreshPromises.set(leagueId, runPromise);
  try {
    await runPromise;
  } finally {
    leagueBreakdownRefreshPromises.delete(leagueId);
  }
}

async function fetchLeagueFixturesWithResults(leagueId) {
  let result = await state.client
    .from("fixtures")
    .select(
      "id, league_id, kickoff, opponent, competition, created_by, created_at, results(chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at)"
    )
    .eq("league_id", leagueId)
    .order("kickoff", { ascending: true });

  if (!result.error) {
    return result;
  }

  // Backward-compatible fallback for environments missing newer results columns.
  result = await state.client
    .from("fixtures")
    .select("id, league_id, kickoff, opponent, competition, created_by, created_at")
    .eq("league_id", leagueId)
    .order("kickoff", { ascending: true });

  if (result.error) {
    return result;
  }

  const fixtures = Array.isArray(result.data) ? result.data : [];
  if (fixtures.length === 0) {
    return { data: [], error: null };
  }

  const fixtureIds = fixtures.map((row) => row.id);
  const legacyResults = await state.client
    .from("results")
    .select("fixture_id, chelsea_goals, opponent_goals, first_scorer, saved_at")
    .in("fixture_id", fixtureIds);

  if (legacyResults.error) {
    // Keep fixtures usable for prediction even if results fallback fails.
    return {
      data: fixtures.map((fixture) => ({ ...fixture, results: [] })),
      error: null
    };
  }

  const byFixtureId = new Map();
  (legacyResults.data || []).forEach((row) => {
    byFixtureId.set(row.fixture_id, {
      chelsea_goals: row.chelsea_goals,
      opponent_goals: row.opponent_goals,
      first_scorer: row.first_scorer,
      chelsea_scorers: "",
      saved_at: row.saved_at
    });
  });

  return {
    data: fixtures.map((fixture) => ({
      ...fixture,
      results: byFixtureId.has(fixture.id) ? [byFixtureId.get(fixture.id)] : []
    })),
    error: null
  };
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
            chelsea_scorers: scoreByFixture.get(fixture.id).chelsea_scorers,
            saved_at: scoreByFixture.get(fixture.id).saved_at
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
  if (!league || !member) {
    return;
  }

  const existingKeys = new Set(
    state.activeLeagueFixtures.map((fixture) => fixtureScheduleKey(fixture.kickoff, fixture.opponent, fixture.competition))
  );

  const sourceUpcoming = getUpcomingFixturesForDisplay();
  const missing = sourceUpcoming.map((f) => ({
    league_id: league.id,
    kickoff: buildFixtureKickoffIso(f.date, f.kickoffUk),
    opponent: f.opponent,
    competition: f.competition,
    created_by: state.session.user.id
  })).filter((row) => !existingKeys.has(fixtureScheduleKey(row.kickoff, row.opponent, row.competition)));

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
      "id, league_id, kickoff, opponent, competition, created_by, created_at, results(chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at)"
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

function getLeagueLeaderboardCacheKey(leagueId) {
  return `${LEAGUE_LEADERBOARD_CACHE_KEY}:${leagueId}`;
}

function getLeaguesCacheKey(userId) {
  return `${LEAGUES_CACHE_KEY}:${userId}`;
}

function readLeaguesCache(userId) {
  const cached = readObjectCache(
    getLeaguesCacheKey(userId),
    LEAGUES_CACHE_VERSION,
    LEAGUES_CACHE_MAX_AGE_MS
  );
  if (!cached || typeof cached !== "object") {
    return null;
  }
  return {
    leagues: Array.isArray(cached.leagues) ? cached.leagues : [],
    activeLeagueId: String(cached.activeLeagueId || "")
  };
}

function writeLeaguesCache(userId, leagues, activeLeagueId) {
  writeObjectCache(
    getLeaguesCacheKey(userId),
    LEAGUES_CACHE_VERSION,
    {
      leagues: Array.isArray(leagues) ? leagues : [],
      activeLeagueId: String(activeLeagueId || "")
    }
  );
}

function readLeagueLeaderboardCache(leagueId) {
  const cached = readObjectCache(
    getLeagueLeaderboardCacheKey(leagueId),
    LEAGUE_LEADERBOARD_CACHE_VERSION,
    LEAGUE_LEADERBOARD_CACHE_MAX_AGE_MS
  );
  return Array.isArray(cached) ? cached : [];
}

function writeLeagueLeaderboardCache(leagueId, rows) {
  writeObjectCache(
    getLeagueLeaderboardCacheKey(leagueId),
    LEAGUE_LEADERBOARD_CACHE_VERSION,
    Array.isArray(rows) ? rows : []
  );
}

function getLeaguePayloadCacheKey(leagueId, userId) {
  return `${LEAGUE_PAYLOAD_CACHE_KEY}:${leagueId}:${userId}`;
}

function readLeaguePayloadCache(leagueId, userId) {
  const cached = readObjectCache(
    getLeaguePayloadCacheKey(leagueId, userId),
    LEAGUE_PAYLOAD_CACHE_VERSION,
    LEAGUE_PAYLOAD_CACHE_MAX_AGE_MS
  );
  if (!cached || typeof cached !== "object") {
    return null;
  }
  const members = Array.isArray(cached.members) ? cached.members : [];
  const fixtures = Array.isArray(cached.fixtures) ? cached.fixtures : [];
  return { members, fixtures };
}

function writeLeaguePayloadCache(leagueId, userId, payload) {
  writeObjectCache(
    getLeaguePayloadCacheKey(leagueId, userId),
    LEAGUE_PAYLOAD_CACHE_VERSION,
    {
      members: Array.isArray(payload?.members) ? payload.members : [],
      fixtures: Array.isArray(payload?.fixtures) ? payload.fixtures : []
    }
  );
}

function getPastGamesCacheKey(userId) {
  return `${PAST_GAMES_CACHE_KEY}:${userId}`;
}

function readPastGamesCache(userId) {
  const cached = readObjectCache(
    getPastGamesCacheKey(userId),
    PAST_GAMES_CACHE_VERSION,
    PAST_GAMES_CACHE_MAX_AGE_MS
  );
  return Array.isArray(cached) ? cached : [];
}

function writePastGamesCache(userId, rows) {
  writeObjectCache(
    getPastGamesCacheKey(userId),
    PAST_GAMES_CACHE_VERSION,
    Array.isArray(rows) ? rows : []
  );
}

function getLeagueBreakdownCacheKey(leagueId) {
  return `${LEAGUE_BREAKDOWN_CACHE_KEY}:${leagueId}`;
}

function readLeagueBreakdownCache(leagueId) {
  const cached = readObjectCache(
    getLeagueBreakdownCacheKey(leagueId),
    LEAGUE_BREAKDOWN_CACHE_VERSION,
    LEAGUE_BREAKDOWN_CACHE_MAX_AGE_MS
  );
  return cached && typeof cached === "object" ? cached : {};
}

function writeLeagueBreakdownCache(leagueId, byUser) {
  writeObjectCache(
    getLeagueBreakdownCacheKey(leagueId),
    LEAGUE_BREAKDOWN_CACHE_VERSION,
    byUser && typeof byUser === "object" ? byUser : {}
  );
}

async function refreshLeagueLeaderboardFromServer(leagueId) {
  const { data, error } = await state.client.rpc("get_league_leaderboard", { p_league_id: leagueId });
  if (error) {
    return;
  }
  const rows = Array.isArray(data) ? data : [];
  writeLeagueLeaderboardCache(leagueId, rows);
  if (state.activeLeagueId === leagueId) {
    state.activeLeagueLeaderboard = rows;
    render();
  }
}

async function loadLeagueLeaderboard(options = {}) {
  const league = getActiveLeague();
  if (!league) {
    state.activeLeagueLeaderboard = [];
    return;
  }
  const background = Boolean(options.background);
  const cachedRows = readLeagueLeaderboardCache(league.id);
  if (cachedRows.length > 0) {
    state.activeLeagueLeaderboard = cachedRows;
  }

  if (background) {
    if (!leagueLeaderboardRefreshPromises.has(league.id)) {
      const promise = refreshLeagueLeaderboardFromServer(league.id).finally(() => {
        leagueLeaderboardRefreshPromises.delete(league.id);
      });
      leagueLeaderboardRefreshPromises.set(league.id, promise);
    }
    return;
  }

  if (leagueLeaderboardRefreshPromises.has(league.id)) {
    await leagueLeaderboardRefreshPromises.get(league.id);
    return;
  }

  const promise = refreshLeagueLeaderboardFromServer(league.id).finally(() => {
    leagueLeaderboardRefreshPromises.delete(league.id);
  });
  leagueLeaderboardRefreshPromises.set(league.id, promise);
  await promise;
}

function refreshVisibleSectionsFast() {
  if (state.topView === "predict") {
    renderFixtures();
    renderAdminScorePanel();
  }
  if (state.topView === "leagues") {
    renderLeagueSelect();
    renderLeaderboard();
    renderOverallLeaderboard();
  }
  if (state.topView === "results") {
    if (state.resultsTab === "fixtures") renderUpcomingFixtures();
    if (state.resultsTab === "past") renderPastGames();
    if (state.resultsTab === "stats") renderTopScorers();
  }
  if (state.topView === "forum") {
    renderForumPanel();
  }
  if (state.topView === "cards") {
    renderCardsPanel();
  }
  renderDeadlineCountdown();
  renderMatchdayAttendance();
  renderVisitorCount();
}

function render() {
  if (renderScheduled) {
    return;
  }
  renderScheduled = true;
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => {
      renderScheduled = false;
      renderNow();
    });
    return;
  }
  renderScheduled = false;
  renderNow();
}

function renderNow() {
  const isConnected = Boolean(state.client);
  const signedIn = isConnected && Boolean(state.isAuthed && state.user);
  const authReady = state.authResolved || !isConnected;
  const cardsEnabled = FEATURE_CARDS_ENABLED;
  if (!signedIn && authReady && state.topView !== "predict") {
    state.topView = "predict";
    state.resultsTab = "fixtures";
    syncRouteHash("predict");
  }
  if (!cardsEnabled && state.topView === "cards") {
    state.topView = "predict";
    syncRouteHash("predict");
  }

  renderNavigation();
  renderProfileEditor();
  const showPredict = state.topView === "predict";
  const showLeagues = state.topView === "leagues";
  const showForum = state.topView === "forum";
  const showResults = state.topView === "results";
  const showCards = state.topView === "cards";
  const showResultsFixtures = showResults && state.resultsTab === "fixtures";
  const showResultsPast = showResults && state.resultsTab === "past";
  const showResultsStats = showResults && state.resultsTab === "stats";

  if (showResultsFixtures) {
    renderUpcomingFixtures();
  }
  if (showResultsPast) {
    renderPastGames();
  }
  if (showResultsStats) {
    renderTopScorers();
  }
  if (showLeagues) {
    if (!state.overallLeaderboardLoaded) {
      ensureOverallLeaderboardLoaded().then(render);
    }
    renderOverallLeaderboard();
  }
  if (showForum) {
    renderForumPanel();
  }
  if (showCards) {
    renderCardsPanel();
  }

  renderHeaderAuthState({ signedIn, isConnected });
  renderAuthGatedSections({ signedIn, authResolved: state.authResolved || !isConnected, cardsEnabled });
  renderSignedOutPredictPreview({ signedIn });
  renderConfigErrorBanner();
  if (!signedIn || !isAdminUser()) {
    removeAdminConsole();
  } else if (showLeagues) {
    renderAdminConsole();
  }

  if (sessionStatus) {
    sessionStatus.textContent = "";
    sessionStatus.classList.add("hidden");
  }

  if (leagueSelect?.closest("label")) {
    leagueSelect.closest("label").classList.toggle("hidden", !signedIn);
  }
  const activeLeague = getActiveLeague();
  const isGlobalActive = isGlobalLeague(activeLeague);
  if (copyCodeBtn) copyCodeBtn.classList.toggle("hidden", !signedIn || isGlobalActive);
  if (copyInviteLinkBtn) copyInviteLinkBtn.classList.toggle("hidden", !signedIn || isGlobalActive);
  if (leagueMetaNoteEl) leagueMetaNoteEl.classList.toggle("hidden", !signedIn || !isGlobalActive);

  if (signedIn) {
    if (showLeagues) {
      renderLeagueSelect();
      renderLeaderboard();
    }
  } else {
    if (showLeagues) {
      leaderboardEl.textContent = "";
    }
  }
  if (showPredict) {
    if (signedIn) {
      if (fixturesListEl) fixturesListEl.classList.remove("hidden");
      renderFixtures();
      renderAdminScorePanel();
    } else {
      if (fixturesListEl) {
        fixturesListEl.textContent = "";
        fixturesListEl.classList.add("hidden");
      }
      if (adminScorePanelEl) adminScorePanelEl.classList.add("hidden");
    }
  }
  renderDeadlineCountdown();
  renderMatchdayAttendance();
  renderVisitorCount();
}

function renderHeaderAuthState({ signedIn, isConnected }) {
  if (authPanel) authPanel.classList.toggle("hidden", !signedIn);
  if (authLoginFields) authLoginFields.classList.toggle("hidden", signedIn || !state.loginPanelOpen);
  if (loginBtn) loginBtn.classList.toggle("hidden", signedIn || !state.loginPanelOpen);
  if (loginPanelEl) loginPanelEl.classList.toggle("hidden", signedIn || !state.loginPanelOpen);

  if (accountSignInLink) accountSignInLink.classList.add("hidden");
  if (accountSignUpLink) accountSignUpLink.classList.add("hidden");
  if (accountEditProfileTopLink) accountEditProfileTopLink.classList.toggle("hidden", !signedIn || !isConnected);
  if (accountQuickSignOutBtn) accountQuickSignOutBtn.classList.toggle("hidden", !signedIn || !isConnected);
}

function renderAuthGatedSections({ signedIn, authResolved, cardsEnabled }) {
  const showGate = !signedIn && authResolved;
  if (predictAuthGateEl) predictAuthGateEl.classList.toggle("hidden", !showGate);
  if (leagueAuthGateEl) leagueAuthGateEl.classList.toggle("hidden", !showGate);
  if (forumAuthGateEl) forumAuthGateEl.classList.toggle("hidden", !showGate);
  if (cardsAuthGateEl) cardsAuthGateEl.classList.toggle("hidden", !cardsEnabled || !showGate);
  if (cardsContentEl) cardsContentEl.classList.toggle("hidden", !cardsEnabled || !signedIn);
  if (leagueAuthContentEl) leagueAuthContentEl.classList.toggle("hidden", !signedIn);
  applyAuthOnlyFormDomGate(signedIn);
}

function applyAuthOnlyFormDomGate(signedIn) {
  if (detachedAuthedFormsApplied === signedIn) {
    return;
  }
  detachedAuthedFormsApplied = signedIn;
  authOnlyFormMounts.forEach((mount) => {
    if (!mount?.node || !mount.placeholder) {
      return;
    }
    if (signedIn) {
      if (mount.placeholder.parentNode) {
        mount.placeholder.parentNode.insertBefore(mount.node, mount.placeholder);
        mount.placeholder.parentNode.removeChild(mount.placeholder);
      } else if (mount.parent && !mount.node.parentNode) {
        if (mount.nextSibling && mount.nextSibling.parentNode === mount.parent) {
          mount.parent.insertBefore(mount.node, mount.nextSibling);
        } else {
          mount.parent.appendChild(mount.node);
        }
      }
      mount.mounted = true;
      return;
    }
    if (mount.node.parentNode) {
      mount.node.parentNode.insertBefore(mount.placeholder, mount.node);
      mount.node.parentNode.removeChild(mount.node);
    }
    mount.mounted = false;
  });
}

function getDraftPredictionStorageKey(fixtureId) {
  const safeFixtureId = String(fixtureId || "").trim();
  if (!safeFixtureId) {
    return "";
  }
  return `${DRAFT_PREDICTION_STORAGE_PREFIX}:${safeFixtureId}`;
}

function readDraftPrediction(fixtureId) {
  const key = getDraftPredictionStorageKey(fixtureId);
  if (!key) {
    return null;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const chelseaGoals = parseGoals(parsed.chelseaGoals);
    const opponentGoals = parseGoals(parsed.opponentGoals);
    const scorerSelections = serializeScorerSelections(parseScorerSelections(parsed.scorerSelections));
    const firstScorer = String(parsed.firstScorer || "").trim();
    return {
      chelseaGoals: chelseaGoals ?? 0,
      opponentGoals: opponentGoals ?? 0,
      scorerSelections,
      firstScorer,
      updatedAt: String(parsed.updatedAt || "")
    };
  } catch {
    return null;
  }
}

function writeDraftPrediction(fixture, form) {
  const key = getDraftPredictionStorageKey(fixture?.id);
  if (!key || !form) {
    return;
  }
  syncChelseaGoalsToScorerSelection(form);
  const chelseaGoals = parseGoals(form.querySelector(".pred-chelsea")?.value) ?? 0;
  const opponentGoals = parseGoals(form.querySelector(".pred-opponent")?.value) ?? 0;
  const scorerSelections = serializeScorerSelections(
    parseScorerSelections(form.querySelector(".pred-scorer")?.value || "")
  );
  const firstScorer = String(form.querySelector(".pred-first-scorer")?.value || "").trim();
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        fixtureId: String(fixture.id),
        chelseaGoals,
        opponentGoals,
        scorerSelections,
        firstScorer,
        updatedAt: new Date().toISOString()
      })
    );
  } catch {
    // Ignore draft persistence failures.
  }
}

function clearDraftPrediction(fixtureId) {
  const key = getDraftPredictionStorageKey(fixtureId);
  if (!key) {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

function queueDraftAutosave(fixture, form) {
  const fixtureId = String(fixture?.id || "");
  if (!fixtureId || !form) {
    return;
  }
  const existingTimer = draftAutosaveTimers.get(fixtureId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  const nextTimer = setTimeout(() => {
    draftAutosaveTimers.delete(fixtureId);
    if (!state.isAuthed) {
      writeDraftPrediction(fixture, form);
      if (state.draftLoadedFixtureId !== fixtureId) {
        state.draftLoadedFixtureId = fixtureId;
        render();
      }
    }
  }, 300);
  draftAutosaveTimers.set(fixtureId, nextTimer);
}

function applyDraftPredictionToForm(form, draft) {
  if (!form || !draft) {
    return;
  }
  const predOpponentInput = form.querySelector(".pred-opponent");
  const predChelseaInput = form.querySelector(".pred-chelsea");
  const predScorerInput = form.querySelector(".pred-scorer");
  const predFirstScorerSelect = form.querySelector(".pred-first-scorer");
  if (predOpponentInput) predOpponentInput.value = String(draft.opponentGoals ?? 0);
  if (predChelseaInput) predChelseaInput.value = String(draft.chelseaGoals ?? 0);
  if (predScorerInput) predScorerInput.value = draft.scorerSelections || "";
  if (predFirstScorerSelect) predFirstScorerSelect.dataset.initialValue = draft.firstScorer || "";
}

function upsertDraftNotice(form, fixture, mode) {
  if (!form) {
    return;
  }
  let notice = form.querySelector(".draft-notice");
  if (!mode) {
    if (notice) {
      notice.remove();
    }
    return;
  }
  if (!notice) {
    notice = document.createElement("div");
    notice.className = "draft-notice";
    form.insertBefore(notice, form.firstChild);
  }
  notice.textContent = "";
  const text = document.createElement("span");
  text.textContent = mode === "review" ? "Draft loaded. Review and save." : "Draft loaded from this device.";
  notice.appendChild(text);
  if (mode === "loaded") {
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "ghost-btn";
    clearBtn.textContent = "Clear draft";
    clearBtn.addEventListener("click", () => {
      clearDraftPrediction(fixture?.id);
      state.draftLoadedFixtureId = "";
      state.draftNeedsReviewFixtureId = "";
      render();
    });
    notice.appendChild(clearBtn);
  }
}

function openDraftSavedModal() {
  state.draftModalOpen = true;
  renderNavigation();
}

function onCloseDraftSaveModal() {
  state.draftModalOpen = false;
  renderNavigation();
}

function renderSignedOutPredictPreview({ signedIn }) {
  if (!signedoutPreviewPanelEl) {
    return;
  }
  const show = !signedIn;
  signedoutPreviewPanelEl.classList.toggle("hidden", !show);
  if (!show) {
    return;
  }
  if (!state.overallLeaderboardLoaded && !overallLeaderboardLoadPromise && state.client) {
    ensureOverallLeaderboardLoaded().then(render);
  }

  const fixture = getNextFixtureForPrediction() || getFallbackNextFixture();
  if (!fixture) {
    if (signedoutNextFixtureLineEl) signedoutNextFixtureLineEl.textContent = "No upcoming fixture available.";
    if (signedoutNextFixtureMetaEl) signedoutNextFixtureMetaEl.textContent = "Kickoff: -- | Locks at: --";
    if (signedoutLockCountdownEl) signedoutLockCountdownEl.textContent = "Lock time unavailable. Sign in to refresh data.";
    if (signedoutNextFixtureUpdatedEl) signedoutNextFixtureUpdatedEl.textContent = "Last updated: --";
  } else {
    const fixtureLabel = `Chelsea vs ${fixture.opponent}`;
    const kickoffLabel = formatKickoff(fixture.kickoff);
    const kickoffMs = new Date(fixture.kickoff).getTime();
    const lockMs = Number.isFinite(kickoffMs)
      ? kickoffMs - PREDICTION_CUTOFF_MINUTES * 60 * 1000
      : NaN;
    const lockLabel = Number.isFinite(lockMs) ? formatKickoff(new Date(lockMs).toISOString()) : "--";
    if (signedoutNextFixtureLineEl) {
      signedoutNextFixtureLineEl.textContent = `${fixtureLabel} (${fixture.competition || "Competition"})`;
    }
    if (signedoutNextFixtureMetaEl) {
      signedoutNextFixtureMetaEl.textContent = `Kickoff: ${kickoffLabel} | Locks at: ${lockLabel}`;
    }
    renderSignedOutLockCountdown(fixture);
    if (signedoutNextFixtureUpdatedEl) {
      signedoutNextFixtureUpdatedEl.textContent = state.upcomingLastUpdatedAt
        ? `Last updated: ${formatKickoff(state.upcomingLastUpdatedAt)}`
        : "Last updated: --";
    }
  }

  if (signedoutTop10ListEl) {
    signedoutTop10ListEl.textContent = "";
    const topRows = (state.overallLeaderboard || []).slice(0, 10);
    if (topRows.length > 0) {
      topRows.forEach((row, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${index + 1}. ${escapeHtml(row.display_name || "Player")}</span><span>${Number(row.points || 0)} pts</span>`;
        signedoutTop10ListEl.appendChild(li);
      });
      if (signedoutTop10StatusEl) {
        signedoutTop10StatusEl.textContent = "Live top 10 preview.";
      }
      state.previewTop10Loaded = true;
    } else {
      const placeholders = 3;
      for (let i = 0; i < placeholders; i += 1) {
        const li = document.createElement("li");
        li.className = "placeholder";
        li.textContent = "—";
        signedoutTop10ListEl.appendChild(li);
      }
      if (signedoutTop10StatusEl) {
        signedoutTop10StatusEl.textContent = state.overallLeaderboardLoaded
          ? "Sign in to view live standings."
          : "Loading standings...";
      }
      state.previewTop10Loaded = false;
    }
  }
}

function renderSignedOutLockCountdown(fixtureOverride = null) {
  if (!signedoutLockCountdownEl) {
    return;
  }
  const fixture = fixtureOverride || getNextFixtureForPrediction() || getFallbackNextFixture();
  if (!fixture) {
    signedoutLockCountdownEl.textContent = "Lock time unavailable. Sign in to refresh data.";
    return;
  }
  const kickoffMs = new Date(fixture.kickoff).getTime();
  const lockMs = Number.isFinite(kickoffMs)
    ? kickoffMs - PREDICTION_CUTOFF_MINUTES * 60 * 1000
    : NaN;
  const remainingMs = Number.isFinite(lockMs) ? lockMs - Date.now() : NaN;
  signedoutLockCountdownEl.textContent = Number.isFinite(remainingMs)
    ? remainingMs <= 0
      ? "Prediction lock reached for this fixture."
      : `${formatDuration(remainingMs)} until lock`
    : "Lock time unavailable. Sign in to refresh data.";
}

function renderConfigErrorBanner() {
  if (!configErrorBannerEl) {
    return;
  }
  configErrorBannerEl.classList.toggle("hidden", !state.configError);
}

function renderProfileEditor() {
  if (!profileEditShellEl) {
    return;
  }
  const isAuthed = Boolean(state.isAuthed && state.user);
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

function getLeaderboardTrustMeta() {
  const completedFixtureIds = new Set();
  let latestSavedAt = null;

  state.activeLeagueFixtures.forEach((fixture) => {
    if (!fixture?.result) return;
    if (fixture.id) completedFixtureIds.add(String(fixture.id));
    const savedAt = fixture.result.saved_at ? new Date(fixture.result.saved_at).getTime() : NaN;
    if (Number.isFinite(savedAt) && (!latestSavedAt || savedAt > latestSavedAt)) {
      latestSavedAt = savedAt;
    }
  });

  (Array.isArray(state.pastGamesRows) ? state.pastGamesRows : []).forEach((row) => {
    if (!row?.result || !row?.fixture?.id) return;
    completedFixtureIds.add(String(row.fixture.id));
    const savedAt = row.result.saved_at ? new Date(row.result.saved_at).getTime() : NaN;
    if (Number.isFinite(savedAt) && (!latestSavedAt || savedAt > latestSavedAt)) {
      latestSavedAt = savedAt;
    }
  });

  const completedCount = completedFixtureIds.size;
  const latestLabel = latestSavedAt ? formatKickoff(new Date(latestSavedAt).toISOString()) : "n/a";
  return `Last updated: ${latestLabel} | Completed fixtures: ${completedCount}`;
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
      const left = createLeaderboardIdentity(
        index,
        row.display_name || "Player",
        row.country_code || "GB",
        row.avatar_url,
        Boolean(row.has_prediction)
      );
      li.appendChild(left);
      const pts = document.createElement("span");
      pts.className = "leader-points";
      pts.textContent = `${row.points || 0} pts`;
      li.appendChild(pts);
      overallLeaderboardEl.appendChild(li);
    });
  }

  const trustMeta = getLeaderboardTrustMeta();
  overallLeaderboardStatusEl.textContent = state.overallLeaderboardStatus
    ? `${state.overallLeaderboardStatus} | ${trustMeta}`
    : trustMeta;
}

function renderNavigation() {
  const signedIn = Boolean(state.client && state.isAuthed && state.user);
  const cardsEnabled = FEATURE_CARDS_ENABLED;
  const showPredict = state.topView === "predict";
  const showLeagues = signedIn && state.topView === "leagues";
  const showForum = signedIn && state.topView === "forum";
  const showResults = signedIn && state.topView === "results";
  const showCards = cardsEnabled && signedIn && state.topView === "cards";
  if (topnavPredictBtn) {
    topnavPredictBtn.classList.toggle("active", showPredict);
    topnavPredictBtn.setAttribute("aria-selected", String(showPredict));
  }
  if (topnavLeaguesBtn) {
    topnavLeaguesBtn.classList.toggle("hidden", !signedIn);
    topnavLeaguesBtn.classList.toggle("active", showLeagues);
    topnavLeaguesBtn.setAttribute("aria-selected", String(showLeagues));
  }
  if (topnavForumBtn) {
    topnavForumBtn.classList.toggle("hidden", !signedIn);
    topnavForumBtn.classList.toggle("active", showForum);
    topnavForumBtn.setAttribute("aria-selected", String(showForum));
  }
  if (forumUnreadBadgeEl) {
    const unread = Number.isFinite(state.forumUnreadCount) ? Math.max(0, state.forumUnreadCount) : 0;
    forumUnreadBadgeEl.textContent = unread > 99 ? "99+" : String(unread);
    forumUnreadBadgeEl.classList.toggle("hidden", !signedIn || unread <= 0);
  }
  if (topnavResultsBtn) {
    topnavResultsBtn.classList.toggle("hidden", !signedIn);
    topnavResultsBtn.classList.toggle("active", showResults);
    topnavResultsBtn.setAttribute("aria-selected", String(showResults));
  }
  if (topnavCardsBtn) {
    topnavCardsBtn.classList.toggle("hidden", !cardsEnabled || !signedIn);
    topnavCardsBtn.classList.toggle("active", showCards);
    topnavCardsBtn.setAttribute("aria-selected", String(showCards));
  }
  if (predictViewEl) predictViewEl.classList.toggle("hidden", !showPredict);
  if (resultsViewEl) resultsViewEl.classList.toggle("hidden", !showResults);
  if (leaguePanel) leaguePanel.classList.toggle("hidden", !showLeagues);
  if (forumPanelEl) forumPanelEl.classList.toggle("hidden", !showForum);
  if (cardsPanelEl) cardsPanelEl.classList.toggle("hidden", !cardsEnabled || !showCards);

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
  if (cardDetailModalEl) cardDetailModalEl.classList.toggle("hidden", !Boolean(state.activeCardId));
  if (draftSaveModalEl) draftSaveModalEl.classList.toggle("hidden", !state.draftModalOpen);
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
  if (!state.pastGamesLoaded && state.client) {
    loadPastGamesForUser({ background: true }).then(() => {
      if (state.topView === "results" && state.resultsTab === "past") {
        renderPastGames();
      }
    });
  }

  const rows = Array.isArray(state.pastGamesRows) ? state.pastGamesRows : [];
  const completedFixtures = rows.length > 0
    ? rows.map((row) => ({
        ...row.fixture,
        predictions: [row.prediction],
        result: row.result,
        computedPoints: row.points
      }))
    : state.activeLeagueFixtures
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

      const breakdown = document.createElement("details");
      breakdown.className = "past-game-breakdown";
      const summary = document.createElement("summary");
      summary.textContent = "Points breakdown";
      breakdown.appendChild(summary);

      const lines = document.createElement("ul");
      lines.className = "rules-list no-margin";
      const components = getPredictionPointsBreakdown(detail);
      components.forEach((line) => {
        const entry = document.createElement("li");
        entry.textContent = line;
        lines.appendChild(entry);
      });
      breakdown.appendChild(lines);
      li.appendChild(breakdown);
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

function getPredictionPointsBreakdown(detail) {
  const lines = [];
  lines.push(`Exact scoreline: ${detail.exact ? `+${SCORING.exactScore}` : "+0"}`);
  lines.push(`Correct result (W/D/L): ${!detail.exact && detail.correctResult ? `+${SCORING.correctResult}` : "+0"}`);
  lines.push(`Correct Chelsea goals: ${detail.correctChelseaGoals ? `+${SCORING.correctChelseaGoals}` : "+0"}`);
  lines.push(`Correct opponent goals: ${detail.correctOpponentGoals ? `+${SCORING.correctOpponentGoals}` : "+0"}`);
  lines.push(
    `Correct Chelsea goalscorers: ${detail.correctGoalscorers > 0 ? `+${detail.correctGoalscorers * SCORING.correctGoalscorer}` : "+0"}`
  );
  lines.push(`Correct first Chelsea scorer: ${detail.correctScorer ? `+${SCORING.correctFirstScorer}` : "+0"}`);
  lines.push(`Perfect bonus: ${detail.perfect ? `+${SCORING.perfectBonus}` : "+0"}`);
  lines.push(`Total: ${detail.points}`);
  return lines;
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
  const show = Boolean(state.session?.user) && isAdminUser();
  if (!show) {
    removeAdminConsole();
    return;
  }
  ensureAdminConsoleMounted();
  if (!adminConsoleEl || !adminLeagueListEl) {
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

function ensureAdminConsoleMounted() {
  if (adminConsoleEl && adminLeagueListEl) {
    return;
  }
  const parent = leagueAuthContentEl || leaguePanel;
  if (!parent) {
    return;
  }
  const existing = parent.querySelector("#admin-console");
  if (existing) {
    adminConsoleEl = existing;
    adminLeagueListEl = existing.querySelector("#admin-league-list");
    if (adminLeagueListEl) {
      adminLeagueListEl.addEventListener("click", onAdminLeagueListClick);
    }
    return;
  }

  const section = document.createElement("section");
  section.id = "admin-console";
  section.className = "subpanel";

  const h3 = document.createElement("h3");
  h3.textContent = "Admin Console";
  const note = document.createElement("p");
  note.className = "status no-margin";
  note.textContent = "Visible only to the configured admin account.";
  const list = document.createElement("ul");
  list.id = "admin-league-list";
  list.className = "prediction-list";
  list.addEventListener("click", onAdminLeagueListClick);

  section.appendChild(h3);
  section.appendChild(note);
  section.appendChild(list);

  const dashboard = parent.querySelector(".dashboard-grid");
  if (dashboard) {
    parent.insertBefore(section, dashboard);
  } else {
    parent.appendChild(section);
  }
  adminConsoleEl = section;
  adminLeagueListEl = list;
}

function removeAdminConsole() {
  if (adminConsoleEl && adminConsoleEl.parentNode) {
    adminConsoleEl.parentNode.removeChild(adminConsoleEl);
  }
  adminConsoleEl = null;
  adminLeagueListEl = null;
}

function getForumThreadsCache() {
  const cached = readObjectCache(FORUM_THREADS_CACHE_KEY, FORUM_THREADS_CACHE_VERSION, FORUM_THREADS_CACHE_MAX_AGE_MS);
  return Array.isArray(cached) ? cached : [];
}

function setForumThreadsCache(threads) {
  writeObjectCache(FORUM_THREADS_CACHE_KEY, FORUM_THREADS_CACHE_VERSION, threads);
}

async function refreshForumThreadsFromServer() {
  if (!state.client) {
    return false;
  }
  const { data, error } = await state.client
    .from("forum_threads")
    .select("id, title, body, user_id, author_display_name, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    state.forumStatus = "The Concourse is unavailable right now.";
    return false;
  }
  state.forumThreads = Array.isArray(data) ? data : [];
  setForumThreadsCache(state.forumThreads);
  if (state.activeForumThreadId && !state.forumThreads.some((thread) => thread.id === state.activeForumThreadId)) {
    const deepLinkedThread = await loadForumThreadById(state.activeForumThreadId);
    if (deepLinkedThread) {
      state.forumThreads = [deepLinkedThread, ...state.forumThreads];
    } else {
      state.activeForumThreadId = null;
      state.forumReplies = [];
      state.forumStatus = "Thread not found.";
    }
  }
  return true;
}

function renderForumPanel() {
  const moduleNs = topViewModuleCache.get("forum");
  if (!moduleNs || typeof moduleNs.render !== "function") {
    return;
  }
  moduleNs.render({
    state,
    ...getForumViewContext()
  });
}

async function loadMyCards(options = {}) {
  const background = Boolean(options.background);
  const force = Boolean(options.force);
  if (!FEATURE_CARDS_ENABLED) {
    state.cards = [];
    state.cardTemplates = [];
    state.cardsLoaded = true;
    state.cardsStatus = "";
    return;
  }
  if (!state.client || !state.session?.user) {
    state.cards = [];
    state.cardTemplates = [];
    state.cardsLoaded = false;
    state.cardsStatus = "Sign in to view collectables.";
    return;
  }
  const userId = state.session.user.id;

  if (!force) {
    const cachedTemplates = readCardTemplatesCache();
    const cachedCards = readUserCardsCache(userId);
    if (cachedTemplates && cachedTemplates.length > 0) {
      state.cardTemplates = cachedTemplates;
    } else if (!state.cardTemplates.length) {
      state.cardTemplates = [...DEFAULT_CARD_TEMPLATES];
    }
    if (cachedCards.length > 0) {
      state.cards = cachedCards;
      state.cardsLoaded = true;
      state.cardsStatus = "";
    }
  }

  if (!force && background && state.cardsLoaded) {
    return;
  }
  if (!force && cardsLoadPromise) {
    await cardsLoadPromise;
    return;
  }

  cardsLoadPromise = (async () => {
    const shouldFetchTemplates = force || !state.cardTemplates.length;
    const [cardsResult, templatesResult] = await Promise.all([
      state.client
        .from("user_fixture_cards")
        .select(
          "user_id, fixture_card_id, serial_number, earned_at, meta, fixture_cards(id, fixture_id, title, subtitle, created_at, card_templates(id, slug, name, description, rarity), fixtures(opponent, kickoff, competition), results(chelsea_goals, opponent_goals, first_scorer))"
        )
        .eq("user_id", state.session.user.id)
        .order("earned_at", { ascending: false }),
      shouldFetchTemplates
        ? state.client
            .from("card_templates")
            .select("id, slug, name, description, rarity, active")
            .eq("active", true)
            .order("id", { ascending: true })
        : Promise.resolve({ data: state.cardTemplates, error: null })
    ]);

    if (cardsResult.error) {
      const fallbackCards = buildFallbackCollectablesFromPredictions();
      state.cards = fallbackCards;
      writeUserCardsCache(userId, fallbackCards);
      state.cardsStatus = fallbackCards.length > 0
        ? "Showing fallback collectables while live card data sync catches up."
        : "Collectables unavailable right now.";
      state.cardsLoaded = true;
      return;
    }
    if (!templatesResult.error && Array.isArray(templatesResult.data) && templatesResult.data.length > 0) {
      state.cardTemplates = templatesResult.data;
      writeCardTemplatesCache(state.cardTemplates);
    } else if (!state.cardTemplates.length) {
      state.cardTemplates = [...DEFAULT_CARD_TEMPLATES];
    }
    state.cards = normalizeCardRows(cardsResult.data || []);
    writeUserCardsCache(userId, state.cards);
    state.cardsLoaded = true;
    state.cardsStatus = state.cards.length > 0 ? "" : "No collectables earned yet.";
  })();

  try {
    await cardsLoadPromise;
  } finally {
    cardsLoadPromise = null;
  }
}

function buildFallbackCollectablesFromPredictions() {
  const rows = Array.isArray(state.pastGamesRows) ? state.pastGamesRows : [];
  return rows
    .filter((row) => row?.prediction && row?.result)
    .slice(0, 24)
    .flatMap((row, idx) => {
      const cards = [{
        id: `fallback-${row.fixture.id}`,
        userId: state.session?.user?.id || "",
        fixtureCardId: `fallback-${row.fixture.id}`,
        fixtureId: row.fixture.id,
        title: row.points > 0 ? "Prediction Points" : "Matchday Entry",
        subtitle: `Chelsea vs ${row.fixture.opponent} | ${row.fixture.competition}`,
        templateSlug: row.points > 0 ? "correct-result-fallback" : "entry-fallback",
        templateName: row.points > 0 ? "Points Earned" : "Prediction Logged",
        templateDescription: row.points > 0 ? "You earned points for this completed match." : "You submitted a prediction.",
        rarity: row.points >= 6 ? "rare" : "common",
        opponent: row.fixture.opponent || "Opponent",
        kickoff: row.fixture.kickoff || "",
        competition: row.fixture.competition || "Competition",
        scoreLine: `${row.result.chelsea_goals}-${row.result.opponent_goals}`,
        firstScorer: row.result.first_scorer || "",
        serialNumber: idx + 1,
        earnedAt: row.result.saved_at || row.fixture.kickoff || "",
        meta: {
          reason: row.points > 0 ? `${row.points} points in this fixture.` : "Prediction submitted for this fixture."
        },
        earned: true
      }];

      const predictedFirst = normalizeFirstScorerValue(row.prediction.first_scorer || "");
      const actualFirst = normalizeFirstScorerValue(row.result.first_scorer || "");
      const hasChelseaScorer = Number(row.result.chelsea_goals || 0) > 0;
      if (hasChelseaScorer && predictedFirst && actualFirst && predictedFirst === actualFirst) {
        cards.push({
          id: `fallback-${row.fixture.id}-first-scorer`,
          userId: state.session?.user?.id || "",
          fixtureCardId: `fallback-${row.fixture.id}-first-scorer`,
          fixtureId: row.fixture.id,
          title: "First Chelsea Scorer",
          subtitle: `Chelsea vs ${row.fixture.opponent} | ${row.fixture.competition}`,
          templateSlug: "first-chelsea-scorer",
          templateName: "First Chelsea Scorer",
          templateDescription: "Picked the first Chelsea goalscorer correctly.",
          rarity: "common",
          opponent: row.fixture.opponent || "Opponent",
          kickoff: row.fixture.kickoff || "",
          competition: row.fixture.competition || "Competition",
          scoreLine: `${row.result.chelsea_goals}-${row.result.opponent_goals}`,
          firstScorer: row.result.first_scorer || "",
          serialNumber: idx + 101,
          earnedAt: row.result.saved_at || row.fixture.kickoff || "",
          meta: {
            reason: "Correct first Chelsea goalscorer."
          },
          earned: true
        });
      }

      return cards;
    });
}

function normalizeCardRows(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => {
    const fixtureCard = row.fixture_cards || {};
    const templateRaw = fixtureCard.card_templates;
    const template = Array.isArray(templateRaw) ? templateRaw[0] || {} : templateRaw || {};
    const fixtureRaw = fixtureCard.fixtures;
    const fixture = Array.isArray(fixtureRaw) ? fixtureRaw[0] || {} : fixtureRaw || {};
    const resultRaw = fixtureCard.results;
    const result = Array.isArray(resultRaw) ? resultRaw[0] || null : resultRaw || null;
    return {
      id: String(row.fixture_card_id),
      userId: row.user_id,
      fixtureCardId: row.fixture_card_id,
      fixtureId: fixtureCard.fixture_id || "",
      title: fixtureCard.title || template.name || "Matchday Moment",
      subtitle: fixtureCard.subtitle || "",
      templateSlug: template.slug || "",
      templateName: template.name || "Card",
      templateDescription: template.description || "",
      rarity: ["common", "rare", "legendary"].includes(template.rarity) ? template.rarity : "common",
      opponent: fixture.opponent || "Opponent",
      kickoff: fixture.kickoff || "",
      competition: fixture.competition || "Competition",
      scoreLine: result ? `${result.chelsea_goals}-${result.opponent_goals}` : "",
      firstScorer: result?.first_scorer || "",
      serialNumber: row.serial_number,
      earnedAt: row.earned_at || "",
      meta: row.meta || {},
      earned: true
    };
  });
}

function getCardsFixtureTarget() {
  const completed = [...state.activeLeagueFixtures]
    .filter((fixture) => Boolean(fixture.result))
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())[0];
  if (completed) {
    return completed;
  }
  return getNextFixtureForPrediction() || null;
}

function getVisibleCards() {
  const rarityFilter = state.cardsRarityFilter;
  const fixtureFilter = state.cardsFixtureFilter;
  const baseCards = state.cards.filter((card) => {
    if (rarityFilter !== "all" && card.rarity !== rarityFilter) {
      return false;
    }
    return true;
  });

  if (fixtureFilter !== "match") {
    return baseCards;
  }

  const fixtureTarget = getCardsFixtureTarget();
  if (!fixtureTarget) {
    return baseCards;
  }
  const earnedForFixture = baseCards.filter((card) => card.fixtureId === fixtureTarget.id);
  const placeholders = buildLockedCardsForFixture(fixtureTarget, earnedForFixture, rarityFilter);
  return [...earnedForFixture, ...placeholders];
}

function buildLockedCardsForFixture(fixture, earnedCards, rarityFilter) {
  const earnedSlugs = new Set(earnedCards.map((card) => card.templateSlug));
  return state.cardTemplates
    .filter((template) => template.active !== false)
    .filter((template) => !earnedSlugs.has(template.slug))
    .filter((template) => rarityFilter === "all" || template.rarity === rarityFilter)
    .map((template) => ({
      id: `locked-${fixture.id}-${template.slug}`,
      userId: state.session?.user?.id || "",
      fixtureCardId: null,
      fixtureId: fixture.id,
      title: template.name,
      subtitle: `Chelsea vs ${fixture.opponent}`,
      templateSlug: template.slug,
      templateName: template.name,
      templateDescription: template.description,
      rarity: template.rarity,
      opponent: fixture.opponent,
      kickoff: fixture.kickoff,
      competition: fixture.competition || "Competition",
      scoreLine: fixture.result ? `${fixture.result.chelsea_goals}-${fixture.result.opponent_goals}` : "",
      firstScorer: fixture.result?.first_scorer || "",
      serialNumber: null,
      earnedAt: "",
      meta: {},
      earned: false
    }));
}

function renderCardsPanel() {
  if (!FEATURE_CARDS_ENABLED || !cardsPanelEl) {
    return;
  }
  const signedIn = Boolean(state.client && state.isAuthed && state.user);
  if (!signedIn) {
    return;
  }
  if (!state.cardsLoaded && !cardsLoadPromise) {
    loadMyCards({ background: true }).then(render);
  }

  const visibleCards = getVisibleCards();
  const counts = getCardRarityCounts(state.cards);
  if (cardsSummaryEl) {
    cardsSummaryEl.textContent = `Total collectables: ${state.cards.length} | Common: ${counts.common} | Rare: ${counts.rare} | Legendary: ${counts.legendary}`;
  }

  if (cardsFilterAllBtn) {
    const active = state.cardsFixtureFilter === "all";
    cardsFilterAllBtn.classList.toggle("active", active);
    cardsFilterAllBtn.setAttribute("aria-selected", String(active));
  }
  if (cardsFilterMatchBtn) {
    const active = state.cardsFixtureFilter === "match";
    cardsFilterMatchBtn.classList.toggle("active", active);
    cardsFilterMatchBtn.setAttribute("aria-selected", String(active));
  }
  const rarityButtons = [
    [cardsRarityAllBtn, "all"],
    [cardsRarityCommonBtn, "common"],
    [cardsRarityRareBtn, "rare"],
    [cardsRarityLegendaryBtn, "legendary"]
  ];
  rarityButtons.forEach(([btn, key]) => {
    if (!btn) return;
    const active = state.cardsRarityFilter === key;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  if (cardsGridEl) {
    cardsGridEl.textContent = "";
    visibleCards.forEach((card) => {
      cardsGridEl.appendChild(renderCardGridItem(card));
    });
  }
  if (cardsEmptyEl) {
    cardsEmptyEl.classList.toggle("hidden", visibleCards.length > 0);
  }

  if (state.cardDeepLinkId && !state.activeCardId) {
    const target = visibleCards.find((card) => card.id === state.cardDeepLinkId || String(card.fixtureCardId) === state.cardDeepLinkId);
    if (target) {
      state.activeCardId = target.id;
      state.cardDeepLinkId = "";
    }
  }

  renderCardDetailModal();
}

function getCardRarityCounts(cards) {
  return cards.reduce(
    (acc, card) => {
      if (card.rarity === "rare") acc.rare += 1;
      else if (card.rarity === "legendary") acc.legendary += 1;
      else acc.common += 1;
      return acc;
    },
    { common: 0, rare: 0, legendary: 0 }
  );
}

function renderCardGridItem(card) {
  const li = document.createElement("li");
  li.className = `moment-card rarity-${card.rarity}`;
  if (!card.earned) {
    li.classList.add("is-locked");
  }
  const earnedAtMs = card.earnedAt ? new Date(card.earnedAt).getTime() : NaN;
  const isNew = card.earned && Number.isFinite(earnedAtMs) && Date.now() - earnedAtMs < 24 * 60 * 60 * 1000;
  li.innerHTML = `
    <button type="button" class="moment-card-hit" aria-label="${card.templateName} collectable">
      <div class="moment-card-head">
        <span class="moment-rarity-pill">${capitalize(card.rarity)}</span>
        <span class="moment-competition-pill">${card.competition}</span>
      </div>
      <h3 class="moment-card-title">${escapeHtml(card.templateName)}</h3>
      <p class="moment-card-context">${escapeHtml(card.subtitle || `Chelsea vs ${card.opponent}`)}</p>
      <p class="moment-card-score">${card.scoreLine ? escapeHtml(card.scoreLine) : "—"}</p>
      <p class="moment-card-reason">${escapeHtml(card.meta?.reason || card.templateDescription || "Not earned yet")}</p>
      <div class="moment-card-footer">
        <span>${card.serialNumber ? `#${card.serialNumber}` : "Not earned"}</span>
        <span>${card.earnedAt ? formatKickoff(card.earnedAt) : "—"}</span>
      </div>
      ${isNew ? '<span class="moment-new-pill">New</span>' : ""}
      ${!card.earned ? '<span class="moment-locked-pill">Not earned</span>' : ""}
    </button>
  `;
  const hit = li.querySelector(".moment-card-hit");
  if (hit) {
    hit.addEventListener("click", () => {
      state.activeCardId = card.id;
      trackEvent("card_opened", {
        fixture_id: card.fixtureId,
        template_slug: card.templateSlug,
        rarity: card.rarity
      });
      syncRouteHash();
      renderCardDetailModal();
    });
  }
  return li;
}

function renderCardDetail(card) {
  const wrapper = document.createElement("article");
  wrapper.className = `moment-card-detail rarity-${card.rarity}${card.earned ? "" : " is-locked"}`;
  const reason = card.meta?.reason || card.templateDescription || "Not earned yet.";
  wrapper.innerHTML = `
    <div class="moment-card-head">
      <span class="moment-rarity-pill">${capitalize(card.rarity)}</span>
      <span class="moment-competition-pill">${card.competition}</span>
    </div>
    <h3 class="moment-card-title">${escapeHtml(card.templateName)}</h3>
    <p class="moment-card-context">${escapeHtml(card.subtitle || `Chelsea vs ${card.opponent}`)}</p>
    <p class="moment-card-score">${card.scoreLine ? escapeHtml(card.scoreLine) : "—"}</p>
    <p class="moment-card-reason">${escapeHtml(reason)}</p>
    <p class="moment-card-help"><strong>How to earn:</strong> ${escapeHtml(card.templateDescription || "Complete fixture criteria.")}</p>
    <div class="moment-card-footer">
      <span>${card.serialNumber ? `Serial #${card.serialNumber}` : "Not earned"}</span>
      <span>${card.earnedAt ? `Earned ${formatKickoff(card.earnedAt)}` : "Awaiting unlock"}</span>
    </div>
  `;
  return wrapper;
}

function renderCardDetailModal() {
  if (!cardDetailModalEl || !cardDetailBodyEl) {
    return;
  }
  const visibleCards = getVisibleCards();
  const active = visibleCards.find((card) => card.id === state.activeCardId);
  const show = Boolean(active);
  cardDetailModalEl.classList.toggle("hidden", !show);
  if (!show) {
    cardDetailBodyEl.textContent = "";
    return;
  }
  cardDetailBodyEl.textContent = "";
  cardDetailBodyEl.appendChild(renderCardDetail(active));
}

function getNextPendingResultFixture() {
  return state.activeLeagueFixtures
    .filter((fixture) => !fixture.result && new Date(fixture.kickoff).getTime() <= Date.now())
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())[0] || null;
}

function getAdminResultFixtureOptions() {
  const now = Date.now();
  const base = state.activeLeagueFixtures
    .filter((fixture) => Number.isFinite(new Date(fixture.kickoff).getTime()))
    .filter((fixture) => new Date(fixture.kickoff).getTime() <= now)
    .slice();

  const byMatch = new Map();
  base.forEach((fixture) => {
    const key = fixtureScheduleKey(fixture.kickoff, fixture.opponent, fixture.competition);
    const existing = byMatch.get(key);
    if (!existing) {
      byMatch.set(key, fixture);
      return;
    }
    byMatch.set(key, pickPreferredAdminFixture(existing, fixture));
  });

  return [...byMatch.values()]
    .sort((a, b) => {
      const aNeedsResult = !a.result;
      const bNeedsResult = !b.result;
      if (aNeedsResult !== bNeedsResult) {
        return aNeedsResult ? -1 : 1;
      }
      return new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime();
    });
}

function pickPreferredAdminFixture(current, candidate) {
  const score = (fixture) => {
    let value = 0;
    if (fixture.result) value += 100;
    if (state.session?.user?.id && fixture.predictions?.some((row) => row.user_id === state.session.user.id)) {
      value += 50;
    }
    const createdAtTs = Number.isFinite(new Date(fixture.created_at).getTime())
      ? new Date(fixture.created_at).getTime()
      : 0;
    // Prefer older (likely canonical) rows when other factors tie.
    value += createdAtTs > 0 ? Math.max(0, 1_000_000_000_000 - createdAtTs) / 1_000_000_000_000 : 0;
    return value;
  };
  return score(candidate) > score(current) ? candidate : current;
}

function renderAdminScorePanel() {
  if (!adminScorePanelEl) {
    return;
  }
  const visible = Boolean(state.session?.user) && canManageResults() && state.topView === "predict";
  adminScorePanelEl.classList.toggle("hidden", !visible);
  if (!visible) {
    adminScorePanelEl.textContent = "";
    return;
  }

  const options = getAdminResultFixtureOptions();
  adminScorePanelEl.textContent = "";

  const heading = document.createElement("h3");
  heading.textContent = "Admin Score Input";
  adminScorePanelEl.appendChild(heading);

  const ack = state.adminScoreAck;
  const ackFresh = Boolean(ack) && Date.now() - ack.at < 12000;
  if (ackFresh) {
    const ackEl = document.createElement("p");
    ackEl.className = "admin-score-meta";
    ackEl.textContent = ack.message;
    ackEl.style.color = ack.isError ? "#9f2b2b" : "#0b6b3a";
    adminScorePanelEl.appendChild(ackEl);
  }

  if (options.length === 0) {
    const status = document.createElement("p");
    status.className = "admin-score-meta";
    status.textContent = "No completed fixtures available yet.";
    adminScorePanelEl.appendChild(status);
    return;
  }

  const selectedId = state.adminResultFixtureId && options.some((fixture) => fixture.id === state.adminResultFixtureId)
    ? state.adminResultFixtureId
    : options[0].id;
  state.adminResultFixtureId = selectedId;
  const targetFixture = options.find((fixture) => fixture.id === selectedId) || options[0];

  const selectorWrap = document.createElement("label");
  selectorWrap.className = "admin-score-meta";
  selectorWrap.textContent = "Select fixture";
  const selector = document.createElement("select");
  options.forEach((fixture) => {
    const option = document.createElement("option");
    option.value = fixture.id;
    const statusLabel = fixture.result ? "Result saved" : "Needs result";
    option.textContent = `${formatKickoff(fixture.kickoff)} | Chelsea vs ${fixture.opponent} (${fixture.competition}) — ${statusLabel}`;
    selector.appendChild(option);
  });
  selector.value = targetFixture.id;
  selector.addEventListener("change", (event) => {
    state.adminResultFixtureId = event.target.value || "";
    render();
  });
  selectorWrap.appendChild(selector);
  adminScorePanelEl.appendChild(selectorWrap);

  const meta = document.createElement("p");
  meta.className = "admin-score-meta";
  meta.textContent = `${formatKickoff(targetFixture.kickoff)} | Chelsea vs ${targetFixture.opponent} (${targetFixture.competition})`;
  adminScorePanelEl.appendChild(meta);

  const form = document.createElement("form");
  form.className = "admin-score-form";

  const grid = document.createElement("div");
  grid.className = "admin-score-grid";

  const chelseaLabel = document.createElement("label");
  chelseaLabel.textContent = "Chelsea goals";
  const chelseaInput = document.createElement("input");
  chelseaInput.type = "number";
  chelseaInput.className = "result-chelsea";
  chelseaInput.min = "0";
  chelseaInput.required = true;
  chelseaInput.value = String(targetFixture.result?.chelsea_goals ?? 0);
  chelseaLabel.appendChild(chelseaInput);

  const oppLabel = document.createElement("label");
  oppLabel.textContent = `${targetFixture.opponent} goals`;
  const oppInput = document.createElement("input");
  oppInput.type = "number";
  oppInput.className = "result-opponent";
  oppInput.min = "0";
  oppInput.required = true;
  oppInput.value = String(targetFixture.result?.opponent_goals ?? 0);
  oppLabel.appendChild(oppInput);

  const scorerLabel = document.createElement("label");
  scorerLabel.textContent = "First Chelsea scorer";
  const scorerInput = document.createElement("select");
  scorerInput.className = "result-scorer";
  const scorerPlaceholder = document.createElement("option");
  scorerPlaceholder.value = "Unknown";
  scorerPlaceholder.textContent = "Unknown / not listed";
  scorerInput.appendChild(scorerPlaceholder);
  const players = getChelseaRegisteredPlayers();
  players.forEach((player) => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    scorerInput.appendChild(option);
  });
  const existingScorer =
    targetFixture.result?.first_scorer &&
    !["none", "unknown"].includes(String(targetFixture.result.first_scorer).toLowerCase())
      ? String(targetFixture.result.first_scorer)
      : "Unknown";
  scorerInput.value = players.includes(existingScorer) ? existingScorer : "Unknown";
  scorerLabel.appendChild(scorerInput);

  grid.appendChild(chelseaLabel);
  grid.appendChild(oppLabel);
  grid.appendChild(scorerLabel);
  form.appendChild(grid);

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = targetFixture.result ? "Update Final Score" : "Save Final Score";
  form.appendChild(submit);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    submit.textContent = "Saving...";
    await onSaveResult(targetFixture, form);
    submit.disabled = false;
    submit.textContent = targetFixture.result ? "Update Final Score" : "Save Final Score";
  });

  adminScorePanelEl.appendChild(form);
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
  if (leagueLeaderboardStatusEl) {
    leagueLeaderboardStatusEl.textContent = getLeaderboardTrustMeta();
  }
  leaderboardEl.textContent = "";
  const activeLeague = getActiveLeague();
  const useGlobalTopTen = isGlobalLeague(activeLeague);
  const rows = useGlobalTopTen
    ? (state.overallLeaderboard.length > 0 ? state.overallLeaderboard.slice(0, 10) : state.activeLeagueLeaderboard)
    : state.activeLeagueLeaderboard;

  if (!state.activeLeagueId || rows.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = useGlobalTopTen
      ? "No global rankings yet. Rankings appear after completed matches."
      : "No members yet.";
    leaderboardEl.appendChild(li);
    return;
  }

  rows.forEach((row, index) => {
    const li = document.createElement("li");
    li.classList.add("leaderboard-row");
    const safeName = row.display_name || "Player";
    const suffix = !useGlobalTopTen && row.role === "owner" ? " (Owner)" : "";
    const left = createLeaderboardIdentity(
      index,
      `${safeName}${suffix}`.trim(),
      row.country_code,
      row.avatar_url,
      Boolean(row.has_prediction)
    );
    const breakdown = state.leagueLastGameBreakdownByUser?.[row.user_id] || null;
    if (breakdown) {
      left.classList.add("leader-identity-clickable");
      left.setAttribute("role", "button");
      left.setAttribute("tabindex", "0");
      left.setAttribute("aria-expanded", String(state.expandedLeaderboardUserId === row.user_id));
      const hint = document.createElement("span");
      hint.className = "leader-breakdown-toggle";
      hint.textContent = state.expandedLeaderboardUserId === row.user_id ? "▲" : "▼";
      left.appendChild(hint);
      const toggle = () => {
        state.expandedLeaderboardUserId = state.expandedLeaderboardUserId === row.user_id ? "" : row.user_id;
        render();
      };
      left.addEventListener("click", toggle);
      left.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });
    }
    li.appendChild(left);
    const right = document.createElement("span");
    right.className = "leader-points";
    right.textContent = `${row.points} pts`;
    li.appendChild(right);
    if (breakdown && state.expandedLeaderboardUserId === row.user_id) {
      const drop = document.createElement("div");
      drop.className = "leader-breakdown";
      drop.textContent = formatLeaderboardBreakdown(breakdown);
      li.appendChild(drop);
    }
    leaderboardEl.appendChild(li);
  });
}

function formatLeaderboardBreakdown(row) {
  const parts = [];
  parts.push(`Last game: Chelsea ${row.actual_chelsea_goals}-${row.actual_opponent_goals} ${row.opponent}`);
  if (row.did_submit) {
    parts.push(`Prediction: ${row.predicted_chelsea_goals}-${row.predicted_opponent_goals}`);
    parts.push(`Predicted first Chelsea scorer: ${row.predicted_first_scorer || "None / not selected"}`);
    parts.push(`Actual first Chelsea scorer: ${row.actual_first_scorer || "Unknown"}`);
    parts.push(`Points: ${row.points} (Score ${row.exact_score_points}, Result ${row.result_points}, Chelsea goals ${row.chelsea_goals_points}, Opponent goals ${row.opponent_goals_points}, Scorers ${row.goalscorer_points}, First scorer ${row.first_scorer_points}, Bonus ${row.perfect_bonus_points})`);
  } else {
    parts.push("No prediction submitted for this game.");
  }
  return parts.join(" | ");
}

function renderFixtures() {
  fixturesListEl.textContent = "";
  const isAuthed = Boolean(state.isAuthed && state.user);

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
    const fallbackPredictable = isAuthed && isFallbackFixture && !locked;
    const predictionEnabled = (isNextFixture || fallbackPredictable) && !locked && canWriteActions();
    const canSubmitPrediction = isAuthed && !locked && canWriteActions();
    const hasStarted = Date.now() >= new Date(fixture.kickoff).getTime();

    const myPrediction = isAuthed
      ? fixture.predictions.find((row) => row.user_id === state.user.id)
      : null;
    if (!isAuthed) {
      badgeEl.classList.add("hidden");
      badgeEl.textContent = "";
    } else if (isFallbackFixture) {
      badgeEl.classList.remove("hidden");
      badgeEl.textContent = locked ? "Locked (90m cutoff)" : "Open";
    } else if (fixture.result) {
      badgeEl.classList.remove("hidden");
      badgeEl.textContent = "Result Saved";
    } else if (hasStarted) {
      badgeEl.classList.remove("hidden");
      badgeEl.textContent = "Closed";
    } else if (locked) {
      badgeEl.classList.remove("hidden");
      badgeEl.textContent = "Locked (90m cutoff)";
    } else if (myPrediction) {
      badgeEl.classList.remove("hidden");
      badgeEl.textContent = "Saved (editable)";
    } else {
      badgeEl.classList.remove("hidden");
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
      const cachedSelections = readCachedPredictionScorers(fixture.id, state.user.id);
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
    const storedDraft = readDraftPrediction(fixture.id);
    const shouldApplySignedInDraft = Boolean(
      isAuthed &&
      storedDraft &&
      predictionEnabled &&
      state.draftNeedsReviewFixtureId !== fixture.id
    );
    if ((!isAuthed && storedDraft) || shouldApplySignedInDraft) {
      applyDraftPredictionToForm(predictionForm, storedDraft);
      state.draftLoadedFixtureId = fixture.id;
      if (shouldApplySignedInDraft) {
        state.draftNeedsReviewFixtureId = fixture.id;
      }
    }
    if (!predFirstScorerSelect.dataset.initialValue) {
      predFirstScorerSelect.dataset.initialValue = initialFirstScorer;
    }

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
    const needsDraftReview = isAuthed && state.draftNeedsReviewFixtureId === fixture.id;
    if (savePredictionBtn) {
      savePredictionBtn.textContent = !isAuthed
        ? "Sign in to submit"
        : needsDraftReview
          ? "Review and Save"
          : myPrediction
            ? "Update Prediction"
            : "Save Prediction";
      savePredictionBtn.title = canSubmitPrediction
        ? "You can edit your prediction until 90 minutes before kick-off."
        : "";
      savePredictionBtn.classList.toggle("needs-review", Boolean(needsDraftReview));
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
    if (savePredictionBtn && canSubmitPrediction && isVeryRecentAck) {
      savePredictionBtn.textContent = ack.updated ? "Prediction updated" : "Prediction saved";
    }
    if (isAuthed && predictionAckEl && myPrediction) {
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

    const allowSignedOutDraft = !isAuthed && predictionEnabled;
    if (!isAuthed && !allowSignedOutDraft) {
      predictionForm.querySelectorAll("input, button:not([type='submit']), select").forEach((node) => {
        node.disabled = true;
      });
    } else if (!isAuthed && allowSignedOutDraft) {
      predictionForm.querySelectorAll("input, button:not([type='submit']), select").forEach((node) => {
        node.disabled = false;
      });
      chelseaMinusBtn.disabled = true;
      chelseaPlusBtn.disabled = true;
      chelseaMinusBtn.title = "Chelsea goals are auto-set from selected goalscorers.";
      chelseaPlusBtn.title = "Chelsea goals are auto-set from selected goalscorers.";
    } else if (!canWriteActions() || locked) {
      predictionForm.querySelectorAll("input, button:not([type='submit']), select").forEach((node) => {
        node.disabled = true;
      });
    } else {
      predictionForm.querySelectorAll("input, button:not([type='submit']), select").forEach((node) => {
        node.disabled = false;
      });
      chelseaMinusBtn.disabled = true;
      chelseaPlusBtn.disabled = true;
      chelseaMinusBtn.title = "Chelsea goals are auto-set from selected goalscorers.";
      chelseaPlusBtn.title = "Chelsea goals are auto-set from selected goalscorers.";
    }
    if (savePredictionBtn) {
      if (!canWriteActions()) {
        savePredictionBtn.textContent = "Configuration error";
      } else if (locked) {
        savePredictionBtn.textContent = "Prediction locked";
      } else if (isAuthed && isFallbackFixture) {
        savePredictionBtn.textContent = myPrediction ? "Update Prediction" : "Save Prediction";
      } else if (!isAuthed && !allowSignedOutDraft) {
        savePredictionBtn.textContent = "Loading next fixture...";
      }
    }
    if (savePredictionBtn) {
      savePredictionBtn.disabled = !isAuthed
        ? false
        : !canSubmitPrediction;
    }

    if (!isAuthed && state.draftLoadedFixtureId === fixture.id) {
      upsertDraftNotice(predictionForm, fixture, "loaded");
    } else if (needsDraftReview) {
      upsertDraftNotice(predictionForm, fixture, "review");
    } else {
      upsertDraftNotice(predictionForm, fixture, "");
    }

    if (!isAuthed) {
      const autosaveEvents = ["input", "change"];
      autosaveEvents.forEach((eventName) => {
        predictionForm.addEventListener(eventName, () => {
          queueDraftAutosave(fixture, predictionForm);
        });
      });
    }

    predictionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!isAuthed) {
        writeDraftPrediction(fixture, predictionForm);
        state.draftLoadedFixtureId = fixture.id;
        openDraftSavedModal();
        return;
      }
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
  return Boolean(state.session?.user) && Boolean(state.isAdmin);
}

function canManageResults() {
  if (!state.session?.user) {
    return false;
  }
  if (isAdminUser() || isAllowlistedAdminEmail()) {
    return true;
  }
  const member = getCurrentMember();
  return member?.role === "owner";
}

function getCurrentUserEmail() {
  return String(state.session?.user?.email || "").trim().toLowerCase();
}

function isAllowlistedAdminEmail() {
  const email = getCurrentUserEmail();
  return Boolean(email) && ADMIN_EMAIL_ALLOWLIST.has(email);
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

function createLeaderboardIdentity(index, displayName, countryCode, avatarUrl, hasPrediction = false) {
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
  if (hasPrediction) {
    const tick = document.createElement("span");
    tick.className = "leader-submitted-tick";
    tick.textContent = "✓";
    tick.title = "Prediction submitted";
    tick.setAttribute("aria-label", "Prediction submitted");
    wrap.appendChild(tick);
  }
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

async function fetchSportsDbTopScorersForLeague(leagueId, signal) {
  const url = new URL(`${THE_SPORTS_DB_BASE_URL}/lookuptopscorers.php`);
  url.searchParams.set("l", leagueId);
  url.searchParams.set("s", THE_SPORTS_DB_SEASON);
  const response = await fetch(url.toString(), { signal });
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
  if (!force && scorerStatsSyncPromise) {
    return scorerStatsSyncPromise;
  }

  if (scorerStatsAbortController) {
    scorerStatsAbortController.abort();
  }
  scorerStatsAbortController = new AbortController();
  const scorerSignal = scorerStatsAbortController.signal;

  scorerStatsSyncPromise = (async () => {
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
        const rows = await fetchSportsDbTopScorersForLeague(competition.leagueId, scorerSignal);
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
        if (error?.name === "AbortError") {
          return;
        }
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
  })();

  try {
    await scorerStatsSyncPromise;
  } finally {
    scorerStatsSyncPromise = null;
    scorerStatsAbortController = null;
  }
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
    state.upcomingLastUpdatedAt = parsed.syncedAt || "";
    state.upcomingSourceText = `Auto-updated from official fixtures feed (${new Date(parsed.syncedAt).toLocaleString()}).`;
  } catch {
    // Ignore cache parse errors.
  }
}

async function syncUpcomingFixturesFromChelsea(force = false) {
  if (!force && upcomingFixturesSyncPromise) {
    return upcomingFixturesSyncPromise;
  }

  if (upcomingFixturesAbortController) {
    upcomingFixturesAbortController.abort();
  }
  upcomingFixturesAbortController = new AbortController();
  const fixturesSignal = upcomingFixturesAbortController.signal;

  upcomingFixturesSyncPromise = (async () => {
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

  let fetchTimeoutId = null;
  try {
    fetchTimeoutId = setTimeout(() => {
      if (!fixturesSignal.aborted) {
        upcomingFixturesAbortController?.abort();
      }
    }, 7000);
    const response = await fetch(CHELSEA_FIXTURES_PROXY_URL, { signal: fixturesSignal });
    if (fetchTimeoutId) {
      clearTimeout(fetchTimeoutId);
      fetchTimeoutId = null;
    }
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    const parsedFixtures = parseChelseaFixturesPage(text);
    if (parsedFixtures.length >= 5) {
      state.upcomingFixtures = parsedFixtures;
      const syncedAt = new Date().toISOString();
      state.upcomingLastUpdatedAt = syncedAt;
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
  } catch (error) {
    // Guard against timeout handles leaking on throw paths.
    if (fetchTimeoutId) {
      clearTimeout(fetchTimeoutId);
    }
    if (error?.name === "AbortError") {
      return;
    }
    state.upcomingSourceText = "Live fixture sync unavailable. Showing fallback fixture list.";
  }
  })();

  try {
    await upcomingFixturesSyncPromise;
  } finally {
    upcomingFixturesSyncPromise = null;
    upcomingFixturesAbortController = null;
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

function fixtureScheduleKey(kickoff, opponent, competition) {
  const dateKey = Number.isFinite(new Date(kickoff).getTime())
    ? new Date(kickoff).toISOString().slice(0, 10)
    : "";
  return `${dateKey}::${String(opponent || "").trim().toLowerCase()}::${String(competition || "").trim().toLowerCase()}`;
}

function getNextFixtureForPrediction() {
  const upcoming = state.activeLeagueFixtures
    .filter((fixture) => !fixture.result)
    .filter((fixture) => Number.isFinite(new Date(fixture.kickoff).getTime()))
    .filter((fixture) => new Date(fixture.kickoff).getTime() > Date.now());

  if (upcoming.length === 0) {
    return null;
  }

  const grouped = new Map();
  upcoming.forEach((fixture) => {
    const key = fixtureScheduleKey(fixture.kickoff, fixture.opponent, fixture.competition);
    const bucket = grouped.get(key) || [];
    bucket.push(fixture);
    grouped.set(key, bucket);
  });

  const deduped = [];
  grouped.forEach((bucket) => {
    const withMine =
      state.session?.user
        ? bucket.find((fixture) => fixture.predictions?.some((row) => row.user_id === state.session.user.id))
        : null;
    if (withMine) {
      deduped.push(withMine);
      return;
    }
    const earliest = bucket
      .slice()
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())[0];
    if (earliest) {
      deduped.push(earliest);
    }
  });

  return deduped
    .slice()
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())[0] || null;
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
    if (!state.isAuthed) {
      renderSignedOutLockCountdown();
    }
    return;
  }

  const kickoffIso = buildFixtureKickoffIso(nextFixture.date, nextFixture.kickoffUk);
  const kickoffMs = new Date(kickoffIso).getTime();
  if (!Number.isFinite(kickoffMs)) {
    deadlineCountdownEl.textContent = `Next fixture: Chelsea vs ${nextFixture.opponent}. Kickoff time TBC.`;
    if (!state.isAuthed) {
      renderSignedOutLockCountdown();
    }
    return;
  }

  const deadlineMs = kickoffMs - PREDICTION_CUTOFF_MINUTES * 60 * 1000;
  const remainingMs = deadlineMs - Date.now();
  const fixtureLabel = `Chelsea vs ${nextFixture.opponent}`;

  if (remainingMs <= 0) {
    deadlineCountdownEl.textContent = `Prediction deadline passed for ${fixtureLabel}.`;
    if (!state.isAuthed) {
      renderSignedOutLockCountdown();
    }
    return;
  }

  deadlineCountdownEl.textContent = `Next deadline (${fixtureLabel}): ${formatDuration(remainingMs)} remaining`;
  if (!state.isAuthed) {
    renderSignedOutLockCountdown();
  }
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

function renderVisitorCount() {
  if (!visitorCountEl) {
    return;
  }
  const show = Boolean(state.session?.user) && isAdminUser();
  visitorCountEl.classList.toggle("hidden", !show);
  if (!show) {
    visitorCountEl.textContent = "";
    return;
  }
  if (!Number.isFinite(state.visitorCount)) {
    visitorCountEl.textContent = "Visitor count: loading...";
    return;
  }
  visitorCountEl.textContent = `Total visitors tracked: ${state.visitorCount}`;
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

function capitalize(value) {
  const text = String(value || "").trim();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
