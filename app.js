const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";
const FIXTURE_CACHE_KEY = "cfc-upcoming-fixtures-cache-v1";
const FIXTURE_CACHE_VERSION = 3;
const PREDICTION_SCORERS_CACHE_KEY = "cfc-prediction-scorers-cache-v1";
const SQUAD_CACHE_KEY = "cfc-team-squads-cache-v1";
const SQUAD_CACHE_VERSION = 2;
const SQUAD_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PREDICTION_CUTOFF_MINUTES = 90;
const SCORING = { exactScore: 3, correctResult: 1, correctFirstScorer: 2 };
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
const CHELSEA_REGISTERED_PLAYERS = [
  "Robert Sanchez", "Filip Jorgensen", "Djordje Petrovic", "Malo Gusto", "Reece James",
  "Trevoh Chalobah", "Levi Colwill", "Wesley Fofana", "Benoit Badiashile", "Marc Cucurella",
  "Enzo Fernandez", "Moises Caicedo", "Romeo Lavia", "Carney Chukwuemeka", "Cole Palmer",
  "Pedro Neto", "Noni Madueke", "Mykhailo Mudryk", "Christopher Nkunku", "Nicolas Jackson",
  "Joao Pedro", "Estevao", "Kendry Paez"
];

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
  teamSquads: { Chelsea: [...CHELSEA_REGISTERED_PLAYERS] },
  teamSquadFetchedAt: {},
  squadFetchInFlight: {},
  showAllUpcoming: false,
  overviewTab: "global",
  upcomingFixtures: [...FALLBACK_FIXTURES],
  upcomingSourceText: "Using bundled SW6 fixture fallback list."
};

const overviewFixturesTabBtn = document.getElementById("overview-fixtures-tab");
const overviewScorersTabBtn = document.getElementById("overview-scorers-tab");
const overviewGlobalTabBtn = document.getElementById("overview-global-tab");
const overviewLeaguesTabBtn = document.getElementById("overview-leagues-tab");
const fixturesOverviewPanel = document.getElementById("fixtures-overview-panel");
const scorersOverviewPanel = document.getElementById("scorers-overview-panel");
const globalOverviewPanel = document.getElementById("global-overview-panel");
const upcomingToggleBtn = document.getElementById("upcoming-toggle-btn");
const upcomingListEl = document.getElementById("upcoming-list");
const upcomingSourceEl = document.getElementById("upcoming-source");
const scorersTableBody = document.getElementById("scorers-table-body");
const scorersSourceEl = document.getElementById("scorers-source");
const overallLeaderboardEl = document.getElementById("overall-leaderboard");
const overallLeaderboardStatusEl = document.getElementById("overall-leaderboard-status");

const authPanel = document.getElementById("auth-panel");
const loginForm = document.getElementById("login-form");
const authLoginFields = document.getElementById("auth-login-fields");
const loginEmailInput = document.getElementById("login-email-input");
const loginPasswordInput = document.getElementById("login-password-input");
const loginBtn = document.getElementById("login-btn");
const logoutInlineBtn = document.getElementById("logout-inline-btn");
const sessionStatus = document.getElementById("session-status");

const leaguePanel = document.getElementById("league-panel");
const createLeagueForm = document.getElementById("create-league-form");
const joinLeagueForm = document.getElementById("join-league-form");
const leagueNameInput = document.getElementById("league-name-input");
const joinCodeInput = document.getElementById("join-code-input");
const leagueSelect = document.getElementById("league-select");
const copyCodeBtn = document.getElementById("copy-code-btn");
const deadlineCountdownEl = document.getElementById("deadline-countdown");

const leaderboardEl = document.getElementById("leaderboard");
const fixturesListEl = document.getElementById("fixtures-list");
const fixtureTemplate = document.getElementById("fixture-template");

overviewFixturesTabBtn.addEventListener("click", () => {
  state.overviewTab = "fixtures";
  renderOverviewTabs();
});
overviewScorersTabBtn.addEventListener("click", () => {
  state.overviewTab = "scorers";
  renderOverviewTabs();
});
overviewGlobalTabBtn.addEventListener("click", () => {
  state.overviewTab = "global";
  renderOverviewTabs();
});
overviewLeaguesTabBtn.addEventListener("click", () => {
  state.overviewTab = "leagues";
  renderOverviewTabs();
});
upcomingToggleBtn.addEventListener("click", () => {
  state.showAllUpcoming = !state.showAllUpcoming;
  renderUpcomingFixtures();
});
if (loginForm) loginForm.addEventListener("submit", onLogIn);
if (logoutInlineBtn) logoutInlineBtn.addEventListener("click", onLogOut);
if (createLeagueForm) createLeagueForm.addEventListener("submit", onCreateLeague);
if (joinLeagueForm) joinLeagueForm.addEventListener("submit", onJoinLeague);
if (leagueSelect) leagueSelect.addEventListener("change", onSwitchLeague);
if (copyCodeBtn) copyCodeBtn.addEventListener("click", onCopyLeagueCode);

setInterval(renderDeadlineCountdown, 1000);

initializeApp();

async function initializeApp() {
  hydrateSquadCache();
  hydrateFixtureCache();
  await syncUpcomingFixturesFromChelsea();
  await maybeRefreshChelseaSquad();
  renderOverviewTabs();
  renderUpcomingFixtures();
  renderTopScorers();
  if (!initSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    state.overallLeaderboardStatus = "Leaderboard unavailable right now.";
    render();
    return;
  }

  await loadOverallLeaderboard();

  const {
    data: { session }
  } = await state.client.auth.getSession();
  state.session = session;

  state.client.auth.onAuthStateChange(async (_event, sessionUpdate) => {
    state.session = sessionUpdate;
    await reloadAuthedData();
    render();
  });

  await reloadAuthedData();
  render();
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
}

async function onLogOut() {
  if (!state.client || !state.session) {
    return;
  }
  const { error } = await state.client.auth.signOut();
  if (error) {
    alert(error.message);
  }
}

async function onRefreshAll() {
  await syncUpcomingFixturesFromChelsea(true);
  await maybeRefreshChelseaSquad(true);
  await loadOverallLeaderboard();
  await reloadAuthedData();
  render();
}

async function loadOverallLeaderboard() {
  if (!state.client) {
    state.overallLeaderboard = [];
    state.overallLeaderboardStatus = "Leaderboard unavailable right now.";
    return;
  }

  const { data, error } = await state.client.rpc("get_overall_leaderboard", { p_limit: 10 });
  if (error) {
    state.overallLeaderboard = [];
    state.overallLeaderboardStatus = "No global points data yet.";
    return;
  }

  state.overallLeaderboard = Array.isArray(data) ? data : [];
  state.overallLeaderboardStatus =
    state.overallLeaderboard.length === 0 ? "No completed match results yet." : "Top players across all leagues.";
}

async function reloadAuthedData() {
  state.leagues = [];
  state.activeLeagueMembers = [];
  state.activeLeagueFixtures = [];
  state.activeLeagueLeaderboard = [];

  if (!state.client || !state.session?.user) {
    state.activeLeagueId = null;
    return;
  }

  await loadLeaguesForUser();
  if (state.leagues.length === 0) {
    await ensureDefaultLeagueForUser();
    await loadLeaguesForUser();
  }
  if (!state.activeLeagueId && state.leagues[0]) {
    state.activeLeagueId = state.leagues[0].id;
  }

  if (!state.leagues.some((league) => league.id === state.activeLeagueId)) {
    state.activeLeagueId = state.leagues[0]?.id || null;
  }

  if (state.activeLeagueId) {
    await loadActiveLeagueData();
    await maybeRefreshChelseaSquad();
  }
}

async function ensureDefaultLeagueForUser() {
  const ownerId = state.session?.user?.id;
  if (!ownerId) {
    return;
  }

  const baseName = `${getCurrentUserDisplayName()}'s League`;
  let createdLeague = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const name = attempt === 0 ? baseName : `${baseName} ${attempt + 1}`;
    const code = createLeagueCode();
    const { data, error } = await state.client
      .from("leagues")
      .insert({ name, code, owner_id: ownerId })
      .select("id, name, code, owner_id, created_at")
      .single();

    if (!error && data) {
      createdLeague = data;
      break;
    }

    if (!isUniqueViolation(error)) {
      console.error("Could not create default league", error?.message || error);
      return;
    }
  }

  if (!createdLeague) {
    return;
  }

  const { error: memberError } = await state.client.from("league_members").insert({
    league_id: createdLeague.id,
    user_id: ownerId,
    display_name: getCurrentUserDisplayName(),
    country_code: getCurrentUserCountryCode(),
    role: "owner"
  });

  if (memberError) {
    console.error("Could not create default membership", memberError.message);
  }
}

async function onCreateLeague(event) {
  event.preventDefault();
  if (!state.session?.user) {
    return;
  }

  const name = leagueNameInput.value.trim();
  if (!name) {
    return;
  }

  const ownerId = state.session.user.id;
  let leagueData = null;
  let leagueError = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createLeagueCode();
    const result = await state.client
      .from("leagues")
      .insert({ name, code, owner_id: ownerId })
      .select("id, name, code, owner_id, created_at")
      .single();

    leagueData = result.data;
    leagueError = result.error;
    if (!leagueError) {
      break;
    }
    if (!isUniqueViolation(leagueError)) {
      alert(leagueError.message);
      return;
    }
  }

  if (leagueError || !leagueData) {
    alert("Could not create a unique league code. Please try again.");
    return;
  }

  const { error: memberError } = await state.client.from("league_members").insert({
    league_id: leagueData.id,
    user_id: ownerId,
    display_name: getCurrentUserDisplayName(),
    country_code: getCurrentUserCountryCode(),
    role: "owner"
  });

  if (memberError) {
    alert(memberError.message);
    return;
  }

  leagueNameInput.value = "";
  state.activeLeagueId = leagueData.id;
  await reloadAuthedData();
  render();
}

async function onJoinLeague(event) {
  event.preventDefault();
  if (!state.session?.user) {
    return;
  }

  const code = joinCodeInput.value.trim().toUpperCase();
  if (!code) {
    return;
  }

  const { error } = await state.client.rpc("join_league_by_code", {
    p_code: code,
    p_display_name: getCurrentUserDisplayName(),
    p_country_code: getCurrentUserCountryCode()
  });

  if (error) {
    alert(error.message);
    return;
  }

  joinCodeInput.value = "";
  await reloadAuthedData();
  const joined = state.leagues.find((league) => league.code === code);
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

async function onSavePrediction(fixture, form) {
  if (!state.session?.user || !canPredictFixture(fixture)) {
    alert("Only the next fixture can be predicted, and it locks 90 minutes before kickoff.");
    return;
  }

  syncChelseaGoalsToScorerSelection(form);
  const chelseaGoals = parseGoals(form.querySelector(".pred-chelsea").value);
  const opponentGoals = parseGoals(form.querySelector(".pred-opponent").value);
  const selectedScorers = form.querySelector(".pred-scorer").value.trim();
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
      submitted_at: new Date().toISOString()
    },
    { onConflict: "fixture_id,user_id" }
  );

  if (error) {
    alert(error.message);
    return;
  }

  cachePredictionScorers(fixture.id, state.session.user.id, selectedScorers);
  await loadActiveLeagueData();
  render();
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
  const { data, error } = await state.client
    .from("league_members")
    .select("league_id, leagues(id, name, code, owner_id, created_at)")
    .eq("user_id", state.session.user.id);

  if (error) {
    alert(error.message);
    return;
  }

  state.leagues = (data || [])
    .map((row) => row.leagues)
    .filter(Boolean)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
        "id, league_id, kickoff, opponent, competition, created_by, created_at, results(chelsea_goals, opponent_goals, first_scorer)"
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
  await loadMyPredictionsForActiveFixtures();
  await loadLeagueLeaderboard();
}

async function syncCompletedResultsFromChelsea() {
  const league = getActiveLeague();
  const member = getCurrentMember();
  if (!league || !member || member.role !== "owner" || !state.session?.user) {
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
            first_scorer: scoreByFixture.get(fixture.id).first_scorer
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
  if (!league || !member || member.role !== "owner") {
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
      "id, league_id, kickoff, opponent, competition, created_by, created_at, results(chelsea_goals, opponent_goals, first_scorer)"
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
    .select("fixture_id, user_id, chelsea_goals, opponent_goals, first_scorer")
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
  renderOverviewTabs();
  renderUpcomingFixtures();
  renderTopScorers();
  renderOverallLeaderboard();

  const isConnected = Boolean(state.client);
  const isAuthed = Boolean(state.session?.user);
  if (authLoginFields) authLoginFields.classList.toggle("hidden", isAuthed);
  if (loginBtn) loginBtn.classList.toggle("hidden", isAuthed);
  if (logoutInlineBtn) logoutInlineBtn.classList.toggle("hidden", !isAuthed);

  if (authPanel) authPanel.classList.toggle("hidden", !isConnected);

  if (!isConnected) {
    if (sessionStatus) sessionStatus.textContent = "Supabase is currently unavailable.";
    return;
  }

  if (sessionStatus) {
    sessionStatus.textContent = isAuthed ? `Signed in as ${state.session.user.email}` : "Not signed in.";
  }
  if (!isAuthed) {
    renderDeadlineCountdown();
    return;
  }

  renderLeagueSelect();
  renderLeaderboard();
  renderFixtures();
  renderDeadlineCountdown();
}

function renderOverallLeaderboard() {
  if (!overallLeaderboardEl || !overallLeaderboardStatusEl) {
    return;
  }

  overallLeaderboardEl.textContent = "";
  if (state.overallLeaderboard.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No players ranked yet.";
    overallLeaderboardEl.appendChild(li);
  } else {
    state.overallLeaderboard.forEach((row, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${formatMemberName(row.display_name || "Player", row.country_code || "GB")}`;
      const pts = document.createElement("span");
      pts.textContent = `${row.points || 0} pts`;
      li.appendChild(pts);
      overallLeaderboardEl.appendChild(li);
    });
  }

  overallLeaderboardStatusEl.textContent = state.overallLeaderboardStatus;
}

function renderOverviewTabs() {
  const showFixtures = state.overviewTab === "fixtures";
  const showScorers = state.overviewTab === "scorers";
  const showGlobal = state.overviewTab === "global";
  const showLeagues = state.overviewTab === "leagues";
  overviewFixturesTabBtn.classList.toggle("active", showFixtures);
  overviewScorersTabBtn.classList.toggle("active", showScorers);
  overviewGlobalTabBtn.classList.toggle("active", showGlobal);
  overviewLeaguesTabBtn.classList.toggle("active", showLeagues);
  overviewFixturesTabBtn.setAttribute("aria-selected", String(showFixtures));
  overviewScorersTabBtn.setAttribute("aria-selected", String(showScorers));
  overviewGlobalTabBtn.setAttribute("aria-selected", String(showGlobal));
  overviewLeaguesTabBtn.setAttribute("aria-selected", String(showLeagues));
  fixturesOverviewPanel.classList.toggle("hidden", !showFixtures);
  scorersOverviewPanel.classList.toggle("hidden", !showScorers);
  globalOverviewPanel.classList.toggle("hidden", !showGlobal);
  leaguePanel.classList.toggle("hidden", !showLeagues || !state.session?.user);
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
  scorersTableBody.textContent = "";
  TOP_SCORERS.forEach((player, index) => {
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
    gpgCell.textContent = (player.goals / player.apps).toFixed(2);
    row.appendChild(gpgCell);

    scorersTableBody.appendChild(row);
  });

  scorersSourceEl.textContent = "Data snapshot: ESPN Chelsea Premier League stats (captured Feb 14, 2026).";
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
    option.textContent = `${league.name} (${league.code})`;
    leagueSelect.appendChild(option);
  });

  if (state.activeLeagueId) {
    leagueSelect.value = state.activeLeagueId;
  }
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
    const prefix = row.role === "owner" ? "(Owner)" : "";
    li.textContent = `${index + 1}. ${formatMemberName(row.display_name, row.country_code)} ${prefix}`.trim();
    const right = document.createElement("span");
    right.textContent = `${row.points} pts`;
    li.appendChild(right);
    leaderboardEl.appendChild(li);
  });
}

function renderFixtures() {
  fixturesListEl.textContent = "";

  const nextFixture = getNextFixtureForPrediction();
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
    const opponentNameEl = predictionForm.querySelector(".pred-opponent-name");
    const opponentScoreValueEl = predictionForm.querySelector(".score-value-opponent");
    const chelseaScoreValueEl = predictionForm.querySelector(".score-value-chelsea");
    const opponentMinusBtn = predictionForm.querySelector(".score-minus-opponent");
    const opponentPlusBtn = predictionForm.querySelector(".score-plus-opponent");
    const chelseaMinusBtn = predictionForm.querySelector(".score-minus-chelsea");
    const chelseaPlusBtn = predictionForm.querySelector(".score-plus-chelsea");
    const scorerSelectedEl = predictionForm.querySelector(".selected-scorer-value");
    const scorerListEl = predictionForm.querySelector(".selected-scorer-list");
    const chelseaChipWrap = predictionForm.querySelector(".player-chip-wrap-chelsea");

    titleEl.textContent = `Chelsea vs ${fixture.opponent}`;
    metaEl.textContent = `${formatKickoff(fixture.kickoff)} | ${fixture.competition}`;
    const isNextFixture = Boolean(nextFixture && fixture.id === nextFixture.id);
    const locked = isFixtureLockedForPrediction(fixture);
    const predictionEnabled = isNextFixture && !locked;
    const hasStarted = Date.now() >= new Date(fixture.kickoff).getTime();

    if (fixture.result) {
      badgeEl.textContent = "Result Saved";
    } else if (hasStarted) {
      badgeEl.textContent = "Closed";
    } else if (locked) {
      badgeEl.textContent = "Locked (90m cutoff)";
    } else {
      badgeEl.textContent = "Open";
    }

    const myPrediction = fixture.predictions.find((row) => row.user_id === state.session.user.id);
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

    if (!predictionEnabled) {
      predictionForm.querySelectorAll("input, button, select").forEach((node) => {
        node.disabled = true;
      });
    }

    predictionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      onSavePrediction(fixture, predictionForm);
    });

    fixturesListEl.appendChild(fragment);
  });
}

function renderScorerButtons(container, players, targetInput, selectedLabelEl, selectedListEl) {
  container.textContent = "";
  players.forEach((player) => {
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
    container.appendChild(button);
  });
}

function appendCustomScorerButton(container, player, targetInput, selectedLabelEl, selectedListEl) {
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
  container.appendChild(button);
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
  return state.teamSquads.Chelsea || CHELSEA_REGISTERED_PLAYERS;
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
    const players = await fetchChelseaSquadFromOfficial();
    if (players.length >= 15) {
      state.teamSquads.Chelsea = players;
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
  const re = /\[([^\]]+)\]\(https:\/\/www\.chelseafc\.com\/en\/teams\/profile\/[^)]+\)/g;
  const names = [];
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
  }
  return names.sort((a, b) => a.localeCompare(b));
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
  const correctScorer =
    Boolean(predictedFirstScorer) &&
    Boolean(resultFirstScorer) &&
    predictedFirstScorer.toLowerCase() === resultFirstScorer.toLowerCase();

  let points = 0;
  if (exact) {
    points += SCORING.exactScore;
  } else if (correctResult) {
    points += SCORING.correctResult;
  }
  if (correctScorer) {
    points += SCORING.correctFirstScorer;
  }

  return { points, exact, correctResult, correctScorer };
}

function getOutcome(chelsea, opponent) {
  if (chelsea > opponent) return "W";
  if (chelsea < opponent) return "L";
  return "D";
}

function getActiveLeague() {
  return state.leagues.find((league) => league.id === state.activeLeagueId) || null;
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
    const fetchedAt = parsed.fetchedAt && typeof parsed.fetchedAt === "object" ? parsed.fetchedAt : {};
    Object.entries(squads).forEach(([teamName, players]) => {
      if (!Array.isArray(players) || players.length === 0) {
        return;
      }
      state.teamSquads[teamName] = players.filter((name) => typeof name === "string");
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
        fetchedAt: state.teamSquadFetchedAt
      })
    );
  } catch {
    // Ignore localStorage write failures.
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
