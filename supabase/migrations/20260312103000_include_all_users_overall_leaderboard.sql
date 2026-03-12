-- Ensure global leaderboard includes all registered users, even before they score.

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
  with scored as (
    select
      p.user_id,
      sum(
        (case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals then 5
          when (
            case
              when p.chelsea_goals > p.opponent_goals then 'W'
              when p.chelsea_goals < p.opponent_goals then 'L'
              else 'D'
            end
          ) = (
            case
              when r.chelsea_goals > r.opponent_goals then 'W'
              when r.chelsea_goals < r.opponent_goals then 'L'
              else 'D'
            end
          ) then 2
          else 0
        end)
        +
        (case when p.chelsea_goals = r.chelsea_goals then 1 else 0 end)
        +
        (case when p.opponent_goals = r.opponent_goals then 1 else 0 end)
        +
        public.count_matching_scorers(p.predicted_scorers, r.chelsea_scorers)
        +
        (case
          when r.chelsea_goals > 0
               and lower(trim(p.first_scorer)) = lower(trim(r.first_scorer))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(r.first_scorer)) not in ('', 'none', 'unknown')
          then 2
          else 0
        end)
        +
        (case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals
               and r.chelsea_goals > 0
               and lower(trim(p.first_scorer)) = lower(trim(r.first_scorer))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(r.first_scorer)) not in ('', 'none', 'unknown')
          then 1
          else 0
        end)
      )::integer as points
    from public.predictions p
    join public.results r on r.fixture_id = p.fixture_id
    group by p.user_id
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
