-- Forum v2: threaded comments + votes with cached counters.
-- Keeps forum reads authenticated-only and preserves existing posting rate limits.

begin;

-- 1) Threads: add activity + cached counts + created_by alias.
alter table if exists public.forum_threads
  add column if not exists created_by uuid references auth.users(id) on delete cascade;

update public.forum_threads
set created_by = user_id
where created_by is null and user_id is not null;

alter table if exists public.forum_threads
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists comment_count integer not null default 0;

update public.forum_threads
set last_activity_at = coalesce(last_activity_at, created_at, now())
where last_activity_at is null;

-- 2) Standardize replies table to forum_comments.
do $$
begin
  if to_regclass('public.forum_comments') is null and to_regclass('public.forum_replies') is not null then
    execute 'alter table public.forum_replies rename to forum_comments';
  end if;
end
$$;

create table if not exists public.forum_comments (
  id uuid primary key default extensions.gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  author_display_name text not null,
  parent_comment_id uuid null references public.forum_comments(id) on delete cascade,
  upvotes int not null default 0,
  downvotes int not null default 0,
  score int not null default 0,
  reply_count int not null default 0,
  is_deleted boolean not null default false
);

alter table if exists public.forum_comments
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists created_by uuid references auth.users(id) on delete cascade,
  add column if not exists parent_comment_id uuid null references public.forum_comments(id) on delete cascade,
  add column if not exists upvotes int not null default 0,
  add column if not exists downvotes int not null default 0,
  add column if not exists score int not null default 0,
  add column if not exists reply_count int not null default 0,
  add column if not exists is_deleted boolean not null default false,
  add column if not exists author_display_name text;

-- Backfill from legacy columns.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'forum_comments' and column_name = 'user_id'
  ) then
    execute 'update public.forum_comments set created_by = user_id where created_by is null';
  end if;
end
$$;

update public.forum_comments
set author_display_name = coalesce(nullif(trim(author_display_name), ''), 'Player')
where author_display_name is null or trim(author_display_name) = '';

update public.forum_comments
set user_id = created_by
where user_id is null and created_by is not null;

create index if not exists forum_threads_last_activity_idx on public.forum_threads (last_activity_at desc);
create index if not exists forum_threads_created_by_idx on public.forum_threads (created_by);
create index if not exists forum_comments_thread_created_idx on public.forum_comments (thread_id, created_at asc);
create index if not exists forum_comments_parent_created_idx on public.forum_comments (parent_comment_id, created_at asc);
create index if not exists forum_comments_created_by_idx on public.forum_comments (created_by);

-- 3) Votes table.
create table if not exists public.forum_comment_votes (
  id bigserial primary key,
  comment_id uuid not null references public.forum_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists forum_comment_votes_comment_idx on public.forum_comment_votes (comment_id);
create index if not exists forum_comment_votes_user_idx on public.forum_comment_votes (user_id);

-- 4) RLS.
alter table public.forum_threads enable row level security;
alter table public.forum_comments enable row level security;
alter table public.forum_comment_votes enable row level security;

-- Threads policies.
drop policy if exists forum_threads_select on public.forum_threads;
create policy forum_threads_select
on public.forum_threads
for select
to authenticated
using (true);

drop policy if exists forum_threads_insert on public.forum_threads;
create policy forum_threads_insert
on public.forum_threads
for insert
to authenticated
with check (
  auth.uid() = coalesce(created_by, user_id)
  and length(trim(coalesce(title, ''))) between 3 and 120
  and length(trim(coalesce(body, ''))) between 1 and 2000
);

drop policy if exists forum_threads_update on public.forum_threads;
create policy forum_threads_update
on public.forum_threads
for update
to authenticated
using (
  auth.uid() = coalesce(created_by, user_id)
  or public.is_configured_admin()
)
with check (
  auth.uid() = coalesce(created_by, user_id)
  or public.is_configured_admin()
);

drop policy if exists forum_threads_delete on public.forum_threads;
create policy forum_threads_delete
on public.forum_threads
for delete
to authenticated
using (
  auth.uid() = coalesce(created_by, user_id)
  or public.is_configured_admin()
);

-- Comments policies.
drop policy if exists forum_replies_select on public.forum_comments;
drop policy if exists forum_comments_select on public.forum_comments;
create policy forum_comments_select
on public.forum_comments
for select
to authenticated
using (true);

drop policy if exists forum_replies_insert on public.forum_comments;
drop policy if exists forum_comments_insert on public.forum_comments;
create policy forum_comments_insert
on public.forum_comments
for insert
to authenticated
with check (
  auth.uid() = created_by
  and length(trim(coalesce(body, ''))) between 1 and 1500
);

drop policy if exists forum_comments_update on public.forum_comments;
create policy forum_comments_update
on public.forum_comments
for update
to authenticated
using (
  auth.uid() = created_by
  or public.is_configured_admin()
)
with check (
  auth.uid() = created_by
  or public.is_configured_admin()
);

drop policy if exists forum_comments_delete on public.forum_comments;

-- Votes policies.
drop policy if exists forum_comment_votes_select on public.forum_comment_votes;
create policy forum_comment_votes_select
on public.forum_comment_votes
for select
to authenticated
using (true);

drop policy if exists forum_comment_votes_insert on public.forum_comment_votes;
create policy forum_comment_votes_insert
on public.forum_comment_votes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists forum_comment_votes_update on public.forum_comment_votes;
create policy forum_comment_votes_update
on public.forum_comment_votes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists forum_comment_votes_delete on public.forum_comment_votes;
create policy forum_comment_votes_delete
on public.forum_comment_votes
for delete
to authenticated
using (auth.uid() = user_id);

-- 5) Triggers/functions.

drop trigger if exists trg_forum_vote_set_updated_at on public.forum_comment_votes;
drop function if exists public.forum_vote_set_updated_at();
create or replace function public.forum_vote_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_forum_vote_set_updated_at
before update on public.forum_comment_votes
for each row
execute function public.forum_vote_set_updated_at();

drop trigger if exists trg_validate_forum_comment_parent_thread on public.forum_comments;
drop function if exists public.validate_forum_comment_parent_thread();
create or replace function public.validate_forum_comment_parent_thread()
returns trigger
language plpgsql
as $$
declare
  v_parent_thread uuid;
begin
  if new.parent_comment_id is null then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.parent_comment_id is not distinct from new.parent_comment_id and old.thread_id is not distinct from new.thread_id then
    return new;
  end if;

  if new.parent_comment_id = new.id then
    raise exception 'A comment cannot be its own parent';
  end if;

  select c.thread_id
  into v_parent_thread
  from public.forum_comments c
  where c.id = new.parent_comment_id;

  if v_parent_thread is null then
    raise exception 'Parent comment does not exist';
  end if;

  if v_parent_thread <> new.thread_id then
    raise exception 'Parent comment must belong to same thread';
  end if;

  return new;
end;
$$;

create trigger trg_validate_forum_comment_parent_thread
before insert or update of parent_comment_id, thread_id
on public.forum_comments
for each row
execute function public.validate_forum_comment_parent_thread();

drop trigger if exists trg_forum_comments_sync_thread_counts_insert on public.forum_comments;
drop trigger if exists trg_forum_comments_sync_thread_counts_update on public.forum_comments;
drop function if exists public.forum_comments_sync_thread_counts();
create or replace function public.forum_comments_sync_thread_counts()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if not new.is_deleted then
      update public.forum_threads
      set comment_count = greatest(comment_count, 0) + 1,
          last_activity_at = now()
      where id = new.thread_id;

      if new.parent_comment_id is not null then
        update public.forum_comments
        set reply_count = greatest(reply_count, 0) + 1
        where id = new.parent_comment_id;
      end if;
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.is_deleted = false and new.is_deleted = true then
      update public.forum_threads
      set comment_count = greatest(comment_count - 1, 0),
          last_activity_at = now()
      where id = new.thread_id;

      if new.parent_comment_id is not null then
        update public.forum_comments
        set reply_count = greatest(reply_count - 1, 0)
        where id = new.parent_comment_id;
      end if;
    elsif old.is_deleted = true and new.is_deleted = false then
      update public.forum_threads
      set comment_count = greatest(comment_count, 0) + 1,
          last_activity_at = now()
      where id = new.thread_id;

      if new.parent_comment_id is not null then
        update public.forum_comments
        set reply_count = greatest(reply_count, 0) + 1
        where id = new.parent_comment_id;
      end if;
    end if;
    return new;
  end if;

  return null;
end;
$$;

create trigger trg_forum_comments_sync_thread_counts_insert
after insert on public.forum_comments
for each row
execute function public.forum_comments_sync_thread_counts();

create trigger trg_forum_comments_sync_thread_counts_update
after update of is_deleted on public.forum_comments
for each row
execute function public.forum_comments_sync_thread_counts();

drop trigger if exists trg_forum_comment_votes_apply_insert on public.forum_comment_votes;
drop trigger if exists trg_forum_comment_votes_apply_update on public.forum_comment_votes;
drop trigger if exists trg_forum_comment_votes_apply_delete on public.forum_comment_votes;
drop function if exists public.forum_comment_votes_apply_deltas();
create or replace function public.forum_comment_votes_apply_deltas()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_comments
    set upvotes = upvotes + case when new.vote = 1 then 1 else 0 end,
        downvotes = downvotes + case when new.vote = -1 then 1 else 0 end,
        score = score + new.vote
    where id = new.comment_id;
    return new;
  elsif tg_op = 'UPDATE' then
    if old.vote = new.vote then
      return new;
    end if;
    update public.forum_comments
    set upvotes = upvotes
        - case when old.vote = 1 then 1 else 0 end
        + case when new.vote = 1 then 1 else 0 end,
        downvotes = downvotes
        - case when old.vote = -1 then 1 else 0 end
        + case when new.vote = -1 then 1 else 0 end,
        score = score - old.vote + new.vote
    where id = new.comment_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.forum_comments
    set upvotes = upvotes - case when old.vote = 1 then 1 else 0 end,
        downvotes = downvotes - case when old.vote = -1 then 1 else 0 end,
        score = score - old.vote
    where id = old.comment_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger trg_forum_comment_votes_apply_insert
after insert on public.forum_comment_votes
for each row
execute function public.forum_comment_votes_apply_deltas();

create trigger trg_forum_comment_votes_apply_update
after update of vote on public.forum_comment_votes
for each row
execute function public.forum_comment_votes_apply_deltas();

create trigger trg_forum_comment_votes_apply_delete
after delete on public.forum_comment_votes
for each row
execute function public.forum_comment_votes_apply_deltas();

-- Backfill cached counts.
update public.forum_comments c
set reply_count = coalesce(child_counts.count, 0)
from (
  select parent_comment_id, count(*)::int as count
  from public.forum_comments
  where parent_comment_id is not null and is_deleted = false
  group by parent_comment_id
) child_counts
where c.id = child_counts.parent_comment_id;

update public.forum_comments
set reply_count = 0
where id not in (
  select parent_comment_id
  from public.forum_comments
  where parent_comment_id is not null and is_deleted = false
);

update public.forum_threads t
set comment_count = coalesce(thread_counts.count, 0)
from (
  select thread_id, count(*)::int as count
  from public.forum_comments
  where is_deleted = false
  group by thread_id
) thread_counts
where t.id = thread_counts.thread_id;

update public.forum_threads
set comment_count = 0
where id not in (
  select thread_id
  from public.forum_comments
  where is_deleted = false
);

update public.forum_threads t
set last_activity_at = coalesce(last_comment.max_created_at, t.created_at, now())
from (
  select thread_id, max(created_at) as max_created_at
  from public.forum_comments
  where is_deleted = false
  group by thread_id
) last_comment
where t.id = last_comment.thread_id;

-- 6) RPC helpers.

drop function if exists public.vote_on_comment(uuid, integer);
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

  return query
  select c.upvotes, c.downvotes, c.score, v_effective_vote
  from public.forum_comments c
  where c.id = p_comment_id;
end;
$$;

revoke all on function public.vote_on_comment(uuid, integer) from public;
grant execute on function public.vote_on_comment(uuid, integer) to authenticated;

drop function if exists public.fetch_thread_with_comments(uuid);
create or replace function public.fetch_thread_with_comments(p_thread_id uuid)
returns table (
  thread_id uuid,
  thread_title text,
  thread_body text,
  thread_author_display_name text,
  thread_created_at timestamptz,
  thread_comment_count integer,
  thread_last_activity_at timestamptz,
  comment_id uuid,
  parent_comment_id uuid,
  comment_body text,
  comment_is_deleted boolean,
  comment_created_at timestamptz,
  comment_author_display_name text,
  comment_created_by uuid,
  upvotes integer,
  downvotes integer,
  score integer,
  reply_count integer,
  my_vote smallint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id as thread_id,
    t.title as thread_title,
    t.body as thread_body,
    t.author_display_name as thread_author_display_name,
    t.created_at as thread_created_at,
    t.comment_count as thread_comment_count,
    t.last_activity_at as thread_last_activity_at,
    c.id as comment_id,
    c.parent_comment_id,
    c.body as comment_body,
    c.is_deleted as comment_is_deleted,
    c.created_at as comment_created_at,
    c.author_display_name as comment_author_display_name,
    c.created_by as comment_created_by,
    c.upvotes,
    c.downvotes,
    c.score,
    c.reply_count,
    coalesce(v.vote, 0)::smallint as my_vote
  from public.forum_threads t
  left join public.forum_comments c
    on c.thread_id = t.id
  left join public.forum_comment_votes v
    on v.comment_id = c.id
    and v.user_id = auth.uid()
  where t.id = p_thread_id
  order by c.created_at asc;
$$;

revoke all on function public.fetch_thread_with_comments(uuid) from public;
grant execute on function public.fetch_thread_with_comments(uuid) to authenticated;

-- Upgrade posting RPCs to forum_comments.

drop function if exists public.create_forum_reply(uuid, text, text);
drop function if exists public.create_forum_reply(uuid, text, text, uuid);
create or replace function public.create_forum_reply(
  p_thread_id uuid,
  p_body text,
  p_author_display_name text,
  p_parent_comment_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_comment_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if not public.can_create_forum_post('reply') then
    raise exception 'Rate limit exceeded. Please wait before posting another reply.';
  end if;

  insert into public.forum_comments (thread_id, user_id, created_by, author_display_name, body, parent_comment_id)
  values (
    p_thread_id,
    v_user_id,
    v_user_id,
    trim(coalesce(nullif(p_author_display_name, ''), split_part(coalesce(auth.jwt() ->> 'email', 'player'), '@', 1))),
    trim(coalesce(p_body, '')),
    p_parent_comment_id
  )
  returning id into v_comment_id;

  insert into public.forum_post_actions (user_id, action)
  values (v_user_id, 'reply');

  return v_comment_id;
end;
$$;

grant execute on function public.create_forum_reply(uuid, text, text, uuid) to authenticated;

-- Keep create_forum_thread aligned to created_by for policy compatibility.
drop function if exists public.create_forum_thread(text, text, text);
create or replace function public.create_forum_thread(
  p_title text,
  p_body text,
  p_author_display_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_thread_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if not public.can_create_forum_post('thread') then
    raise exception 'Rate limit exceeded. Please wait before creating another thread.';
  end if;

  insert into public.forum_threads (created_by, user_id, author_display_name, title, body, last_activity_at)
  values (
    v_user_id,
    v_user_id,
    trim(coalesce(nullif(p_author_display_name, ''), split_part(coalesce(auth.jwt() ->> 'email', 'player'), '@', 1))),
    trim(coalesce(p_title, '')),
    trim(coalesce(p_body, '')),
    now()
  )
  returning id into v_thread_id;

  insert into public.forum_post_actions (user_id, action)
  values (v_user_id, 'thread');

  return v_thread_id;
end;
$$;

grant execute on function public.create_forum_thread(text, text, text) to authenticated;

-- Grants for authenticated clients.
grant select on public.forum_threads to authenticated;
grant insert, update, delete on public.forum_threads to authenticated;
grant select on public.forum_comments to authenticated;
grant insert, update on public.forum_comments to authenticated;
grant select, insert, update, delete on public.forum_comment_votes to authenticated;

commit;
