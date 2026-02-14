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

const state = {
  client: null,
  session: null,
  leagues: [],
  activeLeagueId: null,
  activeLeagueMembers: [],
  activeLeagueFixtures: [],
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

const authPanel = document.getElementById("auth-panel");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signupNameInput = document.getElementById("signup-name-input");
const signupEmailInput = document.getElementById("signup-email-input");
const signupPasswordInput = document.getElementById("signup-password-input");
const loginEmailInput = document.getElementById("login-email-input");
const loginPasswordInput = document.getElementById("login-password-input");
const sessionStatus = document.getElementById("session-status");
const refreshBtn = document.getElementById("refresh-btn");
const logoutBtn = document.getElementById("logout-btn");

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
signupForm.addEventListener("submit", onSignUp);
loginForm.addEventListener("submit", onLogIn);
refreshBtn.addEventListener("click", onRefreshAll);
logoutBtn.addEventListener("click", onLogOut);
createLeagueForm.addEventListener("submit", onCreateLeague);
joinLeagueForm.addEventListener("submit", onJoinLeague);
leagueSelect.addEventListener("change", onSwitchLeague);
copyCodeBtn.addEventListener("click", onCopyLeagueCode);

setInterval(renderDeadlineCountdown, 1000);

initializeApp();

async function initializeApp() {
  hydrateFixtureCache();
  await syncUpcomingFixturesFromChelsea();
  renderOverviewTabs();
  renderUpcomingFixtures();
  renderTopScorers();
  if (!initSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    render();
    return;
  }

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

async function onSignUp(event) {
  event.preventDefault();
  if (!state.client) {
    alert("Supabase is unavailable right now.");
    return;
  }

  const displayName = signupNameInput.value.trim();
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;
  if (!displayName || !email || !password) {
    return;
  }

  const { error } = await state.client.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Sign-up successful. Confirm email if your Supabase project requires it.");
  signupForm.reset();
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
  await reloadAuthedData();
  render();
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
  const code = createLeagueCode();

  const { data: leagueData, error: leagueError } = await state.client
    .from("leagues")
    .insert({ name, code, owner_id: ownerId })
    .select("id, name, code, owner_id, created_at")
    .single();

  if (leagueError) {
    alert(leagueError.message);
    return;
  }

  const { error: memberError } = await state.client.from("league_members").insert({
    league_id: leagueData.id,
    user_id: ownerId,
    display_name: getCurrentUserDisplayName(),
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
    p_display_name: getCurrentUserDisplayName()
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
      .select("user_id, display_name, role")
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

  const isConnected = Boolean(state.client);
  const isAuthed = Boolean(state.session?.user);

  authPanel.classList.toggle("hidden", !isConnected);
  leaguePanel.classList.toggle("hidden", !isConnected || !isAuthed);

  if (!isConnected) {
    sessionStatus.textContent = "Supabase is currently unavailable.";
    return;
  }

  sessionStatus.textContent = isAuthed ? `Signed in as ${state.session.user.email}` : "Not signed in.";
  if (!isAuthed) {
    renderDeadlineCountdown();
    return;
  }

  renderLeagueSelect();
  renderLeaderboard();
  renderFixtures();
  renderDeadlineCountdown();
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
    .map((member) => ({ name: member.display_name, role: member.role, ...summarizeMemberScore(member.user_id) }))
    .sort((a, b) => b.points - a.points || b.exact - a.exact || b.correctResult - a.correctResult);

  rows.forEach((row, index) => {
    const li = document.createElement("li");
    const prefix = row.role === "owner" ? "(Owner)" : "";
    li.textContent = `${index + 1}. ${row.name} ${prefix}`.trim();
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
    if (myPrediction) {
      predictionForm.querySelector(".pred-chelsea").value = myPrediction.chelsea_goals;
      predictionForm.querySelector(".pred-opponent").value = myPrediction.opponent_goals;
      predictionForm.querySelector(".pred-scorer").value = myPrediction.first_scorer;
    }

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
    if (!prediction) {
      li.textContent = `${member.display_name}: no prediction`;
    } else {
      const pointsText = fixture.result ? ` | ${scorePrediction(prediction, fixture.result).points} pts` : "";
      li.textContent = `${member.display_name}: ${prediction.chelsea_goals}-${prediction.opponent_goals}, scorer ${prediction.first_scorer}${pointsText}`;
    }
    listEl.appendChild(li);
  });
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

function createLeagueCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CFC";
  for (let i = 0; i < 3; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
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
