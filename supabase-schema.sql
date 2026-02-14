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
  country_code text not null default 'GB' check (country_code ~ '^[A-Z]{2}$'),
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

alter table public.league_members
  add column if not exists country_code text not null default 'GB';

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

create or replace function public.join_league_by_code(
  p_code text,
  p_display_name text,
  p_country_code text default 'GB'
)
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
end;
$$;

grant execute on function public.join_league_by_code(text, text, text) to authenticated;

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

create or replace function public.get_overall_leaderboard(p_limit integer default 10)
returns table (
  user_id uuid,
  display_name text,
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
        case
          when p.chelsea_goals = r.chelsea_goals
               and p.opponent_goals = r.opponent_goals then 3
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
          ) then 1
          else 0
        end
        +
        case
          when lower(trim(p.first_scorer)) = lower(trim(r.first_scorer)) then 2
          else 0
        end
      )::integer as points
    from public.predictions p
    join public.results r on r.fixture_id = p.fixture_id
    group by p.user_id
  ),
  member_meta as (
    select distinct on (m.user_id)
      m.user_id,
      m.display_name,
      m.country_code
    from public.league_members m
    order by m.user_id, m.joined_at desc
  )
  select
    s.user_id,
    coalesce(mm.display_name, 'Player') as display_name,
    coalesce(mm.country_code, 'GB') as country_code,
    s.points
  from scored s
  left join member_meta mm on mm.user_id = s.user_id
  order by s.points desc, display_name asc
  limit greatest(coalesce(p_limit, 10), 1);
$$;

grant execute on function public.get_overall_leaderboard(integer) to anon, authenticated;

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
