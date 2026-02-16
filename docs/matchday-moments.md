# Matchday Moments Backend v1

## Step 0: Existing schema usage discovery (from `app.js`)

### Tables referenced by client

- `leagues`
  - Read/write columns used: `id`, `name`, `code`, `owner_id`, `created_at`, `is_public`
- `league_members`
  - Read/write columns used: `league_id`, `user_id`, `display_name`, `country_code`, `avatar_url`, `role`, `joined_at`
- `fixtures`
  - Read/write columns used: `id`, `league_id`, `kickoff`, `opponent`, `competition`, `created_by`, `created_at`
- `predictions`
  - Read/write columns used: `fixture_id`, `user_id`, `chelsea_goals`, `opponent_goals`, `first_scorer`, `predicted_scorers`, `submitted_at`
- `results`
  - Read/write columns used: `fixture_id`, `chelsea_goals`, `opponent_goals`, `first_scorer`, `chelsea_scorers`, `saved_by`, `saved_at`
- `forum_threads`
  - Read/write columns used: `id`, `user_id`, `author_display_name`, `title`, `body`, `created_at`
- `forum_replies`
  - Read/write columns used: `id`, `thread_id`, `user_id`, `author_display_name`, `body`, `created_at`
- Storage bucket: `avatars`

### RPC/functions used by client

- `get_overall_leaderboard`, `get_league_leaderboard`
- `get_registered_user_count`, `log_site_visit`, `get_site_visitor_count`
- `is_configured_admin`, `admin_list_leagues`, `admin_delete_league`
- `create_league`, `ensure_global_league_membership`, `join_league_by_code`, `join_private_league_by_name`

### Key assumptions used for Matchday Moments v1

- `public.fixtures.id` is `uuid` in the existing schema (not bigint).
- Fixture completion is represented by a row in `public.results` for the same `fixture_id`.
- Final score comes from `results.chelsea_goals` and `results.opponent_goals`.
- Goalscorer selections are stored as comma-delimited text:
  - user picks: `predictions.predicted_scorers`
  - actual Chelsea scorers: `results.chelsea_scorers`
  - first scorer: `predictions.first_scorer` vs `results.first_scorer`
- League standings are computed through RPC (`get_league_leaderboard`) and based on per-fixture scoring rules already implemented in SQL.

## What this migration adds

- `card_templates`
- `fixture_cards`
- `user_fixture_cards`
- `card_award_runs`
- `ensure_fixture_cards(p_fixture_id uuid)`
- `award_cards_for_fixture(p_fixture_id uuid)`

## Awarding behavior (v1)

Deterministic awards are computed from `predictions` + `results` for one fixture.

Templates:

- `correct-result`: predicted W/D/L matches final
- `correct-scorer`: at least one correctly predicted Chelsea scorer
- `exact-scoreline`: exact Chelsea/opponent goals
- `first-chelsea-scorer`: predicted first Chelsea scorer
- `top-5-percent`: top 5% by fixture points (minimum 1 user)
- `league-winner`: top points in the fixture league (ties included)
- `clean-sheet`: predicted opponent 0 and actual opponent 0
- `comeback-win`: **skipped in v1** (no trailing-state timeline data in current schema)

### Points model used by `award_cards_for_fixture`

Same v1 points model as existing leaderboard SQL:

- exact score: +5
- correct result (non-exact): +2
- correct Chelsea goals: +1
- correct opponent goals: +1
- each matching Chelsea scorer: +1 each (via `count_matching_scorers`)
- correct first Chelsea scorer: +2
- perfect bonus (exact + first scorer): +1

## Idempotency and serial numbers

- Awards insert into `user_fixture_cards` with `ON CONFLICT DO NOTHING`.
- PK (`user_id`, `fixture_card_id`) prevents duplicate mints.
- Unique index (`fixture_card_id`, `serial_number`) enforces serial uniqueness per fixture card.
- Serial assignment is deterministic by template + fixture:
  - order by `points DESC, submitted_at ASC, user_id ASC`

## Security model

- RLS enabled on all new tables.
- `user_fixture_cards` readable only by owner (`user_id = auth.uid()`).
- No client write policies for new tables.
- Execute revoked for `ensure_fixture_cards` and `award_cards_for_fixture` from `PUBLIC/anon/authenticated`.
- Execute granted only to trusted roles: `postgres`, `service_role`.

## Supabase Jobs / automation hook

### Manual per fixture run

In Supabase Dashboard:

1. Go to **Database -> Jobs**.
2. Create a new SQL job:
   - `select public.award_cards_for_fixture('<fixture_uuid>'::uuid);`

### Batch run for newly finished fixtures (example)

Use a SQL job on an interval:

```sql
with pending as (
  select r.fixture_id
  from public.results r
  left join public.card_award_runs ar
    on ar.fixture_id = r.fixture_id
   and ar.success = true
   and ar.version = 'v1'
  where ar.fixture_id is null
)
select public.award_cards_for_fixture(p.fixture_id)
from pending p;
```

## SQL acceptance checks

### 1) Idempotency check (run twice, counts stable)

```sql
select public.award_cards_for_fixture('<fixture_uuid>'::uuid);
select count(*) as c1 from public.user_fixture_cards;

select public.award_cards_for_fixture('<fixture_uuid>'::uuid);
select count(*) as c2 from public.user_fixture_cards;
-- expect c2 = c1
```

### 2) Client execution blocked

As authenticated (non-service-role), this should fail:

```sql
select public.award_cards_for_fixture('<fixture_uuid>'::uuid);
-- expect permission denied for function
```

### 3) RLS: user sees only own cards

As user A:

```sql
select distinct user_id from public.user_fixture_cards;
-- expect only auth.uid() rows visible
```

### 4) Serial uniqueness check

```sql
select fixture_card_id, serial_number, count(*)
from public.user_fixture_cards
group by 1,2
having count(*) > 1;
-- expect zero rows
```
