-- Hotfix: never block result saves if collectible awarding fails.
-- This protects admin score entry on matchday even when award serial conflicts occur.

create or replace function public.auto_award_cards_after_result_save()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if to_regprocedure('public.award_cards_for_fixture(uuid)') is null then
    return new;
  end if;

  begin
    perform public.award_cards_for_fixture(new.fixture_id);
  exception
    when unique_violation then
      -- Common failure: duplicate serial number in user_fixture_cards.
      -- Do not block result persistence.
      return new;
    when others then
      -- Do not block result persistence for any award failure.
      return new;
  end;

  return new;
end;
$$;

drop trigger if exists trg_auto_award_cards_after_result_save on public.results;
create trigger trg_auto_award_cards_after_result_save
after insert or update of chelsea_goals, opponent_goals, first_scorer, chelsea_scorers, saved_at
on public.results
for each row
execute function public.auto_award_cards_after_result_save();
