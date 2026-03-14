insert into public.app_admins (user_id)
select u.id
from auth.users u
where lower(coalesce(u.email, '')) = lower('jackwilliamison@gmail.com')
on conflict (user_id) do nothing;

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
  if auth.uid() is null then
    raise exception 'Forbidden';
  end if;

  if not (
    public.is_configured_admin()
    or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('jackwilliamison@gmail.com')
  ) then
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
  order by
    case when r.saved_at is null then 1 else 0 end asc,
    coalesce(r.saved_at, f.kickoff, f.created_at) desc;
end;
$$;

grant execute on function public.admin_list_result_fixtures() to authenticated;
