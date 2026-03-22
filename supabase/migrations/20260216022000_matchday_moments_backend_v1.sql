-- Matchday Moments backend v1
-- NOTE: Existing schema uses public.fixtures.id as UUID, so fixture references here use UUID for compatibility.

create table if not exists public.card_templates (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  rarity text not null check (rarity in ('common', 'rare', 'legendary')),
  active boolean not null default true
);

insert into public.card_templates (slug, name, description, rarity, active)
values
  ('correct-result', 'Correct Result', 'Predicted the correct match outcome (win/draw/loss).', 'common', true),
  ('correct-scorer', 'Correct Scorer', 'Picked at least one Chelsea goalscorer correctly.', 'common', true),
  ('exact-scoreline', 'Exact Scoreline', 'Predicted the exact final scoreline.', 'legendary', true),
  ('first-chelsea-scorer', 'First Chelsea Scorer', 'Predicted the first Chelsea scorer correctly.', 'rare', true),
  ('top-5-percent', 'Top 5 Percent', 'Finished in the top 5% by fixture points.', 'rare', true),
  ('league-winner', 'League Winner', 'Top fixture points in the fixture league.', 'rare', true),
  ('comeback-win', 'Comeback Win', 'Chelsea won after trailing during the match.', 'rare', true),
  ('clean-sheet', 'Clean Sheet', 'Predicted and hit a Chelsea clean sheet.', 'common', true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  rarity = excluded.rarity,
  active = excluded.active;

create table if not exists public.fixture_cards (
  id bigserial primary key,
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  template_id bigint not null references public.card_templates(id) on delete cascade,
  title text not null,
  subtitle text not null,
  created_at timestamptz not null default now(),
  unique (fixture_id, template_id)
);

create table if not exists public.user_fixture_cards (
  user_id uuid not null references auth.users(id) on delete cascade,
  fixture_card_id bigint not null references public.fixture_cards(id) on delete cascade,
  serial_number int not null,
  earned_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb,
  primary key (user_id, fixture_card_id)
);

create unique index if not exists user_fixture_cards_fixture_card_serial_uidx
  on public.user_fixture_cards (fixture_card_id, serial_number);

create table if not exists public.card_award_runs (
  id bigserial primary key,
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  success boolean,
  error text,
  inserted_count int not null default 0,
  version text not null default 'v1',
  meta jsonb not null default '{}'::jsonb
);

create index if not exists fixture_cards_fixture_id_idx on public.fixture_cards (fixture_id);
create index if not exists fixture_cards_template_id_idx on public.fixture_cards (template_id);
create index if not exists user_fixture_cards_user_id_idx on public.user_fixture_cards (user_id);
create index if not exists user_fixture_cards_fixture_card_id_idx on public.user_fixture_cards (fixture_card_id);
create index if not exists card_award_runs_fixture_id_idx on public.card_award_runs (fixture_id);

alter table public.card_templates enable row level security;
alter table public.fixture_cards enable row level security;
alter table public.user_fixture_cards enable row level security;
alter table public.card_award_runs enable row level security;

drop policy if exists card_templates_select_authenticated on public.card_templates;
create policy card_templates_select_authenticated
on public.card_templates
for select
to authenticated
using (true);

drop policy if exists fixture_cards_select_authenticated on public.fixture_cards;
create policy fixture_cards_select_authenticated
on public.fixture_cards
for select
to authenticated
using (true);

drop policy if exists user_fixture_cards_select_own on public.user_fixture_cards;
create policy user_fixture_cards_select_own
on public.user_fixture_cards
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists card_award_runs_select_admin on public.card_award_runs;
create policy card_award_runs_select_admin
on public.card_award_runs
for select
to authenticated
using (public.is_configured_admin());

revoke all on public.card_templates from anon;
revoke all on public.fixture_cards from anon;
revoke all on public.user_fixture_cards from anon;
revoke all on public.card_award_runs from anon;

revoke insert, update, delete on public.card_templates from authenticated;
revoke insert, update, delete on public.fixture_cards from authenticated;
revoke insert, update, delete on public.user_fixture_cards from authenticated;
revoke insert, update, delete on public.card_award_runs from authenticated;

grant select on public.card_templates to authenticated;
grant select on public.fixture_cards to authenticated;
grant select on public.user_fixture_cards to authenticated;
grant select on public.card_award_runs to authenticated;

drop function if exists public.ensure_fixture_cards(uuid);
create or replace function public.ensure_fixture_cards(p_fixture_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_opponent text;
  v_kickoff timestamptz;
  v_date_label text;
begin
  select f.opponent, f.kickoff
  into v_opponent, v_kickoff
  from public.fixtures f
  where f.id = p_fixture_id;

  if v_kickoff is null then
    raise exception 'Fixture % not found', p_fixture_id;
  end if;

  v_date_label := to_char(v_kickoff at time zone 'UTC', 'YYYY-MM-DD');

  insert into public.fixture_cards (fixture_id, template_id, title, subtitle)
  select
    p_fixture_id,
    t.id,
    format('%s • %s', t.name, v_date_label),
    format('Chelsea vs %s • %s', coalesce(v_opponent, 'Unknown Opponent'), v_date_label)
  from public.card_templates t
  where t.active = true
  on conflict (fixture_id, template_id)
  do update set
    title = excluded.title,
    subtitle = excluded.subtitle;
end;
$$;

drop function if exists public.award_cards_for_fixture(uuid);
create or replace function public.award_cards_for_fixture(p_fixture_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run_id bigint;
  v_inserted_count integer := 0;
  v_template_counts jsonb := '{}'::jsonb;
  v_league_id uuid;
  v_actual_chelsea_goals integer;
  v_actual_opponent_goals integer;
  v_actual_first_scorer text;
  v_actual_chelsea_scorers text;
begin
  insert into public.card_award_runs (fixture_id, version, meta)
  values (
    p_fixture_id,
    'v1',
    jsonb_build_object(
      'note', 'v1 skips comeback-win if match timeline/trailing-state data is unavailable',
      'requested_at', now()
    )
  )
  returning id into v_run_id;

  select
    f.league_id,
    r.chelsea_goals,
    r.opponent_goals,
    r.first_scorer,
    r.chelsea_scorers
  into
    v_league_id,
    v_actual_chelsea_goals,
    v_actual_opponent_goals,
    v_actual_first_scorer,
    v_actual_chelsea_scorers
  from public.fixtures f
  join public.results r
    on r.fixture_id = f.id
  where f.id = p_fixture_id;

  if v_league_id is null then
    raise exception 'Fixture % is not finished or has no saved result', p_fixture_id;
  end if;

  perform public.ensure_fixture_cards(p_fixture_id);

  with scored as (
    select
      p.user_id,
      p.submitted_at,
      p.chelsea_goals,
      p.opponent_goals,
      p.first_scorer,
      p.predicted_scorers,
      (
        case
          when p.chelsea_goals = v_actual_chelsea_goals and p.opponent_goals = v_actual_opponent_goals then 5
          when sign(p.chelsea_goals - p.opponent_goals) = sign(v_actual_chelsea_goals - v_actual_opponent_goals) then 2
          else 0
        end
      )
      + case when p.chelsea_goals = v_actual_chelsea_goals then 1 else 0 end
      + case when p.opponent_goals = v_actual_opponent_goals then 1 else 0 end
      + public.count_matching_scorers(p.predicted_scorers, coalesce(v_actual_chelsea_scorers, ''))
      + case
          when lower(trim(p.first_scorer)) = lower(trim(coalesce(v_actual_first_scorer, '')))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(coalesce(v_actual_first_scorer, ''))) not in ('', 'none', 'unknown')
          then 2
          else 0
        end
      + case
          when p.chelsea_goals = v_actual_chelsea_goals
               and p.opponent_goals = v_actual_opponent_goals
               and lower(trim(p.first_scorer)) = lower(trim(coalesce(v_actual_first_scorer, '')))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(coalesce(v_actual_first_scorer, ''))) not in ('', 'none', 'unknown')
          then 1
          else 0
        end
      as points,
      (p.chelsea_goals = v_actual_chelsea_goals and p.opponent_goals = v_actual_opponent_goals) as is_exact_scoreline,
      (sign(p.chelsea_goals - p.opponent_goals) = sign(v_actual_chelsea_goals - v_actual_opponent_goals)) as is_correct_result,
      (public.count_matching_scorers(p.predicted_scorers, coalesce(v_actual_chelsea_scorers, '')) > 0) as has_correct_scorer,
      (
        lower(trim(p.first_scorer)) = lower(trim(coalesce(v_actual_first_scorer, '')))
        and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
        and lower(trim(coalesce(v_actual_first_scorer, ''))) not in ('', 'none', 'unknown')
      ) as is_first_chelsea_scorer,
      (v_actual_opponent_goals = 0 and p.opponent_goals = 0) as is_clean_sheet
    from public.predictions p
    where p.fixture_id = p_fixture_id
  ),
  ranked as (
    select
      s.*,
      row_number() over (order by s.points desc, s.submitted_at asc, s.user_id asc) as overall_rank,
      count(*) over () as total_predictions,
      max(s.points) over () as max_points
    from scored s
  ),
  top_cutoff as (
    select greatest(1, ceil(coalesce(max(total_predictions), 0) * 0.05)::integer) as top_n
    from ranked
  ),
  eligible_base as (
    select
      r.user_id,
      'correct-result'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'Correct match result',
        'points', r.points,
        'overall_rank', r.overall_rank
      ) as meta
    from ranked r
    where r.is_correct_result

    union all

    select
      r.user_id,
      'correct-scorer'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'At least one correct Chelsea goalscorer',
        'points', r.points,
        'overall_rank', r.overall_rank
      )
    from ranked r
    where r.has_correct_scorer

    union all

    select
      r.user_id,
      'exact-scoreline'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'Exact scoreline',
        'points', r.points,
        'overall_rank', r.overall_rank
      )
    from ranked r
    where r.is_exact_scoreline

    union all

    select
      r.user_id,
      'first-chelsea-scorer'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'Correct first Chelsea scorer',
        'points', r.points,
        'overall_rank', r.overall_rank
      )
    from ranked r
    where r.is_first_chelsea_scorer

    union all

    select
      r.user_id,
      'top-5-percent'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'Top 5% by fixture points',
        'points', r.points,
        'overall_rank', r.overall_rank,
        'top_n', t.top_n
      )
    from ranked r
    cross join top_cutoff t
    where r.overall_rank <= t.top_n

    union all

    select
      r.user_id,
      'league-winner'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'Top fixture points in active league',
        'points', r.points,
        'overall_rank', r.overall_rank,
        'league_id', v_league_id
      )
    from ranked r
    where r.points = (select max(points) from ranked)

    union all

    select
      r.user_id,
      'clean-sheet'::text as slug,
      r.points,
      r.submitted_at,
      r.overall_rank,
      jsonb_build_object(
        'reason', 'Predicted and hit a clean sheet',
        'points', r.points,
        'overall_rank', r.overall_rank
      )
    from ranked r
    where r.is_clean_sheet
  ),
  eligible_ranked as (
    select
      e.user_id,
      e.slug,
      e.points,
      e.submitted_at,
      e.overall_rank,
      e.meta,
      row_number() over (
        partition by e.slug
        order by e.points desc, e.submitted_at asc, e.user_id asc
      ) as serial_number
    from eligible_base e
  ),
  inserted as (
    insert into public.user_fixture_cards (user_id, fixture_card_id, serial_number, meta)
    select
      e.user_id,
      fc.id,
      e.serial_number,
      e.meta || jsonb_build_object('awarded_by', 'award_cards_for_fixture_v1')
    from eligible_ranked e
    join public.card_templates t
      on t.slug = e.slug
     and t.active = true
    join public.fixture_cards fc
      on fc.fixture_id = p_fixture_id
     and fc.template_id = t.id
    on conflict do nothing
    returning fixture_card_id
  ),
  template_counts as (
    select slug, count(*)::integer as cnt
    from eligible_ranked
    group by slug
  )
  select
    coalesce((select count(*) from inserted), 0),
    coalesce((select jsonb_object_agg(slug, cnt) from template_counts), '{}'::jsonb)
  into v_inserted_count, v_template_counts;

  update public.card_award_runs
  set
    finished_at = now(),
    success = true,
    inserted_count = v_inserted_count,
    meta = coalesce(meta, '{}'::jsonb)
      || jsonb_build_object(
        'template_eligible_counts', v_template_counts,
        'skipped_templates', jsonb_build_array('comeback-win'),
        'fixture_league_id', v_league_id,
        'actual_score', format('%s-%s', v_actual_chelsea_goals, v_actual_opponent_goals),
        'actual_first_scorer', v_actual_first_scorer,
        'actual_chelsea_scorers', coalesce(v_actual_chelsea_scorers, '')
      )
  where id = v_run_id;
exception
  when others then
    update public.card_award_runs
    set
      finished_at = now(),
      success = false,
      error = sqlerrm
    where id = v_run_id;
    raise;
end;
$$;

revoke execute on function public.ensure_fixture_cards(uuid) from public;
revoke execute on function public.ensure_fixture_cards(uuid) from anon;
revoke execute on function public.ensure_fixture_cards(uuid) from authenticated;
grant execute on function public.ensure_fixture_cards(uuid) to postgres, service_role;

revoke execute on function public.award_cards_for_fixture(uuid) from public;
revoke execute on function public.award_cards_for_fixture(uuid) from anon;
revoke execute on function public.award_cards_for_fixture(uuid) from authenticated;
grant execute on function public.award_cards_for_fixture(uuid) to postgres, service_role;
