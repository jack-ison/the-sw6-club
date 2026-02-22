insert into public.card_templates (slug, name, description, rarity, active)
values (
  'first-chelsea-scorer',
  'First Chelsea Scorer',
  'Picked the first Chelsea goalscorer correctly.',
  'common',
  true
)
on conflict (slug)
do update set
  name = excluded.name,
  description = excluded.description,
  rarity = 'common',
  active = true;
