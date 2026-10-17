begin;

select plan(12);

insert into public.categories (id, slug, name, description, sort_order)
values
  ('f1000000-0000-4000-8000-000000000001', 'test-public', 'Test Public', null, 1),
  ('f1000000-0000-4000-8000-000000000002', 'test-hidden', 'Test Hidden', null, 2);

insert into public.products (
  id, slug, name, description, category_id, price_paisa, stock_quantity,
  is_active, is_published
) values
  ('f2000000-0000-4000-8000-000000000001', 'test-visible', 'Test Visible', '', 'f1000000-0000-4000-8000-000000000001', 10000, 2, true, true),
  ('f2000000-0000-4000-8000-000000000002', 'test-draft', 'Test Draft', '', 'f1000000-0000-4000-8000-000000000002', 10000, 2, true, false),
  ('f2000000-0000-4000-8000-000000000003', 'test-inactive', 'Test Inactive', '', 'f1000000-0000-4000-8000-000000000002', 10000, 2, false, true);

insert into public.product_images (product_id, storage_path, alt_text)
values
  ('f2000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000001/visible.webp', 'Visible'),
  ('f2000000-0000-4000-8000-000000000002', 'f2000000-0000-4000-8000-000000000002/draft.webp', 'Draft');
insert into storage.objects (bucket_id, name, metadata) values
  ('product-images', 'f2000000-0000-4000-8000-000000000001/visible.webp', '{}'::jsonb),
  ('product-images', 'f2000000-0000-4000-8000-000000000002/draft.webp', '{}'::jsonb);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values (
  'f3000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
  'catalog-admin@example.invalid', '', now(), '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
);
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  'f4000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
  'catalog-customer@example.invalid', '', now(), '{"provider":"email","providers":["email"]}',
  '{}', now(), now()
);
update public.profiles set role = 'admin'
where id = 'f3000000-0000-4000-8000-000000000001';

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::integer from public.products where slug like 'test-%'), 1, 'anonymous sees only active published fixture products');
select is((select count(*)::integer from public.categories where slug like 'test-%'), 1, 'anonymous sees only fixture categories with a visible product');
select is((select count(*)::integer from public.product_images where storage_path like 'f2000000-%'), 1, 'anonymous sees fixture image metadata only for visible products');
select is((select count(*)::integer from storage.objects where bucket_id = 'product-images'), 1, 'anonymous can read signed-object metadata only for published products');
select ok(not exists (select 1 from storage.objects where name = 'f2000000-0000-4000-8000-000000000002/draft.webp'), 'anonymous cannot read unpublished product image objects');
select ok(not has_table_privilege('anon', 'public.products', 'insert'), 'anonymous role has no product insert grant');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"f4000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select is((select count(*)::integer from public.products where slug like 'test-%'), 1, 'authenticated non-admin sees only active published fixture products');
select throws_ok(
  $$insert into public.products (slug, name, description, category_id, price_paisa, is_active, is_published)
    values ('test-forbidden', 'Forbidden', '', 'f1000000-0000-4000-8000-000000000001', 10000, true, true)$$,
  '42501', null, 'authenticated non-admin cannot insert products'
);
select is((select count(*)::integer from storage.objects where bucket_id = 'product-images'), 1, 'authenticated customer can read only published product image objects');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"f3000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select is((select count(*)::integer from storage.objects where bucket_id = 'product-images'), 2, 'admin can read uploaded objects for draft and published products');
select is((select count(*)::integer from public.products where slug like 'test-%'), 3, 'admin can inspect published products and drafts');
select lives_ok(
  $$insert into public.products (slug, name, description, category_id, price_paisa, is_active, is_published)
    values ('test-admin-write', 'Admin Write', '', 'f1000000-0000-4000-8000-000000000002', 10000, true, false)$$,
  'admin can insert an unpublished product through RLS'
);

select * from finish();
rollback;
