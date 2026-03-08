-- Admin helper: list past fixtures (with result fields) across all leagues.
-- This lets admin edit historical scores without depending on the active league view.

drop function if exists public.admin_list_result_fixtures();
create or replace function public.admin_list_result_fixtures()
returns table (
  id uuid,
  league_id uuid,
  kickoff timestamptz,
  opponent text,
  competition text,
  created_at timestamptz,
  chelsea_goals integer,
  opponent_goals integer,
  first_scorer text,
  chelsea_scorers text,
  saved_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_configured_admin() then
    raise exception 'Forbidden';
  end if;

  return query
  select
    f.id,
    f.league_id,
    f.kickoff,
    f.opponent,
    f.competition,
    f.created_at,
    r.chelsea_goals,
    r.opponent_goals,
    r.first_scorer,
    r.chelsea_scorers,
    r.saved_at
  from public.fixtures f
  left join public.results r on r.fixture_id = f.id
  where f.kickoff <= now()
  order by f.kickoff desc;
end;
$$;

grant execute on function public.admin_list_result_fixtures() to authenticated;
