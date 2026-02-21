-- Allow league members to auto-import synced fixtures so prediction is never blocked by missing fixture rows.

drop policy if exists fixtures_insert_owner on public.fixtures;
drop policy if exists fixtures_insert_member on public.fixtures;

create policy fixtures_insert_member
on public.fixtures
for insert
to authenticated
with check (
  public.is_league_member(league_id)
  and created_by = auth.uid()
);
