-- Emergency matchday unblock:
-- Auto-awarding collectables can fail with duplicate serial conflicts and block result saves.
-- Disable the trigger so admin can always save/edit match results.

drop trigger if exists trg_auto_award_cards_after_result_save on public.results;
