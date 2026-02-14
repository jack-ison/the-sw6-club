-- Run this in Supabase SQL Editor once per project.

create extension if not exists pgcrypto;

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

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
  submitted_at timestamptz not null default now(),
  primary key (fixture_id, user_id)
);

create table if not exists public.results (
  fixture_id uuid primary key references public.fixtures(id) on delete cascade,
  chelsea_goals integer not null check (chelsea_goals >= 0),
  opponent_goals integer not null check (opponent_goals >= 0),
  first_scorer text not null,
  saved_by uuid not null references auth.users(id) on delete cascade,
  saved_at timestamptz not null default now()
);

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

create or replace function public.join_league_by_code(p_code text, p_display_name text)
returns void
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
  where upper(l.code) = upper(trim(p_code));

  if v_league_id is null then
    raise exception 'League code not found';
  end if;

  insert into public.league_members (league_id, user_id, display_name, role)
  values (v_league_id, auth.uid(), trim(p_display_name), 'member')
  on conflict (league_id, user_id)
  do update set display_name = excluded.display_name;
end;
$$;

grant execute on function public.join_league_by_code(text, text) to authenticated;

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
  exists (
    select 1
    from public.fixtures f
    where f.id = fixture_id
      and public.is_league_member(f.league_id)
  )
);

drop policy if exists predictions_insert_self on public.predictions;
create policy predictions_insert_self
on public.predictions
for insert
with check (
  user_id = auth.uid()
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
using (user_id = auth.uid())
with check (user_id = auth.uid());

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
