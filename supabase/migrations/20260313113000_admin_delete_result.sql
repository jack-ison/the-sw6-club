drop function if exists public.admin_delete_result(uuid);
create or replace function public.admin_delete_result(p_fixture_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_configured_admin() then
    raise exception 'Forbidden';
  end if;

  delete from public.results
  where fixture_id = p_fixture_id;
end;
$$;

grant execute on function public.admin_delete_result(uuid) to authenticated;
