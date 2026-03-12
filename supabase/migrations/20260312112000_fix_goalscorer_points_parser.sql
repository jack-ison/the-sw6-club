-- Fix goalscorer points parser:
-- Support both expanded scorer strings ("Palmer, Palmer")
-- and compact strings ("Palmer x2").

create or replace function public.count_matching_scorers(p_predicted text, p_actual text)
returns integer
language sql
immutable
set search_path = public
as $$
  with predicted_tokens as (
    select trim(token) as token
    from regexp_split_to_table(coalesce(p_predicted, ''), '\s*,\s*') as token
    where trim(token) <> ''
  ),
  predicted as (
    select
      lower(trim(regexp_replace(token, '\s*x\d+\s*$', '', 'i'))) as name,
      sum(
        case
          when token ~* '\s*x\d+\s*$'
            then greatest(coalesce(nullif(regexp_replace(token, '^.*\sx(\d+)\s*$', '\1', 'i'), '')::int, 1), 1)
          else 1
        end
      )::integer as cnt
    from predicted_tokens
    group by 1
  ),
  actual_tokens as (
    select trim(token) as token
    from regexp_split_to_table(coalesce(p_actual, ''), '\s*,\s*') as token
    where trim(token) <> ''
  ),
  actual as (
    select
      lower(trim(regexp_replace(token, '\s*x\d+\s*$', '', 'i'))) as name,
      sum(
        case
          when token ~* '\s*x\d+\s*$'
            then greatest(coalesce(nullif(regexp_replace(token, '^.*\sx(\d+)\s*$', '\1', 'i'), '')::int, 1), 1)
          else 1
        end
      )::integer as cnt
    from actual_tokens
    group by 1
  )
  select coalesce(sum(least(p.cnt, a.cnt)), 0)::integer
  from predicted p
  join actual a on a.name = p.name
  where p.name <> ''
    and p.name not in ('unknown', 'none')
    and a.name <> ''
    and a.name not in ('unknown', 'none');
$$;
