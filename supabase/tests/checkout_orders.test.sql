begin;
select plan(11);

insert into public.categories (id, slug, name) values
  ('e1000000-0000-4000-8000-000000000001', 'checkout-test', 'Checkout test');
insert into public.products (id, slug, name, description, category_id, price_paisa,
  stock_quantity, is_active, is_published) values
  ('e2000000-0000-4000-8000-000000000001', 'checkout-test-product', 'Checkout product', '',
   'e1000000-0000-4000-8000-000000000001', 2599, 5, true, true);
insert into public.product_variants (id, product_id, size_label, stock_quantity, is_active) values
  ('e3000000-0000-4000-8000-000000000001', 'e2000000-0000-4000-8000-000000000001', 'M', 3, true);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select ok(not has_table_privilege('anon', 'public.orders', 'select'), 'anonymous cannot select PII-bearing order rows');
select lives_ok($$
  select * from public.create_order(
    'e4000000-0000-4000-8000-000000000001',
    repeat('a', 64), 'Demo Customer', '+9779812345678',
    '{"province":"Bagmati","district":"Kathmandu","municipality":"Kathmandu Metropolitan City","ward":"5","full_address":"Thamel near the square"}',
    null, 'manual',
    '[{"productId":"e2000000-0000-4000-8000-000000000001","variantId":"e3000000-0000-4000-8000-000000000001","quantity":2}]'::jsonb
  )
$$, 'manual order can be created atomically');
select lives_ok($$
  select * from public.create_order(
    'e4000000-0000-4000-8000-000000000001',
    repeat('a', 64), 'Demo Customer', '+9779812345678',
    '{"province":"Bagmati","district":"Kathmandu","municipality":"Kathmandu Metropolitan City","ward":"5","full_address":"Thamel near the square"}',
    null, 'manual',
    '[{"productId":"e2000000-0000-4000-8000-000000000001","variantId":"e3000000-0000-4000-8000-000000000001","quantity":2}]'::jsonb
  )
$$, 'retry with same key returns the original order');
select throws_ok($$
  select * from public.create_order(
    'e4000000-0000-4000-8000-000000000002',
    repeat('b', 64), 'Demo Customer', 'bad-phone',
    '{"province":"Bagmati","district":"Kathmandu","municipality":"Kathmandu Metropolitan City","ward":"5","full_address":"Thamel near the square"}',
    null, 'cod',
    '[{"productId":"e2000000-0000-4000-8000-000000000001","variantId":"e3000000-0000-4000-8000-000000000001","quantity":1}]'::jsonb
  )
$$, '22023', null, 'database RPC rejects invalid checkout fields too');
select is((select count(*)::integer from public.get_order_confirmation(repeat('a',64))), 1, 'confirmation token resolves minimal receipt');
reset role;

select is((select payment_status::text from public.orders where idempotency_key='e4000000-0000-4000-8000-000000000001'), 'unpaid', 'manual order remains unverified');
select is((select stock_quantity from public.products where id='e2000000-0000-4000-8000-000000000001'), 3, 'parent stock is decremented');
select is((select stock_quantity from public.product_variants where id='e3000000-0000-4000-8000-000000000001'), 1, 'variant stock is decremented');
select is((select unit_price_paisa from public.order_items oi join public.orders o on o.id=oi.order_id where o.idempotency_key='e4000000-0000-4000-8000-000000000001'), 2599::bigint, 'trusted database price is snapshotted');
select is((select subtotal_paisa from public.orders where idempotency_key='e4000000-0000-4000-8000-000000000001'), 5198::bigint, 'subtotal is calculated from database price');
select is((select count(*)::integer from public.order_items oi join public.orders o on o.id=oi.order_id where o.idempotency_key='e4000000-0000-4000-8000-000000000001'), 1, 'retry key does not create duplicate items');

select * from finish();
rollback;

