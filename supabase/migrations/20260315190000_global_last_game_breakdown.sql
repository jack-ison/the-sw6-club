create or replace function public.get_global_last_game_breakdown()
returns table (
  user_id uuid,
  did_submit boolean,
  opponent text,
  kickoff timestamptz,
  predicted_chelsea_goals integer,
  predicted_opponent_goals integer,
  predicted_first_scorer text,
  actual_chelsea_goals integer,
  actual_opponent_goals integer,
  actual_first_scorer text,
  exact_score_points integer,
  result_points integer,
  chelsea_goals_points integer,
  opponent_goals_points integer,
  goalscorer_points integer,
  first_scorer_points integer,
  perfect_bonus_points integer,
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
      gf.kickoff,
      gf.opponent,
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
      kickoff,
      opponent,
      match_key,
      chelsea_goals,
      opponent_goals,
      first_scorer,
      chelsea_scorers,
      saved_at
    from result_candidates
    where row_num = 1
  ),
  latest_completed as (
    select *
    from canonical_results
    order by kickoff desc nulls last, coalesce(saved_at, kickoff) desc
    limit 1
  ),
  registered_users as (
    select u.id as user_id
    from auth.users u
    where coalesce(u.email, '') <> ''
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
      row_number() over (
        partition by p.user_id
        order by coalesce(p.submitted_at, gf.created_at, gf.kickoff) desc, gf.created_at desc nulls last, gf.id desc
      ) as row_num
    from global_fixtures gf
    join latest_completed lc
      on lc.match_key = concat_ws('::', gf.kickoff_date::text, gf.opponent_key, gf.competition_key)
    join public.predictions p on p.fixture_id = gf.id
  ),
  latest_prediction as (
    select
      user_id,
      chelsea_goals,
      opponent_goals,
      first_scorer,
      predicted_scorers,
      submitted_at
    from prediction_candidates
    where row_num = 1
  ),
  joined as (
    select
      ru.user_id,
      lp.user_id is not null as did_submit,
      lc.opponent,
      lc.kickoff,
      lp.chelsea_goals as predicted_chelsea_goals,
      lp.opponent_goals as predicted_opponent_goals,
      lp.first_scorer as predicted_first_scorer,
      lc.chelsea_goals as actual_chelsea_goals,
      lc.opponent_goals as actual_opponent_goals,
      lc.first_scorer as actual_first_scorer,
      case
        when lp.user_id is not null and lp.chelsea_goals = lc.chelsea_goals and lp.opponent_goals = lc.opponent_goals then 5
        else 0
      end as exact_score_points,
      case
        when lp.user_id is not null
          and not (lp.chelsea_goals = lc.chelsea_goals and lp.opponent_goals = lc.opponent_goals)
          and (case when lp.chelsea_goals > lp.opponent_goals then 'W' when lp.chelsea_goals < lp.opponent_goals then 'L' else 'D' end)
            = (case when lc.chelsea_goals > lc.opponent_goals then 'W' when lc.chelsea_goals < lc.opponent_goals then 'L' else 'D' end)
        then 2
        else 0
      end as result_points,
      case when lp.user_id is not null and lp.chelsea_goals = lc.chelsea_goals then 1 else 0 end as chelsea_goals_points,
      case when lp.user_id is not null and lp.opponent_goals = lc.opponent_goals then 1 else 0 end as opponent_goals_points,
      case
        when lp.user_id is not null then public.count_matching_scorers(lp.predicted_scorers, lc.chelsea_scorers)
        else 0
      end as goalscorer_points,
      case
        when lp.user_id is not null
          and lc.chelsea_goals > 0
          and lower(trim(coalesce(lp.first_scorer, ''))) = lower(trim(coalesce(lc.first_scorer, '')))
          and lower(trim(coalesce(lp.first_scorer, ''))) not in ('', 'none', 'unknown')
          and lower(trim(coalesce(lc.first_scorer, ''))) not in ('', 'none', 'unknown')
        then 2
        else 0
      end as first_scorer_points
    from registered_users ru
    cross join latest_completed lc
    left join latest_prediction lp on lp.user_id = ru.user_id
  )
  select
    j.user_id,
    j.did_submit,
    j.opponent,
    j.kickoff,
    j.predicted_chelsea_goals,
    j.predicted_opponent_goals,
    j.predicted_first_scorer,
    j.actual_chelsea_goals,
    j.actual_opponent_goals,
    j.actual_first_scorer,
    j.exact_score_points,
    j.result_points,
    j.chelsea_goals_points,
    j.opponent_goals_points,
    j.goalscorer_points,
    j.first_scorer_points,
    case
      when j.did_submit
        and j.exact_score_points = 5
        and j.first_scorer_points = 2
        and j.actual_chelsea_goals > 0
      then 1
      else 0
    end as perfect_bonus_points,
    (
      j.exact_score_points
      + j.result_points
      + j.chelsea_goals_points
      + j.opponent_goals_points
      + j.goalscorer_points
      + j.first_scorer_points
      + case
          when j.did_submit
            and j.exact_score_points = 5
            and j.first_scorer_points = 2
            and j.actual_chelsea_goals > 0
          then 1
          else 0
        end
    )::integer as points
  from joined j
  where auth.uid() is not null
  order by points desc, user_id asc;
$$;

revoke execute on function public.get_global_last_game_breakdown() from public;
grant execute on function public.get_global_last_game_breakdown() to authenticated;
