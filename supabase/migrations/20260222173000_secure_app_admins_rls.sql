-- Security hardening: lock down public.app_admins
-- This table is used by SECURITY DEFINER functions (e.g. is_configured_admin)
-- and should not be directly readable/writable by client roles.

alter table if exists public.app_admins enable row level security;

-- Optional hardening: remove broad grants and keep access via SECURITY DEFINER functions.
revoke all on table public.app_admins from public;
revoke all on table public.app_admins from anon;
revoke all on table public.app_admins from authenticated;

drop policy if exists app_admins_no_client_select on public.app_admins;
create policy app_admins_no_client_select
on public.app_admins
for select
to authenticated
using (false);

drop policy if exists app_admins_no_client_insert on public.app_admins;
create policy app_admins_no_client_insert
on public.app_admins
for insert
to authenticated
with check (false);

drop policy if exists app_admins_no_client_update on public.app_admins;
create policy app_admins_no_client_update
on public.app_admins
for update
to authenticated
using (false)
with check (false);

drop policy if exists app_admins_no_client_delete on public.app_admins;
create policy app_admins_no_client_delete
on public.app_admins
for delete
to authenticated
using (false);
