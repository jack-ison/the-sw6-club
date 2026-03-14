drop policy if exists fixtures_select_member on public.fixtures;
create policy fixtures_select_member
on public.fixtures
for select
using (
  public.is_league_member(league_id)
  or public.is_configured_admin()
  or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('jackwilliamison@gmail.com')
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
        or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('jackwilliamison@gmail.com')
      )
  )
);
