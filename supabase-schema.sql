-- Run this in Supabase SQL Editor once per project.

create extension if not exists pgcrypto;

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_public boolean not null default true,
  join_password_hash text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.leagues
  add column if not exists is_public boolean not null default true;

alter table public.leagues
  add column if not exists join_password_hash text;

alter table public.leagues
  drop constraint if exists leagues_private_password_required;

alter table public.leagues
  add constraint leagues_private_password_required
  check (is_public or coalesce(length(join_password_hash), 0) > 0);

create table if not exists public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  country_code text not null default 'GB' check (country_code ~ '^[A-Z]{2}$'),
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

alter table public.league_members
  add column if not exists country_code text not null default 'GB';

alter table public.league_members
  add column if not exists avatar_url text;

alter table public.league_members
  drop constraint if exists league_members_country_code_check;

alter table public.league_members
  add constraint league_members_country_code_check
  check (country_code ~ '^[A-Z]{2}$');

create table if not exists public.fixtures (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  kickoff timestamptz not null,
  opponent text not null,
  competition text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.predictions (
  fixture_id uuid not null references public.fixtures(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chelsea_goals integer not null check (chelsea_goals >= 0),
  opponent_goals integer not null check (opponent_goals >= 0),
  first_scorer text not null,
  predicted_scorers text not null default '',
  submitted_at timestamptz not null default now(),
  primary key (fixture_id, user_id)
);

create table if not exists public.results (
  fixture_id uuid primary key references public.fixtures(id) on delete cascade,
  chelsea_goals integer not null check (chelsea_goals >= 0),
  opponent_goals integer not null check (opponent_goals >= 0),
  first_scorer text not null,
  chelsea_scorers text not null default '',
  saved_by uuid not null references auth.users(id) on delete cascade,
  saved_at timestamptz not null default now()
);

alter table public.predictions
  add column if not exists predicted_scorers text;

update public.predictions
set predicted_scorers = case
  when lower(trim(first_scorer)) in ('', 'none', 'unknown') then ''
  else trim(first_scorer)
end
where predicted_scorers is null or trim(predicted_scorers) = '';

alter table public.predictions
  alter column predicted_scorers set default '';

alter table public.predictions
  alter column predicted_scorers set not null;

alter table public.results
  add column if not exists chelsea_scorers text;

update public.results
set chelsea_scorers = case
  when lower(trim(first_scorer)) in ('', 'none', 'unknown') then ''
  else trim(first_scorer)
end
where chelsea_scorers is null or trim(chelsea_scorers) = '';

alter table public.results
  alter column chelsea_scorers set default '';

alter table public.results
  alter column chelsea_scorers set not null;

create or replace function public.is_league_member(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.league_members m
    where m.league_id = p_league_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_league_owner(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.leagues l
    where l.id = p_league_id
      and l.owner_id = auth.uid()
  );
$$;

drop function if exists public.create_league(text, boolean, text, text, text);
create or replace function public.create_league(
  p_name text,
  p_is_public boolean default true,
  p_join_password text default null,
  p_display_name text default null,
  p_country_code text default 'GB'
)
returns table (
  id uuid,
  name text,
  code text,
  owner_id uuid,
  created_at timestamptz,
  is_public boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_code text;
  v_password_hash text;
  v_attempt integer := 0;
begin
  v_owner_id := auth.uid();
  if v_owner_id is null then
    raise exception 'Not authenticated';
  end if;

  if trim(coalesce(p_name, '')) = '' then
    raise exception 'League name is required';
  end if;

  if not coalesce(p_is_public, true) and length(trim(coalesce(p_join_password, ''))) < 6 then
    raise exception 'Private league password must be at least 6 characters';
  end if;

  v_password_hash := case
    when coalesce(p_is_public, true) then null
    else extensions.crypt(trim(p_join_password), extensions.gen_salt('bf'))
  end;

  loop
    v_attempt := v_attempt + 1;
    v_code := upper(substring(md5(random()::text || clock_timestamp()::text || v_owner_id::text), 1, 8));
    begin
      insert into public.leagues (name, code, owner_id, is_public, join_password_hash)
      values (trim(p_name), v_code, v_owner_id, coalesce(p_is_public, true), v_password_hash)
      returning leagues.id, leagues.name, leagues.code, leagues.owner_id, leagues.created_at, leagues.is_public
      into id, name, code, owner_id, created_at, is_public;
      exit;
    exception
      when unique_violation then
        if v_attempt >= 7 then
          raise;
        end if;
    end;
  end loop;

  insert into public.league_members (league_id, user_id, display_name, country_code, role)
  values (
    id,
    v_owner_id,
    trim(coalesce(nullif(p_display_name, ''), split_part(coalesce(auth.jwt() ->> 'email', 'player'), '@', 1))),
    case
      when upper(trim(coalesce(p_country_code, ''))) ~ '^[A-Z]{2}$' then upper(trim(p_country_code))
      else 'GB'
    end,
    'owner'
  )
  on conflict (league_id, user_id)
  do update set
    display_name = excluded.display_name,
    country_code = excluded.country_code,
    role = 'owner';

  return next;
end;
$$;

grant execute on function public.create_league(text, boolean, text, text, text) to authenticated;

drop function if exists public.join_league_by_code(text, text, text);
create or replace function public.join_league_by_code(
  p_code text,
  p_display_name text,
  p_country_code text default 'GB'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_league_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select l.id into v_league_id
  from public.leagues l
  where upper(l.code) = upper(trim(p_code))
    and l.is_public = true;

  if v_league_id is null then
    raise exception 'Public league code not found';
  end if;

  insert into public.league_members (league_id, user_id, display_name, country_code, role)
  values (
    v_league_id,
    auth.uid(),
    trim(p_display_name),
    case
      when upper(trim(coalesce(p_country_code, ''))) ~ '^[A-Z]{2}$' then upper(trim(p_country_code))
      else 'GB'
    end,
    'member'
  )
  on conflict (league_id, user_id)
  do update set
    display_name = excluded.display_name,
    country_code = excluded.country_code;

  return v_league_id;
end;
$$;

grant execute on function public.join_league_by_code(text, text, text) to authenticated;

drop function if exists public.join_private_league_by_name(text, text, text, text);
create or replace function public.join_private_league_by_name(
  p_name text,
  p_password text,
  p_display_name text,
  p_country_code text default 'GB'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_league_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if trim(coalesce(p_name, '')) = '' then
    raise exception 'League name is required';
  end if;

  if trim(coalesce(p_password, '')) = '' then
    raise exception 'League password is required';
  end if;

  select l.id
  into v_league_id
  from public.leagues l
  where lower(trim(l.name)) = lower(trim(p_name))
    and l.is_public = false
    and l.join_password_hash = extensions.crypt(trim(p_password), l.join_password_hash)
  order by l.created_at desc
  limit 1;

  if v_league_id is null then
    raise exception 'Private league name/password did not match';
  end if;

  insert into public.league_members (league_id, user_id, display_name, country_code, role)
  values (
    v_league_id,
    auth.uid(),
    trim(p_display_name),
    case
      when upper(trim(coalesce(p_country_code, ''))) ~ '^[A-Z]{2}$' then upper(trim(p_country_code))
      else 'GB'
    end,
    'member'
  )
  on conflict (league_id, user_id)
  do update set
    display_name = excluded.display_name,
    country_code = excluded.country_code;

  return v_league_id;
end;
$$;

grant execute on function public.join_private_league_by_name(text, text, text, text) to authenticated;

drop function if exists public.ensure_global_league_membership(text, text);
create or replace function public.ensure_global_league_membership(
  p_display_name text,
  p_country_code text default 'GB'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_league_id uuid;
  v_owner_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select l.id, l.owner_id
  into v_league_id, v_owner_id
  from public.leagues l
  where lower(trim(l.name)) = lower('Global League')
  order by l.created_at asc
  limit 1;

  if v_league_id is null then
    insert into public.leagues (name, code, owner_id, is_public, join_password_hash)
    values ('Global League', upper(substring(md5(random()::text || clock_timestamp()::text || v_user_id::text), 1, 8)), v_user_id, true, null)
    returning id, owner_id into v_league_id, v_owner_id;
  end if;

  insert into public.league_members (league_id, user_id, display_name, country_code, role)
  values (
    v_league_id,
    v_user_id,
    trim(coalesce(nullif(p_display_name, ''), split_part(coalesce(auth.jwt() ->> 'email', 'player'), '@', 1))),
    case
      when upper(trim(coalesce(p_country_code, ''))) ~ '^[A-Z]{2}$' then upper(trim(p_country_code))
      else 'GB'
    end,
    case when v_owner_id = v_user_id then 'owner' else 'member' end
  )
  on conflict (league_id, user_id)
  do update set
    display_name = excluded.display_name,
    country_code = excluded.country_code;

  return v_league_id;
end;
$$;

grant execute on function public.ensure_global_league_membership(text, text) to authenticated;

create or replace function public.can_submit_prediction(p_fixture_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_league_id uuid;
  v_kickoff timestamptz;
  v_next_fixture_id uuid;
begin
  if auth.uid() is null then
    return false;
  end if;

  select f.league_id, f.kickoff
  into v_league_id, v_kickoff
  from public.fixtures f
  where f.id = p_fixture_id;

  if v_league_id is null then
    return false;
  end if;

  if not public.is_league_member(v_league_id) then
    return false;
  end if;

  if now() >= v_kickoff - interval '90 minutes' then
    return false;
  end if;

  select f2.id
  into v_next_fixture_id
  from public.fixtures f2
  left join public.results r2 on r2.fixture_id = f2.id
  where f2.league_id = v_league_id
    and r2.fixture_id is null
    and f2.kickoff > now()
  order by f2.kickoff asc
  limit 1;

  return v_next_fixture_id = p_fixture_id;
end;
$$;

grant execute on function public.can_submit_prediction(uuid) to authenticated;

create or replace function public.count_matching_scorers(p_predicted text, p_actual text)
returns integer
language sql
immutable
set search_path = public
as $$
  with predicted as (
    select lower(trim(token)) as name, count(*)::integer as cnt
    from regexp_split_to_table(coalesce(p_predicted, ''), '\s*,\s*') as token
    where trim(token) <> ''
      and lower(trim(token)) not in ('unknown', 'none')
    group by 1
  ),
  actual as (
    select lower(trim(token)) as name, count(*)::integer as cnt
    from regexp_split_to_table(coalesce(p_actual, ''), '\s*,\s*') as token
    where trim(token) <> ''
      and lower(trim(token)) not in ('unknown', 'none')
    group by 1
  )
  select coalesce(sum(least(p.cnt, a.cnt)), 0)::integer
  from predicted p
  join actual a on a.name = p.name;
$$;

create or replace function public.get_registered_user_count()
returns integer
language sql
stable
security definer
set search_path = public, auth
as $$
  select count(*)::integer
  from auth.users u
  where coalesce(u.email, '') <> '';
$$;

grant execute on function public.get_registered_user_count() to anon, authenticated;

drop function if exists public.get_overall_leaderboard(integer);

create or replace function public.get_overall_leaderboard(p_limit integer default 10)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  country_code text,
  points integer
)
language sql
stable
security definer
set search_path = public
as $$
  with scored as (
    select
      p.user_id,
      sum(
        (case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals then 5
          when (
            case
              when p.chelsea_goals > p.opponent_goals then 'W'
              when p.chelsea_goals < p.opponent_goals then 'L'
              else 'D'
            end
          ) = (
            case
              when r.chelsea_goals > r.opponent_goals then 'W'
              when r.chelsea_goals < r.opponent_goals then 'L'
              else 'D'
            end
          ) then 2
          else 0
        end)
        +
        (case when p.chelsea_goals = r.chelsea_goals then 1 else 0 end)
        +
        (case when p.opponent_goals = r.opponent_goals then 1 else 0 end)
        +
        public.count_matching_scorers(p.predicted_scorers, r.chelsea_scorers)
        +
        (case
          when r.chelsea_goals > 0
               and lower(trim(p.first_scorer)) = lower(trim(r.first_scorer))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(r.first_scorer)) not in ('', 'none', 'unknown')
          then 2
          else 0
        end)
        +
        (case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals
               and r.chelsea_goals > 0
               and lower(trim(p.first_scorer)) = lower(trim(r.first_scorer))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(r.first_scorer)) not in ('', 'none', 'unknown')
          then 1
          else 0
        end)
      )::integer as points
    from public.predictions p
    join public.results r on r.fixture_id = p.fixture_id
    group by p.user_id
  ),
  member_meta as (
    select distinct on (m.user_id)
      m.user_id,
      m.display_name,
      m.avatar_url,
      m.country_code
    from public.league_members m
    order by m.user_id, m.joined_at desc
  )
  select
    s.user_id,
    coalesce(mm.display_name, 'Player') as display_name,
    mm.avatar_url,
    coalesce(mm.country_code, 'GB') as country_code,
    s.points
  from scored s
  left join member_meta mm on mm.user_id = s.user_id
  order by s.points desc, display_name asc
  limit greatest(coalesce(p_limit, 10), 1);
$$;

grant execute on function public.get_overall_leaderboard(integer) to anon, authenticated;

drop function if exists public.get_league_leaderboard(uuid);

create or replace function public.get_league_leaderboard(p_league_id uuid)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  country_code text,
  role text,
  points integer
)
language sql
stable
security definer
set search_path = public
as $$
  with member_rows as (
    select m.user_id, m.display_name, m.avatar_url, m.country_code, m.role
    from public.league_members m
    where m.league_id = p_league_id
  ),
  scored as (
    select
      p.user_id,
      sum(
        (case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals then 5
          when (
            case
              when p.chelsea_goals > p.opponent_goals then 'W'
              when p.chelsea_goals < p.opponent_goals then 'L'
              else 'D'
            end
          ) = (
            case
              when r.chelsea_goals > r.opponent_goals then 'W'
              when r.chelsea_goals < r.opponent_goals then 'L'
              else 'D'
            end
          ) then 2
          else 0
        end)
        +
        (case when p.chelsea_goals = r.chelsea_goals then 1 else 0 end)
        +
        (case when p.opponent_goals = r.opponent_goals then 1 else 0 end)
        +
        public.count_matching_scorers(p.predicted_scorers, r.chelsea_scorers)
        +
        (case
          when r.chelsea_goals > 0
               and lower(trim(p.first_scorer)) = lower(trim(r.first_scorer))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(r.first_scorer)) not in ('', 'none', 'unknown')
          then 2
          else 0
        end)
        +
        (case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals
               and r.chelsea_goals > 0
               and lower(trim(p.first_scorer)) = lower(trim(r.first_scorer))
               and lower(trim(p.first_scorer)) not in ('', 'none', 'unknown')
               and lower(trim(r.first_scorer)) not in ('', 'none', 'unknown')
          then 1
          else 0
        end)
      )::integer as points
    from public.predictions p
    join public.results r on r.fixture_id = p.fixture_id
    join public.fixtures f on f.id = p.fixture_id
    where f.league_id = p_league_id
    group by p.user_id
  )
  select
    mr.user_id,
    mr.display_name,
    mr.avatar_url,
    mr.country_code,
    mr.role,
    coalesce(sc.points, 0)::integer as points
  from member_rows mr
  left join scored sc on sc.user_id = mr.user_id
  order by points desc, mr.display_name asc;
$$;

grant execute on function public.get_league_leaderboard(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read
on storage.objects
for select
using (bucket_id = 'avatars');

drop policy if exists avatars_user_upload on storage.objects;
create policy avatars_user_upload
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists avatars_user_update on storage.objects;
create policy avatars_user_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and owner = auth.uid()
)
with check (
  bucket_id = 'avatars'
  and owner = auth.uid()
);

drop policy if exists avatars_user_delete on storage.objects;
create policy avatars_user_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and owner = auth.uid()
);

alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.fixtures enable row level security;
alter table public.predictions enable row level security;
alter table public.results enable row level security;

drop policy if exists leagues_select_member on public.leagues;
create policy leagues_select_member
on public.leagues
for select
using (
  public.is_league_member(id)
  or owner_id = auth.uid()
);

drop policy if exists leagues_insert_owner on public.leagues;
create policy leagues_insert_owner
on public.leagues
for insert
with check (owner_id = auth.uid());

drop policy if exists leagues_update_owner on public.leagues;
create policy leagues_update_owner
on public.leagues
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists leagues_delete_owner on public.leagues;
create policy leagues_delete_owner
on public.leagues
for delete
using (owner_id = auth.uid());

drop policy if exists members_select_same_league on public.league_members;
create policy members_select_same_league
on public.league_members
for select
using (public.is_league_member(league_id));

drop policy if exists members_insert_self_or_owner on public.league_members;
create policy members_insert_self_or_owner
on public.league_members
for insert
with check (
  (user_id = auth.uid() and public.is_league_member(league_id))
  or public.is_league_owner(league_id)
);

drop policy if exists members_update_self_or_owner on public.league_members;
create policy members_update_self_or_owner
on public.league_members
for update
using (
  user_id = auth.uid()
  or public.is_league_owner(league_id)
)
with check (
  user_id = auth.uid()
  or public.is_league_owner(league_id)
);

drop policy if exists members_delete_owner on public.league_members;
create policy members_delete_owner
on public.league_members
for delete
using (public.is_league_owner(league_id));

drop policy if exists fixtures_select_member on public.fixtures;
create policy fixtures_select_member
on public.fixtures
for select
using (public.is_league_member(league_id));

drop policy if exists fixtures_insert_owner on public.fixtures;
create policy fixtures_insert_owner
on public.fixtures
for insert
with check (public.is_league_owner(league_id));

drop policy if exists fixtures_update_owner on public.fixtures;
create policy fixtures_update_owner
on public.fixtures
for update
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists fixtures_delete_owner on public.fixtures;
create policy fixtures_delete_owner
on public.fixtures
for delete
using (public.is_league_owner(league_id));

drop policy if exists predictions_select_member on public.predictions;
create policy predictions_select_member
on public.predictions
for select
using (
  user_id = auth.uid()
);

drop policy if exists predictions_insert_self on public.predictions;
create policy predictions_insert_self
on public.predictions
for insert
with check (
  user_id = auth.uid()
  and public.can_submit_prediction(fixture_id)
  and exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and public.is_league_member(f.league_id)
  )
);

drop policy if exists predictions_update_self on public.predictions;
create policy predictions_update_self
on public.predictions
for update
using (
  user_id = auth.uid()
  and public.can_submit_prediction(fixture_id)
)
with check (
  user_id = auth.uid()
  and public.can_submit_prediction(fixture_id)
);

drop policy if exists predictions_delete_self_or_owner on public.predictions;
create policy predictions_delete_self_or_owner
on public.predictions
for delete
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and public.is_league_owner(f.league_id)
  )
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
      and public.is_league_member(f.league_id)
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
      and public.is_league_owner(f.league_id)
  )
)
with check (
  exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and public.is_league_owner(f.league_id)
  )
);

drop function if exists public.delete_my_account();
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Deleting auth.users cascades into league_members, leagues (as owner), fixtures, predictions, and results.
  delete from auth.users
  where id = v_user_id;
end;
$$;

grant execute on function public.delete_my_account() to authenticated;

drop function if exists public.admin_list_leagues();
create or replace function public.admin_list_leagues()
returns table (
  id uuid,
  name text,
  code text,
  is_public boolean,
  owner_id uuid,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) <> 'jackwilliamison@gmail.com' then
    raise exception 'Forbidden';
  end if;

  return query
  select l.id, l.name, l.code, l.is_public, l.owner_id, l.created_at
  from public.leagues l
  order by l.created_at desc;
end;
$$;

grant execute on function public.admin_list_leagues() to authenticated;

drop function if exists public.admin_delete_league(uuid);
create or replace function public.admin_delete_league(p_league_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) <> 'jackwilliamison@gmail.com' then
    raise exception 'Forbidden';
  end if;

  if exists (
    select 1
    from public.leagues l
    where l.id = p_league_id
      and lower(trim(l.name)) = lower('Global League')
  ) then
    raise exception 'Global League cannot be deleted';
  end if;

  delete from public.leagues
  where id = p_league_id;
end;
$$;

grant execute on function public.admin_delete_league(uuid) to authenticated;
