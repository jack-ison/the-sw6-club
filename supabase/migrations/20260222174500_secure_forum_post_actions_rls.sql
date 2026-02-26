-- Security hardening: lock down public.forum_post_actions
-- This table is only for internal rate-limit bookkeeping.

alter table if exists public.forum_post_actions enable row level security;

revoke all on table public.forum_post_actions from public;
revoke all on table public.forum_post_actions from anon;
revoke all on table public.forum_post_actions from authenticated;

drop policy if exists forum_post_actions_no_client_select on public.forum_post_actions;
create policy forum_post_actions_no_client_select
on public.forum_post_actions
for select
to authenticated
using (false);

drop policy if exists forum_post_actions_no_client_insert on public.forum_post_actions;
create policy forum_post_actions_no_client_insert
on public.forum_post_actions
for insert
to authenticated
with check (false);

drop policy if exists forum_post_actions_no_client_update on public.forum_post_actions;
create policy forum_post_actions_no_client_update
on public.forum_post_actions
for update
to authenticated
using (false)
with check (false);

drop policy if exists forum_post_actions_no_client_delete on public.forum_post_actions;
create policy forum_post_actions_no_client_delete
on public.forum_post_actions
for delete
to authenticated
using (false);
