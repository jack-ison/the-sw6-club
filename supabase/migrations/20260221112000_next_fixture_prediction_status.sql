create or replace function public.get_next_fixture_prediction_status(p_league_id uuid)
returns table (
  user_id uuid
)
language sql
stable
security definer
set search_path = public
as $$
  with next_fixture as (
    select f.id
    from public.fixtures f
    left join public.results r on r.fixture_id = f.id
    where f.league_id = p_league_id
      and r.fixture_id is null
      and f.kickoff > now()
    order by f.kickoff asc
    limit 1
  )
  select distinct p.user_id
  from public.predictions p
  join next_fixture nf on nf.id = p.fixture_id
  where public.is_league_member(p_league_id);
$$;

grant execute on function public.get_next_fixture_prediction_status(uuid) to authenticated;
