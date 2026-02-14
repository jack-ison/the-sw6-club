const SUPABASE_URL = "https://kderojinorznwtfkizxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";
const FIXTURE_CACHE_KEY = "cfc-upcoming-fixtures-cache-v1";
const FIXTURE_CACHE_VERSION = 3;
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
const OPPONENT_REGISTERED_PLAYERS = {
  Arsenal: ["David Raya", "Ben White", "William Saliba", "Gabriel", "Declan Rice", "Martin Odegaard", "Bukayo Saka", "Kai Havertz", "Gabriel Martinelli", "Leandro Trossard"],
  "Aston Villa": ["Emiliano Martinez", "Matty Cash", "Pau Torres", "Ezri Konsa", "Douglas Luiz", "John McGinn", "Youri Tielemans", "Leon Bailey", "Ollie Watkins", "Moussa Diaby"],
  Bournemouth: ["Neto", "Adam Smith", "Marcos Senesi", "Illia Zabarnyi", "Lewis Cook", "Ryan Christie", "Marcus Tavernier", "Justin Kluivert", "Antoine Semenyo", "Dominic Solanke"],
  Brighton: ["Bart Verbruggen", "Lewis Dunk", "Jan Paul van Hecke", "Pervis Estupinan", "Pascal Gross", "Billy Gilmour", "Kaoru Mitoma", "Joao Pedro", "Danny Welbeck", "Evan Ferguson"],
  "Brighton & Hove Albion": ["Bart Verbruggen", "Lewis Dunk", "Jan Paul van Hecke", "Pervis Estupinan", "Pascal Gross", "Billy Gilmour", "Kaoru Mitoma", "Joao Pedro", "Danny Welbeck", "Evan Ferguson"],
  Burnley: ["James Trafford", "Dara O'Shea", "Jordan Beyer", "Vitinho", "Josh Cullen", "Sander Berge", "Lyle Foster", "Zeki Amdouni", "Wilson Odobert", "Johann Berg Gudmundsson"],
  Everton: ["Jordan Pickford", "James Tarkowski", "Jarrad Branthwaite", "Vitalii Mykolenko", "Amadou Onana", "Idrissa Gueye", "Abdoulaye Doucoure", "Dwight McNeil", "Jack Harrison", "Dominic Calvert-Lewin"],
  Leeds: ["Illan Meslier", "Pascal Struijk", "Joe Rodon", "Junior Firpo", "Ethan Ampadu", "Glen Kamara", "Crysencio Summerville", "Dan James", "Wilfried Gnonto", "Georginio Rutter"],
  "Leeds United": ["Illan Meslier", "Pascal Struijk", "Joe Rodon", "Junior Firpo", "Ethan Ampadu", "Glen Kamara", "Crysencio Summerville", "Dan James", "Wilfried Gnonto", "Georginio Rutter"],
  "Manchester City": ["Ederson", "Kyle Walker", "Ruben Dias", "Josko Gvardiol", "Rodri", "Kevin De Bruyne", "Bernardo Silva", "Phil Foden", "Jeremy Doku", "Erling Haaland"],
  "Manchester United": ["Andre Onana", "Diogo Dalot", "Lisandro Martinez", "Raphael Varane", "Luke Shaw", "Casemiro", "Bruno Fernandes", "Kobbie Mainoo", "Marcus Rashford", "Rasmus Hojlund"],
  Newcastle: ["Nick Pope", "Kieran Trippier", "Fabian Schar", "Sven Botman", "Dan Burn", "Bruno Guimaraes", "Joelinton", "Sean Longstaff", "Anthony Gordon", "Alexander Isak"],
  "Newcastle United": ["Nick Pope", "Kieran Trippier", "Fabian Schar", "Sven Botman", "Dan Burn", "Bruno Guimaraes", "Joelinton", "Sean Longstaff", "Anthony Gordon", "Alexander Isak"],
  Sunderland: ["Anthony Patterson", "Luke O'Nien", "Daniel Ballard", "Dennis Cirkin", "Dan Neil", "Jobe Bellingham", "Pierre Ekwah", "Patrick Roberts", "Jack Clarke", "Ross Stewart"],
  Tottenham: ["Guglielmo Vicario", "Pedro Porro", "Cristian Romero", "Micky van de Ven", "Destiny Udogie", "Yves Bissouma", "James Maddison", "Pape Matar Sarr", "Dejan Kulusevski", "Heung-min Son"],
  "Tottenham Hotspur": ["Guglielmo Vicario", "Pedro Porro", "Cristian Romero", "Micky van de Ven", "Destiny Udogie", "Yves Bissouma", "James Maddison", "Pape Matar Sarr", "Dejan Kulusevski", "Heung-min Son"]
};

const state = {
  client: null,
  session: null,
  leagues: [],
  activeLeagueId: null,
  activeLeagueMembers: [],
  activeLeagueFixtures: [],
  overallLeaderboard: [],
  overallLeaderboardStatus: "Loading overall leaderboard...",
  showAllUpcoming: false,
  overviewTab: "fixtures",
  upcomingFixtures: [...FALLBACK_FIXTURES],
  upcomingSourceText: "Using bundled SW6 fixture fallback list."
};

const overviewFixturesTabBtn = document.getElementById("overview-fixtures-tab");
const overviewScorersTabBtn = document.getElementById("overview-scorers-tab");
const fixturesOverviewPanel = document.getElementById("fixtures-overview-panel");
const scorersOverviewPanel = document.getElementById("scorers-overview-panel");
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
  hydrateFixtureCache();
  await syncUpcomingFixturesFromChelsea();
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

  const chelseaGoals = parseGoals(form.querySelector(".pred-chelsea").value);
  const opponentGoals = parseGoals(form.querySelector(".pred-opponent").value);
  const firstScorer = form.querySelector(".pred-scorer").value.trim();
  if (chelseaGoals === null || opponentGoals === null || !firstScorer) {
    return;
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
        "id, league_id, kickoff, opponent, competition, created_by, created_at, predictions(user_id, chelsea_goals, opponent_goals, first_scorer), results(chelsea_goals, opponent_goals, first_scorer)"
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
    predictions: fixture.predictions || [],
    result: (fixture.results && fixture.results[0]) || null
  }));

  await ensureUpcomingFixturesImported();
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
      "id, league_id, kickoff, opponent, competition, created_by, created_at, predictions(user_id, chelsea_goals, opponent_goals, first_scorer), results(chelsea_goals, opponent_goals, first_scorer)"
    )
    .eq("league_id", league.id)
    .order("kickoff", { ascending: true });

  state.activeLeagueFixtures = (data || []).map((fixture) => ({
    ...fixture,
    predictions: fixture.predictions || [],
    result: (fixture.results && fixture.results[0]) || null
  }));
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
  if (leaguePanel) leaguePanel.classList.toggle("hidden", !isConnected || !isAuthed);

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
  overviewFixturesTabBtn.classList.toggle("active", showFixtures);
  overviewScorersTabBtn.classList.toggle("active", !showFixtures);
  overviewFixturesTabBtn.setAttribute("aria-selected", String(showFixtures));
  overviewScorersTabBtn.setAttribute("aria-selected", String(!showFixtures));
  fixturesOverviewPanel.classList.toggle("hidden", !showFixtures);
  scorersOverviewPanel.classList.toggle("hidden", showFixtures);
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
  if (!state.activeLeagueId || state.activeLeagueMembers.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No members yet.";
    leaderboardEl.appendChild(li);
    return;
  }

  const rows = state.activeLeagueMembers
    .map((member) => ({
      name: member.display_name,
      countryCode: member.country_code,
      role: member.role,
      ...summarizeMemberScore(member.user_id)
    }))
    .sort((a, b) => b.points - a.points || b.exact - a.exact || b.correctResult - a.correctResult);

  rows.forEach((row, index) => {
    const li = document.createElement("li");
    const prefix = row.role === "owner" ? "(Owner)" : "";
    li.textContent = `${index + 1}. ${formatMemberName(row.name, row.countryCode)} ${prefix}`.trim();
    const right = document.createElement("span");
    right.textContent = `${row.points} pts`;
    li.appendChild(right);
    leaderboardEl.appendChild(li);
  });
}

function renderFixtures() {
  fixturesListEl.textContent = "";

  const member = getCurrentMember();
  const isOwner = member?.role === "owner";
  const nextFixture = getNextFixtureForPrediction();

  if (state.activeLeagueFixtures.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No fixtures available.";
    fixturesListEl.appendChild(li);
    return;
  }

  state.activeLeagueFixtures.forEach((fixture) => {
    const fragment = fixtureTemplate.content.cloneNode(true);
    const titleEl = fragment.querySelector(".fixture-title");
    const badgeEl = fragment.querySelector(".status-badge");
    const metaEl = fragment.querySelector(".fixture-meta");
    const predictionForm = fragment.querySelector(".prediction-form");
    const resultForm = fragment.querySelector(".result-form");
    const listEl = fragment.querySelector(".prediction-list");
    const predChelseaInput = predictionForm.querySelector(".pred-chelsea");
    const predOpponentInput = predictionForm.querySelector(".pred-opponent");
    const predScorerInput = predictionForm.querySelector(".pred-scorer");
    const opponentNameEl = predictionForm.querySelector(".pred-opponent-name");
    const opponentScoreValueEl = predictionForm.querySelector(".score-value-opponent");
    const chelseaScoreValueEl = predictionForm.querySelector(".score-value-chelsea");
    const opponentMinusBtn = predictionForm.querySelector(".score-minus-opponent");
    const opponentPlusBtn = predictionForm.querySelector(".score-plus-opponent");
    const chelseaMinusBtn = predictionForm.querySelector(".score-minus-chelsea");
    const chelseaPlusBtn = predictionForm.querySelector(".score-plus-chelsea");
    const scorerSelectedEl = predictionForm.querySelector(".selected-scorer-value");
    const opponentGroupTitleEl = predictionForm.querySelector(".scorer-group-title-opponent");
    const opponentChipWrap = predictionForm.querySelector(".player-chip-wrap-opponent");
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
    } else if (!isNextFixture) {
      badgeEl.textContent = "Future";
    } else if (locked) {
      badgeEl.textContent = "Locked (90m cutoff)";
    } else {
      badgeEl.textContent = "Open";
    }

    const myPrediction = fixture.predictions.find((row) => row.user_id === state.session.user.id);
    predChelseaInput.value = "0";
    predOpponentInput.value = "0";
    predScorerInput.value = "";
    if (myPrediction) {
      predChelseaInput.value = String(myPrediction.chelsea_goals);
      predOpponentInput.value = String(myPrediction.opponent_goals);
      predScorerInput.value = myPrediction.first_scorer;
    }

    opponentNameEl.textContent = fixture.opponent;
    opponentGroupTitleEl.textContent = `${fixture.opponent} Players`;
    const playerPools = getFixturePlayerPools(fixture.opponent);
    renderScorerButtons(
      opponentChipWrap,
      playerPools.opponentPlayers,
      predScorerInput,
      scorerSelectedEl
    );
    renderScorerButtons(
      chelseaChipWrap,
      playerPools.chelseaPlayers,
      predScorerInput,
      scorerSelectedEl
    );
    if (predScorerInput.value && !playerPools.allPlayers.includes(predScorerInput.value)) {
      appendCustomScorerButton(chelseaChipWrap, predScorerInput.value, predScorerInput, scorerSelectedEl);
    }
    refreshScorerState(predictionForm, predScorerInput.value, scorerSelectedEl);

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
    chelseaMinusBtn.addEventListener("click", () => stepScore(predChelseaInput, -1));
    chelseaPlusBtn.addEventListener("click", () => stepScore(predChelseaInput, 1));

    if (fixture.result) {
      resultForm.querySelector(".result-chelsea").value = fixture.result.chelsea_goals;
      resultForm.querySelector(".result-opponent").value = fixture.result.opponent_goals;
      resultForm.querySelector(".result-scorer").value = fixture.result.first_scorer;
    }

    if (!predictionEnabled) {
      predictionForm.querySelectorAll("input, button").forEach((node) => {
        node.disabled = true;
      });
    }

    if (!isOwner) {
      resultForm.querySelectorAll("input, button").forEach((node) => {
        node.disabled = true;
      });
    }

    predictionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      onSavePrediction(fixture, predictionForm);
    });

    resultForm.addEventListener("submit", (event) => {
      event.preventDefault();
      onSaveResult(fixture, resultForm);
    });

    renderPredictionList(fixture, listEl);
    fixturesListEl.appendChild(fragment);
  });
}

function renderPredictionList(fixture, listEl) {
  listEl.textContent = "";
  state.activeLeagueMembers.forEach((member) => {
    const prediction = fixture.predictions.find((row) => row.user_id === member.user_id);
    const li = document.createElement("li");
    const memberLabel = formatMemberName(member.display_name, member.country_code);
    if (!prediction) {
      li.textContent = `${memberLabel}: no prediction`;
    } else {
      const pointsText = fixture.result ? ` | ${scorePrediction(prediction, fixture.result).points} pts` : "";
      li.textContent = `${memberLabel}: ${prediction.chelsea_goals}-${prediction.opponent_goals}, scorer ${prediction.first_scorer}${pointsText}`;
    }
    listEl.appendChild(li);
  });
}

function renderScorerButtons(container, players, targetInput, selectedLabelEl) {
  container.textContent = "";
  players.forEach((player) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "player-chip";
    button.dataset.player = player;
    button.textContent = player;
    button.addEventListener("click", () => {
      targetInput.value = player;
      refreshScorerState(container.closest(".prediction-form"), player, selectedLabelEl);
    });
    container.appendChild(button);
  });
}

function appendCustomScorerButton(container, player, targetInput, selectedLabelEl) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "player-chip";
  button.dataset.player = player;
  button.textContent = player;
  button.addEventListener("click", () => {
    targetInput.value = player;
    refreshScorerState(container.closest(".prediction-form"), player, selectedLabelEl);
  });
  container.appendChild(button);
}

function refreshScorerState(formEl, selectedPlayer, selectedLabelEl) {
  formEl.querySelectorAll(".player-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.player === selectedPlayer);
  });
  selectedLabelEl.textContent = selectedPlayer || "None";
}

function getFixturePlayerPools(opponent) {
  const opponentPlayers = OPPONENT_REGISTERED_PLAYERS[opponent] || [];
  const chelseaPlayers = CHELSEA_REGISTERED_PLAYERS;
  return {
    opponentPlayers,
    chelseaPlayers,
    allPlayers: [...opponentPlayers, ...chelseaPlayers]
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
  const correctScorer =
    prediction.first_scorer.trim().toLowerCase() === result.first_scorer.trim().toLowerCase();

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

function getUpcomingFixturesForDisplay() {
  const now = Date.now();
  return state.upcomingFixtures.filter((fixture) => {
    const kickoff = new Date(`${fixture.date}T00:00:00`).getTime();
    return Number.isFinite(kickoff) && kickoff >= now - 24 * 60 * 60 * 1000;
  });
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
    if (timeIndex < 1) {
      continue;
    }
    const kickoffUk = block[timeIndex];

    const team1 = findNearestTeam(block, timeIndex, -1);
    const team2 = findNearestTeam(block, timeIndex, 1);
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
    fixtures.push({
      date,
      opponent,
      competition,
      kickoffUk
    });
  }

  fixtures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return fixtures;
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
