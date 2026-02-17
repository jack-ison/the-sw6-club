-- Settlement tracking + forum notifications

begin;

-- Match settlement tracking (automatic on result save)
create table if not exists public.fixture_settlements (
  fixture_id uuid primary key references public.fixtures(id) on delete cascade,
  status text not null default 'settled' check (status in ('settled', 'failed')),
  predictions_count integer not null default 0,
  points_rows_count integer not null default 0,
  result_saved_at timestamptz,
  settled_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fixture_settlements_status_settled_at_idx
  on public.fixture_settlements(status, settled_at desc);

alter table public.fixture_settlements enable row level security;

drop policy if exists fixture_settlements_select on public.fixture_settlements;
create policy fixture_settlements_select
on public.fixture_settlements
for select
to authenticated
using (true);

drop policy if exists fixture_settlements_update_admin on public.fixture_settlements;
create policy fixture_settlements_update_admin
on public.fixture_settlements
for update
to authenticated
using (public.is_configured_admin())
with check (public.is_configured_admin());

revoke all on public.fixture_settlements from public;
grant select on public.fixture_settlements to authenticated;

drop function if exists public.touch_fixture_settlement(uuid);
create or replace function public.touch_fixture_settlement(p_fixture_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_predictions_count integer := 0;
begin
  select count(*)::integer
  into v_predictions_count
  from public.predictions p
  where p.fixture_id = p_fixture_id;

  insert into public.fixture_settlements (
    fixture_id,
    status,
    predictions_count,
    points_rows_count,
    result_saved_at,
    settled_at,
    last_error,
    updated_at
  )
  values (
    p_fixture_id,
    'settled',
    coalesce(v_predictions_count, 0),
    coalesce(v_predictions_count, 0),
    now(),
    now(),
    null,
    now()
  )
  on conflict (fixture_id)
  do update set
    status = 'settled',
    predictions_count = excluded.predictions_count,
    points_rows_count = excluded.points_rows_count,
    result_saved_at = excluded.result_saved_at,
    settled_at = excluded.settled_at,
    last_error = null,
    updated_at = now();
exception
  when others then
    insert into public.fixture_settlements (
      fixture_id,
      status,
      predictions_count,
      points_rows_count,
      result_saved_at,
      settled_at,
      last_error,
      updated_at
    )
    values (
      p_fixture_id,
      'failed',
      coalesce(v_predictions_count, 0),
      0,
      now(),
      now(),
      sqlerrm,
      now()
    )
    on conflict (fixture_id)
    do update set
      status = 'failed',
      predictions_count = excluded.predictions_count,
      points_rows_count = excluded.points_rows_count,
      result_saved_at = excluded.result_saved_at,
      settled_at = excluded.settled_at,
      last_error = excluded.last_error,
      updated_at = now();
end;
$$;

revoke all on function public.touch_fixture_settlement(uuid) from public;
grant execute on function public.touch_fixture_settlement(uuid) to postgres, service_role;

drop function if exists public.auto_settle_fixture_after_result_save();
create or replace function public.auto_settle_fixture_after_result_save()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.touch_fixture_settlement(new.fixture_id);
  return new;
end;
$$;

drop trigger if exists trg_auto_settle_fixture_after_result_save on public.results;
create trigger trg_auto_settle_fixture_after_result_save
after insert or update of chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at
on public.results
for each row
execute function public.auto_settle_fixture_after_result_save();

drop function if exists public.get_fixture_settlement(uuid);
create or replace function public.get_fixture_settlement(p_fixture_id uuid)
returns table (
  fixture_id uuid,
  status text,
  predictions_count integer,
  points_rows_count integer,
  result_saved_at timestamptz,
  settled_at timestamptz,
  updated_at timestamptz,
  last_error text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    fs.fixture_id,
    fs.status,
    fs.predictions_count,
    fs.points_rows_count,
    fs.result_saved_at,
    fs.settled_at,
    fs.updated_at,
    fs.last_error
  from public.fixture_settlements fs
  where fs.fixture_id = p_fixture_id;
$$;

grant execute on function public.get_fixture_settlement(uuid) to authenticated;

-- Forum notifications
create table if not exists public.forum_notifications (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  comment_id uuid references public.forum_comments(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('thread_reply', 'comment_reply')),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists forum_notifications_user_unread_created_idx
  on public.forum_notifications(user_id, is_read, created_at desc);
create index if not exists forum_notifications_thread_idx
  on public.forum_notifications(thread_id, created_at desc);

alter table public.forum_notifications enable row level security;

drop policy if exists forum_notifications_select on public.forum_notifications;
create policy forum_notifications_select
on public.forum_notifications
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists forum_notifications_update on public.forum_notifications;
create policy forum_notifications_update
on public.forum_notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists forum_notifications_delete on public.forum_notifications;
create policy forum_notifications_delete
on public.forum_notifications
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.forum_notifications from public;
grant select, update, delete on public.forum_notifications to authenticated;

drop function if exists public.create_forum_notifications_on_comment();
create or replace function public.create_forum_notifications_on_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_thread_owner uuid;
  v_parent_owner uuid;
begin
  if new.is_deleted then
    return new;
  end if;

  select coalesce(t.created_by, t.user_id)
  into v_thread_owner
  from public.forum_threads t
  where t.id = new.thread_id;

  if new.parent_comment_id is not null then
    select coalesce(c.created_by, c.user_id)
    into v_parent_owner
    from public.forum_comments c
    where c.id = new.parent_comment_id;

    if v_parent_owner is not null and v_parent_owner <> new.created_by then
      insert into public.forum_notifications (user_id, thread_id, comment_id, actor_user_id, kind)
      values (v_parent_owner, new.thread_id, new.id, new.created_by, 'comment_reply');
    end if;
  end if;

  if v_thread_owner is not null
     and v_thread_owner <> new.created_by
     and (v_parent_owner is null or v_thread_owner <> v_parent_owner)
  then
    insert into public.forum_notifications (user_id, thread_id, comment_id, actor_user_id, kind)
    values (v_thread_owner, new.thread_id, new.id, new.created_by, 'thread_reply');
  end if;

  return new;
end;
$$;

drop trigger if exists trg_create_forum_notifications_on_comment on public.forum_comments;
create trigger trg_create_forum_notifications_on_comment
after insert on public.forum_comments
for each row
execute function public.create_forum_notifications_on_comment();

-- optional lightweight vote rate-limit support
create table if not exists public.forum_vote_actions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists forum_vote_actions_user_created_idx
  on public.forum_vote_actions(user_id, created_at desc);

drop function if exists public.can_cast_forum_vote();
create or replace function public.can_cast_forum_vote()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_last_at timestamptz;
begin
  if auth.uid() is null then
    return false;
  end if;

  select created_at into v_last_at
  from public.forum_vote_actions
  where user_id = auth.uid()
  order by created_at desc
  limit 1;

  if v_last_at is null then
    return true;
  end if;

  return now() - v_last_at >= interval '700 milliseconds';
end;
$$;

grant execute on function public.can_cast_forum_vote() to authenticated;

-- replace vote function with rate-limited version
create or replace function public.vote_on_comment(p_comment_id uuid, p_vote integer)
returns table (
  upvotes integer,
  downvotes integer,
  score integer,
  my_vote smallint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_comment_owner uuid;
  v_effective_vote smallint;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_vote not in (-1, 0, 1) then
    raise exception 'Vote must be -1, 0, or 1';
  end if;

  if not public.can_cast_forum_vote() then
    raise exception 'Slow down a touch before voting again.';
  end if;

  select coalesce(c.created_by, c.user_id)
  into v_comment_owner
  from public.forum_comments c
  where c.id = p_comment_id and c.is_deleted = false;

  if v_comment_owner is null then
    raise exception 'Comment not found';
  end if;

  if v_comment_owner = v_user_id then
    raise exception 'You cannot vote on your own comment';
  end if;

  if p_vote = 0 then
    delete from public.forum_comment_votes
    where comment_id = p_comment_id
      and user_id = v_user_id;
    v_effective_vote := 0;
  else
    insert into public.forum_comment_votes (comment_id, user_id, vote)
    values (p_comment_id, v_user_id, p_vote::smallint)
    on conflict (comment_id, user_id)
    do update set vote = excluded.vote, updated_at = now();
    v_effective_vote := p_vote::smallint;
  end if;

  insert into public.forum_vote_actions(user_id) values (v_user_id);

  return query
  select c.upvotes, c.downvotes, c.score, v_effective_vote
  from public.forum_comments c
  where c.id = p_comment_id;
end;
$$;

revoke all on function public.vote_on_comment(uuid, integer) from public;
grant execute on function public.vote_on_comment(uuid, integer) to authenticated;

-- Notification RPCs

drop function if exists public.get_unread_forum_notification_count();
create or replace function public.get_unread_forum_notification_count()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.forum_notifications n
  where n.user_id = auth.uid()
    and n.is_read = false;
$$;

grant execute on function public.get_unread_forum_notification_count() to authenticated;

drop function if exists public.mark_forum_notifications_read(uuid);
create or replace function public.mark_forum_notifications_read(p_thread_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.forum_notifications n
  set is_read = true,
      read_at = now()
  where n.user_id = auth.uid()
    and n.is_read = false
    and (p_thread_id is null or n.thread_id = p_thread_id);

  get diagnostics v_count = row_count;
  return coalesce(v_count, 0);
end;
$$;

grant execute on function public.mark_forum_notifications_read(uuid) to authenticated;

commit;
