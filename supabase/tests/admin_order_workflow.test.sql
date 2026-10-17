begin;
select plan(23);

insert into public.categories (id, slug, name) values
  ('f1000000-0000-4000-8000-000000000001', 'workflow-test', 'Workflow test');
insert into public.products (id, slug, name, category_id, price_paisa, stock_quantity, is_active, is_published) values
  ('f2000000-0000-4000-8000-000000000001', 'workflow-product', 'Workflow product', 'f1000000-0000-4000-8000-000000000001', 1500, 10, true, true);
insert into public.product_variants (id, product_id, size_label, stock_quantity) values
  ('f3000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000001', 'M', 10);
insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
  ('f4000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'workflow-admin@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('f4000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'workflow-customer@example.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());
update public.profiles set role = 'admin' where id = 'f4000000-0000-4000-8000-000000000001';

select ok(not has_table_privilege('authenticated', 'public.orders', 'update'), 'administrators cannot bypass transition RPC with direct table updates');
select ok(not has_table_privilege('authenticated', 'public.order_payment_history', 'insert'), 'payment audit rows cannot be inserted directly');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"f4000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select throws_ok($$select public.admin_transition_order('f5000000-0000-4000-8000-000000000001', 'confirmed')$$,
  '42501', null, 'customer cannot invoke admin order workflow');
reset role;

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select lives_ok($$select * from public.create_order(
  'f6000000-0000-4000-8000-000000000001', repeat('c',64), 'Workflow Buyer', '+9779812345678',
  '{"province":"Bagmati","district":"Kathmandu","municipality":"Kathmandu Metropolitan City","ward":"5","full_address":"Test address at the square"}',
  null, 'manual', '[{"productId":"f2000000-0000-4000-8000-000000000001","variantId":"f3000000-0000-4000-8000-000000000001","quantity":1}]'::jsonb
)$$, 'first order is created and stock reserved');
select lives_ok($$select * from public.create_order(
  'f6000000-0000-4000-8000-000000000002', repeat('d',64), 'Workflow Buyer', '+9779812345678',
  '{"province":"Bagmati","district":"Kathmandu","municipality":"Kathmandu Metropolitan City","ward":"5","full_address":"Test address at the square"}',
  null, 'cod', '[{"productId":"f2000000-0000-4000-8000-000000000001","variantId":"f3000000-0000-4000-8000-000000000001","quantity":2}]'::jsonb
)$$, 'second order is created and stock reserved');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"f4000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select lives_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'confirmed')$$, 'pending order can be confirmed');
select lives_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'processing')$$, 'confirmed order can be processed');
select lives_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'shipped')$$, 'processing order can be shipped');
select lives_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'delivered')$$, 'shipped order can be delivered');
select is((select status::text from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'delivered', 'order workflow reaches delivered');
select ok((select delivered_at is not null and confirmed_at is not null and processing_at is not null and shipped_at is not null from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'workflow timestamps are recorded');
select is((select count(*)::integer from public.order_status_history h join public.orders o on o.id=h.order_id where o.idempotency_key='f6000000-0000-4000-8000-000000000001'), 5, 'each status change is preserved in history');
select lives_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000002'), 'cancelled')$$, 'unfulfilled order can be cancelled');
select lives_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000002'), 'cancelled')$$, 'repeated cancellation is idempotent');
select is((select stock_quantity from public.products where id='f2000000-0000-4000-8000-000000000001'), 9, 'cancellation restores parent stock once');
select is((select stock_quantity from public.product_variants where id='f3000000-0000-4000-8000-000000000001'), 9, 'cancellation restores variant stock once');
select ok((select cancelled_at is not null from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000002'), 'cancellation timestamp is recorded');
select throws_ok($$select public.admin_transition_order((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000002'), 'pending')$$,
  '22023', null, 'cancelled order cannot be reopened');
select lives_ok($$select public.admin_set_order_payment_status((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'paid')$$, 'administrator can explicitly confirm payment');
select lives_ok($$select public.admin_set_order_payment_status((select id from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'paid')$$, 'repeated payment confirmation is harmless');
select is((select count(*)::integer from public.order_payment_history h join public.orders o on o.id=h.order_id where o.idempotency_key='f6000000-0000-4000-8000-000000000001'), 1, 'payment history does not duplicate on retry');
select is((select status::text from public.orders where idempotency_key='f6000000-0000-4000-8000-000000000001'), 'delivered', 'payment update remains separate from fulfilment status');
select is((select order_count from public.admin_order_summary()), 2::bigint, 'sales summary reports the real stored order count');
reset role;

select * from finish();
rollback;
