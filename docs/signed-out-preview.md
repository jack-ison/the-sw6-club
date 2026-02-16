# Signed-Out Preview Discovery Notes

## What the app currently uses (from `app.js`)

### Auth detection
- Supabase client is initialized from runtime config.
- Auth now uses `supabase.auth.getUser()` via `getAuthUser()` to set:
  - `state.user`
  - `state.isAuthed`
  - `state.session` compatibility shape
- The app subscribes to `supabase.auth.onAuthStateChange(...)` and re-renders on changes.

### Next fixture source
- Predict view resolves the next fixture from two sources:
  1. DB-backed league fixtures in `fixtures` + `results` via `loadActiveLeagueData()`.
  2. Fallback schedule from the Chelsea fixtures sync cache (`state.upcomingFixtures`) when league data is unavailable.
- Relevant DB reads:
  - `fixtures`: `id, league_id, kickoff, opponent, competition, created_by, created_at`
  - joined `results`: `chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at`
- Helper used by Predict: `getNextFixtureForPrediction()` with fallback `getFallbackNextFixture()`.

### Global leaderboard source
- Global top list is fetched through RPC:
  - `get_overall_leaderboard(p_limit => 10)`
- UI consumes rows shaped like:
  - `display_name`
  - `country_code`
  - `avatar_url`
  - `points`

### Tabs / view rendering
- Top-level views are controlled by `state.topView` and `renderNavigation()`.
- Signed-out users are forced to `predict` top view (`renderNow()` guard).
- `renderAuthGatedSections()` controls auth-gated view blocks.

## DB tables and prediction model assumptions used by this change

From direct `supabase.from(...)` usage in `app.js`:
- `fixtures` (per-league fixture schedule)
- `predictions` (user predictions)
  - used fields: `fixture_id, user_id, chelsea_goals, opponent_goals, first_scorer, predicted_scorers, submitted_at`
- `results` (owner/admin entered final result)
  - used fields: `fixture_id, chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_by, saved_at`
- `league_members`, `leagues`
- `forum_threads`, `user_fixture_cards`, `card_templates`

Assumptions made:
- Signed-out draft mode must never write to `predictions` table.
- Signed-out preview can read public leaderboard if RPC allows anon; otherwise UI should degrade gracefully.
- Drafts are fixture-scoped local data and safe to keep client-side only.
