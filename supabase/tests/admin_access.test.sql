begin;
select plan(14);

insert into public.categories (id, slug, name) values
  ('d1000000-0000-4000-8000-000000000001', 'admin-rls-fixture', 'Admin fixture');
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('d2000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'fixture-customer@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('d2000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'fixture-admin@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());
update public.profiles set role = 'admin' where id = 'd2000000-0000-4000-8000-000000000002';

select ok(not has_table_privilege('authenticated', 'public.profiles', 'update'), 'authenticated users cannot mutate profile roles');
select ok(not has_table_privilege('anon', 'public.products', 'insert'), 'anonymous users cannot write products');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d2000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select throws_ok(
  $$update public.profiles set role = 'admin' where id = 'd2000000-0000-4000-8000-000000000001'$$,
  '42501', null, 'customer cannot promote an account to admin'
);
select throws_ok(
  $$insert into public.categories (slug, name) values ('customer-category', 'Customer category')$$,
  '42501', null, 'customer cannot create categories'
);
select throws_ok(
  $$insert into public.products (slug, name, category_id, price_paisa) values ('customer-product', 'Customer product', 'd1000000-0000-4000-8000-000000000001', 10000)$$,
  '42501', null, 'customer cannot create products'
);
select throws_ok(
  $$insert into public.product_variants (product_id, size_label) values ('d3000000-0000-4000-8000-000000000001', 'S')$$,
  '42501', null, 'customer cannot add product options'
);
select throws_ok(
  $$insert into public.product_images (product_id, storage_path) values ('d3000000-0000-4000-8000-000000000001', 'd3000000-0000-4000-8000-000000000001/image.webp')$$,
  '42501', null, 'customer cannot add product images'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"d2000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select lives_ok(
  $$insert into public.categories (slug, name, sort_order) values ('admin-created-category', 'Admin created category', 3)$$,
  'admin can create categories'
);
select lives_ok(
  $$insert into public.products (id, slug, name, description, category_id, price_paisa, stock_quantity, is_active, is_published)
    values ('d3000000-0000-4000-8000-000000000001', 'admin-created-product', 'Admin product', '', 'd1000000-0000-4000-8000-000000000001', 12000, 4, false, false)$$,
  'admin can create draft products'
);
select lives_ok(
  $$insert into public.product_variants (product_id, size_label, stock_quantity) values ('d3000000-0000-4000-8000-000000000001', 'S', 2)$$,
  'admin can create product options'
);
select lives_ok(
  $$insert into public.product_images (product_id, storage_path, alt_text) values ('d3000000-0000-4000-8000-000000000001', 'd3000000-0000-4000-8000-000000000001/admin.webp', 'Product photo')$$,
  'admin can manage product image metadata'
);
select lives_ok(
  $$update public.products set stock_quantity = 8, is_active = true, is_published = true where id = 'd3000000-0000-4000-8000-000000000001'$$,
  'admin can update stock and publish products'
);
reset role;

select is((select stock_quantity from public.products where id='d3000000-0000-4000-8000-000000000001'), 8, 'admin stock update persisted');
select ok(exists (
  select 1 from pg_policies
  where schemaname = 'storage' and tablename = 'objects'
    and policyname = 'product_images_admin_insert_objects'
    and with_check like '%is_admin%'
), 'private image upload policy requires administrator role');

select * from finish();
rollback;

