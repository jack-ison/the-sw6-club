-- Fix leaderboard inflation:
-- - Score only Global League fixtures
-- - Deduplicate duplicate fixtures/results by canonical match key
-- - Deduplicate user predictions per match key (latest submission wins)

create or replace function public.get_overall_leaderboard(p_limit integer default 10)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  country_code text,
  points integer
)
language sql
stable
security definer
set search_path = public
as $$
  with global_league as (
    select l.id
    from public.leagues l
    where lower(trim(l.name)) = lower('Global League')
    order by l.created_at asc nulls last, l.id asc
    limit 1
  ),
  global_fixtures as (
    select
      f.id,
      f.kickoff,
      f.opponent,
      f.competition,
      f.created_at,
      timezone('UTC', f.kickoff)::date as kickoff_date,
      regexp_replace(lower(trim(coalesce(f.opponent, ''))), '[^a-z0-9]+', '', 'g') as opponent_key,
      regexp_replace(lower(trim(coalesce(f.competition, ''))), '[^a-z0-9]+', '', 'g') as competition_key
    from public.fixtures f
    join global_league gl on gl.id = f.league_id
  ),
  result_candidates as (
    select
      gf.id as fixture_id,
      concat_ws('::', gf.kickoff_date::text, gf.opponent_key, gf.competition_key) as match_key,
      r.chelsea_goals,
      r.opponent_goals,
      r.first_scorer,
      r.chelsea_scorers,
      r.saved_at,
      row_number() over (
        partition by concat_ws('::', gf.kickoff_date::text, gf.opponent_key, gf.competition_key)
        order by coalesce(r.saved_at, gf.created_at, gf.kickoff) desc, gf.created_at desc nulls last, gf.id desc
      ) as row_num
    from global_fixtures gf
    join public.results r on r.fixture_id = gf.id
  ),
  canonical_results as (
    select
      fixture_id,
      match_key,
      chelsea_goals,
      opponent_goals,
      first_scorer,
      chelsea_scorers,
      saved_at
    from result_candidates
    where row_num = 1
  ),
  prediction_candidates as (
    select
      p.user_id,
      p.chelsea_goals,
      p.opponent_goals,
      p.first_scorer,
      p.predicted_scorers,
      p.submitted_at,
      gf.id as fixture_id,
      concat_ws('::', gf.kickoff_date::text, gf.opponent_key, gf.competition_key) as match_key,
      row_number() over (
        partition by p.user_id, concat_ws('::', gf.kickoff_date::text, gf.opponent_key, gf.competition_key)
        order by coalesce(p.submitted_at, gf.created_at, gf.kickoff) desc, gf.created_at desc nulls last, gf.id desc
      ) as row_num
    from global_fixtures gf
    join public.predictions p on p.fixture_id = gf.id
  ),
  canonical_predictions as (
    select
      user_id,
      chelsea_goals,
      opponent_goals,
      first_scorer,
      predicted_scorers,
      submitted_at,
      fixture_id,
      match_key
    from prediction_candidates
    where row_num = 1
  ),
  scored as (
    select
      cp.user_id,
      sum(
        (case
          when cp.chelsea_goals = cr.chelsea_goals
               and cp.opponent_goals = cr.opponent_goals then 5
          when (
            case
              when cp.chelsea_goals > cp.opponent_goals then 'W'
              when cp.chelsea_goals < cp.opponent_goals then 'L'
              else 'D'
            end
          ) = (
            case
              when cr.chelsea_goals > cr.opponent_goals then 'W'
              when cr.chelsea_goals < cr.opponent_goals then 'L'
              else 'D'
            end
          ) then 2
          else 0
        end)
        +
        (case when cp.chelsea_goals = cr.chelsea_goals then 1 else 0 end)
        +
        (case when cp.opponent_goals = cr.opponent_goals then 1 else 0 end)
        +
        public.count_matching_scorers(cp.predicted_scorers, cr.chelsea_scorers)
        +
        (case
          when cr.chelsea_goals > 0
               and lower(trim(cp.first_scorer)) = lower(trim(cr.first_scorer))
               and lower(trim(cp.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(cr.first_scorer)) not in ('', 'none', 'unknown')
          then 2
          else 0
        end)
        +
        (case
          when cp.chelsea_goals = cr.chelsea_goals
               and cp.opponent_goals = cr.opponent_goals
               and cr.chelsea_goals > 0
               and lower(trim(cp.first_scorer)) = lower(trim(cr.first_scorer))
               and lower(trim(cp.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(cr.first_scorer)) not in ('', 'none', 'unknown')
          then 1
          else 0
        end)
      )::integer as points
    from canonical_predictions cp
    join canonical_results cr on cr.match_key = cp.match_key
    group by cp.user_id
  ),
  member_meta as (
    select distinct on (m.user_id)
      m.user_id,
      m.display_name,
      m.avatar_url,
      m.country_code
    from public.league_members m
    order by m.user_id, m.joined_at desc
  ),
  registered_users as (
    select
      u.id as user_id,
      split_part(coalesce(u.email, 'player'), '@', 1) as email_name
    from auth.users u
    where coalesce(u.email, '') <> ''
  )
  select
    ru.user_id,
    coalesce(nullif(trim(mm.display_name), ''), nullif(trim(ru.email_name), ''), 'Player') as display_name,
    mm.avatar_url,
    coalesce(mm.country_code, 'GB') as country_code,
    coalesce(s.points, 0)::integer as points
  from registered_users ru
  left join scored s on s.user_id = ru.user_id
  left join member_meta mm on mm.user_id = ru.user_id
  order by coalesce(s.points, 0) desc, display_name asc
  limit greatest(coalesce(p_limit, 10), 1);
$$;

grant execute on function public.get_overall_leaderboard(integer) to anon, authenticated;
