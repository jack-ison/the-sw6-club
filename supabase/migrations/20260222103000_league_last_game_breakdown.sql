create or replace function public.get_league_last_game_breakdown(p_league_id uuid)
returns table (
  user_id uuid,
  did_submit boolean,
  opponent text,
  kickoff timestamptz,
  predicted_chelsea_goals integer,
  predicted_opponent_goals integer,
  actual_chelsea_goals integer,
  actual_opponent_goals integer,
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
  with latest_completed as (
    select f.id, f.opponent, f.kickoff, r.chelsea_goals, r.opponent_goals, r.first_scorer, r.chelsea_scorers
    from public.fixtures f
    join public.results r on r.fixture_id = f.id
    where f.league_id = p_league_id
    order by f.kickoff desc
    limit 1
  ),
  members as (
    select m.user_id
    from public.league_members m
    where m.league_id = p_league_id
  ),
  joined as (
    select
      m.user_id,
      p.fixture_id is not null as did_submit,
      lc.opponent,
      lc.kickoff,
      p.chelsea_goals as predicted_chelsea_goals,
      p.opponent_goals as predicted_opponent_goals,
      lc.chelsea_goals as actual_chelsea_goals,
      lc.opponent_goals as actual_opponent_goals,
      case
        when p.fixture_id is not null and p.chelsea_goals = lc.chelsea_goals and p.opponent_goals = lc.opponent_goals then 5
        else 0
      end as exact_score_points,
      case
        when p.fixture_id is not null
          and not (p.chelsea_goals = lc.chelsea_goals and p.opponent_goals = lc.opponent_goals)
          and (case when p.chelsea_goals > p.opponent_goals then 'W' when p.chelsea_goals < p.opponent_goals then 'L' else 'D' end)
            = (case when lc.chelsea_goals > lc.opponent_goals then 'W' when lc.chelsea_goals < lc.opponent_goals then 'L' else 'D' end)
        then 2
        else 0
      end as result_points,
      case when p.fixture_id is not null and p.chelsea_goals = lc.chelsea_goals then 1 else 0 end as chelsea_goals_points,
      case when p.fixture_id is not null and p.opponent_goals = lc.opponent_goals then 1 else 0 end as opponent_goals_points,
      case
        when p.fixture_id is not null then public.count_matching_scorers(p.predicted_scorers, lc.chelsea_scorers)
        else 0
      end as goalscorer_points,
      case
        when p.fixture_id is not null
          and lc.chelsea_goals > 0
          and lower(trim(coalesce(p.first_scorer, ''))) = lower(trim(coalesce(lc.first_scorer, '')))
          and lower(trim(coalesce(p.first_scorer, ''))) not in ('', 'none', 'unknown')
          and lower(trim(coalesce(lc.first_scorer, ''))) not in ('', 'none', 'unknown')
        then 2
        else 0
      end as first_scorer_points
    from members m
    cross join latest_completed lc
    left join public.predictions p
      on p.fixture_id = lc.id
      and p.user_id = m.user_id
  )
  select
    j.user_id,
    j.did_submit,
    j.opponent,
    j.kickoff,
    j.predicted_chelsea_goals,
    j.predicted_opponent_goals,
    j.actual_chelsea_goals,
    j.actual_opponent_goals,
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
  where public.is_league_member(p_league_id)
  order by points desc, user_id asc;
$$;

grant execute on function public.get_league_last_game_breakdown(uuid) to authenticated;
