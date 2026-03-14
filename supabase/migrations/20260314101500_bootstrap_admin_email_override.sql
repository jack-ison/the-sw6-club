create or replace function public.is_bootstrap_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('jackwilliamison@gmail.com');
$$;

grant execute on function public.is_bootstrap_admin_email() to authenticated;

create or replace function public.is_configured_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  if public.is_bootstrap_admin_email() then
    return true;
  end if;

  return exists (
    select 1
    from public.app_admins a
    where a.user_id = auth.uid()
  );
end;
$$;

grant execute on function public.is_configured_admin() to authenticated;

drop function if exists public.bootstrap_admin_self();
create or replace function public.bootstrap_admin_self()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  if not public.is_bootstrap_admin_email() then
    return false;
  end if;

  insert into public.app_admins (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;

  return true;
end;
$$;

grant execute on function public.bootstrap_admin_self() to authenticated;
