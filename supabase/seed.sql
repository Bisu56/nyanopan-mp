-- Nyanopan seed data — PLACEHOLDERS ONLY (engineering rule #8).
--
-- Nothing here is real catalog data. Rows are clearly named "Sample ..." and
-- must be replaced with verified product information supplied by the owner
-- before launch. Prices are round placeholder figures in paisa (Rs 100.00).

insert into public.categories (slug, name, description, sort_order) values
  ('footwear',    'Felt Footwear', 'Placeholder category — hand-felted slippers and boots.', 1),
  ('home-decor',  'Home Decor',    'Placeholder category — rugs, trivets and felt decor.', 2),
  ('accessories', 'Accessories',   'Placeholder category — small felt goods and accessories.', 3),
  ('gifting',     'Gifting',       'Placeholder category — handcrafted gift sets.', 4);

insert into public.products (slug, name, description, category_id, price_paisa, stock_quantity, is_active, is_published)
select
  'sample-felt-slipper',
  'Sample Felt Slipper — placeholder row',
  'PLACEHOLDER: created by supabase/seed.sql for local development. Replace with verified catalog data supplied by the business owner.',
  c.id,
  10000,
  10,
  true,
  true
from public.categories c
where c.slug = 'footwear'
limit 1;

insert into public.products (slug, name, description, category_id, price_paisa, stock_quantity, is_active, is_published)
select
  'sample-felt-ball-rug',
  'Sample Felt Ball Rug — placeholder row',
  'PLACEHOLDER: created by supabase/seed.sql for local development. Replace with verified catalog data supplied by the business owner.',
  c.id,
  10000,
  5,
  true,
  true
from public.categories c
where c.slug = 'home-decor'
limit 1;

insert into public.products (slug, name, description, category_id, price_paisa, stock_quantity, is_active, is_published)
select
  'sample-dryer-balls',
  'Sample Wool Dryer Balls — placeholder row',
  'PLACEHOLDER: created by supabase/seed.sql for local development. Replace with verified catalog data supplied by the business owner.',
  c.id,
  10000,
  20,
  true,
  true
from public.categories c
where c.slug = 'accessories'
limit 1;

insert into public.products (slug, name, description, category_id, price_paisa, stock_quantity, is_active, is_published)
select
  'sample-inactive-wip',
  'Sample Draft Product — placeholder row (hidden)',
  'PLACEHOLDER: is_active = false so the public catalog hides it. Used to test visibility rules.',
  c.id,
  10000,
  0,
  false,
  false
from public.categories c
where c.slug = 'gifting'
limit 1;
