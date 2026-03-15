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
        or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('jackwilliamison@gmail.com')
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
        or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('jackwilliamison@gmail.com')
      )
  )
);
