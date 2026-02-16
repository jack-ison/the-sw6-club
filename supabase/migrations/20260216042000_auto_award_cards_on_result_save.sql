-- Auto award Matchday Moments when a fixture result is saved.
-- Safe to apply before/after matchday moments functions are present.

create or replace function public.auto_award_cards_after_result_save()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If the award function isn't installed yet, skip safely.
  if to_regprocedure('public.award_cards_for_fixture(uuid)') is null then
    return new;
  end if;

  perform public.award_cards_for_fixture(new.fixture_id);
  return new;
exception
  when others then
    -- Do not block result saves if awarding fails; function audit logging captures failures.
    return new;
end;
$$;

drop trigger if exists trg_auto_award_cards_after_result_save on public.results;
create trigger trg_auto_award_cards_after_result_save
after insert or update of chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at
on public.results
for each row
execute function public.auto_award_cards_after_result_save();
