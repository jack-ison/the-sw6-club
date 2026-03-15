-- Support both known admin email spellings and unblock admin result tooling.

insert into public.app_admins (user_id)
select u.id
from auth.users u
where lower(coalesce(u.email, '')) in (
  lower('jackwilliamison@gmail.com'),
  lower('jackwilliamson@gmail.com')
)
on conflict (user_id) do nothing;

create or replace function public.is_bootstrap_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    lower('jackwilliamison@gmail.com'),
    lower('jackwilliamson@gmail.com')
  );
$$;

grant execute on function public.is_bootstrap_admin_email() to authenticated;

drop policy if exists fixtures_select_member on public.fixtures;
create policy fixtures_select_member
on public.fixtures
for select
using (
  public.is_league_member(league_id)
  or public.is_configured_admin()
  or public.is_bootstrap_admin_email()
);

drop policy if exists results_select_member on public.results;
create policy results_select_member
on public.results
for select
using (
  exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and (
        public.is_league_member(f.league_id)
        or public.is_configured_admin()
        or public.is_bootstrap_admin_email()
      )
  )
);

drop policy if exists results_modify_owner on public.results;
create policy results_modify_owner
on public.results
for all
using (
  exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and (
        public.is_league_owner(f.league_id)
        or public.is_configured_admin()
        or public.is_bootstrap_admin_email()
      )
  )
)
with check (
  exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and (
        public.is_league_owner(f.league_id)
        or public.is_configured_admin()
        or public.is_bootstrap_admin_email()
      )
  )
);

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
    or public.is_bootstrap_admin_email()
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
