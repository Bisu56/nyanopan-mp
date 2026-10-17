-- Milestone 6: safe guest checkout and atomic inventory reservation.
-- Keep payment unverified until a future admin workflow confirms it.

alter table public.orders alter column payment_method drop default;
create type public.payment_method_next as enum ('cod', 'manual');
alter table public.orders alter column payment_method type public.payment_method_next
  using payment_method::text::public.payment_method_next;
drop type public.payment_method;
alter type public.payment_method_next rename to payment_method;
alter table public.orders alter column payment_method set default 'cod'::public.payment_method;

alter table public.orders
  add column idempotency_key uuid not null default gen_random_uuid(),
  add column confirmation_token_hash text,
  add column delivery_notes text;

create unique index orders_idempotency_key_idx on public.orders (idempotency_key);
create index orders_confirmation_token_hash_idx on public.orders (confirmation_token_hash)
  where confirmation_token_hash is not null;
alter table public.orders add constraint orders_confirmation_hash_format
  check (confirmation_token_hash is null or confirmation_token_hash ~ '^[a-f0-9]{64}$');
alter table public.orders add constraint orders_delivery_notes_length
  check (delivery_notes is null or char_length(delivery_notes) <= 500) not valid;

revoke all on table public.orders, public.order_items, public.order_status_history from anon;

create or replace function public.create_order(
  p_idempotency_key uuid,
  p_confirmation_token_hash text,
  p_customer_name text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_delivery_notes text,
  p_payment_method public.payment_method,
  p_items jsonb
)
returns table (
  order_id uuid,
  order_code text,
  subtotal_paisa bigint,
  delivery_paisa bigint,
  total_paisa bigint,
  payment_method public.payment_method
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_order_code text;
  v_subtotal bigint := 0;
  v_delivery bigint := 0;
  v_total bigint;
  v_user_id uuid := auth.uid();
  v_line record;
  v_product public.products%rowtype;
  v_variant public.product_variants%rowtype;
  v_size text;
  v_price bigint;
  v_line_total bigint;
  v_variant_count integer;
begin
  if p_idempotency_key is null
    or p_confirmation_token_hash is null
    or p_confirmation_token_hash !~ '^[a-f0-9]{64}$'
    or p_customer_name is null or char_length(btrim(p_customer_name)) not between 2 and 120
    or p_customer_phone is null or p_customer_phone !~ '^\+?[0-9]{7,15}$'
    or p_shipping_address is null
    or coalesce(p_shipping_address->>'province','') not in ('Koshi','Madhesh','Bagmati','Gandaki','Lumbini','Karnali','Sudurpashchim')
    or char_length(btrim(coalesce(p_shipping_address->>'district',''))) not between 2 and 100
    or char_length(btrim(coalesce(p_shipping_address->>'municipality',''))) not between 2 and 120
    or coalesce(p_shipping_address->>'ward','') !~ '^[0-9]{1,32}$'
    or char_length(btrim(coalesce(p_shipping_address->>'full_address',''))) not between 5 and 500
    or (p_delivery_notes is not null and char_length(p_delivery_notes) > 500)
    or p_payment_method not in ('cod'::public.payment_method, 'manual'::public.payment_method)
    or p_items is null or jsonb_typeof(p_items) is distinct from 'array'
    or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception using errcode = '22023', message = 'invalid_order_input';
  end if;

  if exists (
    select 1 from jsonb_to_recordset(p_items) as x("productId" uuid, "variantId" uuid, quantity integer)
    where x."productId" is null or x.quantity not between 1 and 99
  ) or exists (
    select 1 from jsonb_to_recordset(p_items) as x("productId" uuid, "variantId" uuid, quantity integer)
    group by x."productId", x."variantId" having count(*) > 1
  ) then
    raise exception using errcode = '22023', message = 'invalid_order_items';
  end if;

  insert into public.orders as new_order (order_code, user_id, customer_name, customer_phone,
      shipping_address, subtotal_paisa, delivery_paisa, total_paisa, payment_method,
      payment_status, status, delivery_notes, idempotency_key, confirmation_token_hash)
    values ('NYA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 20)),
      v_user_id, btrim(p_customer_name), p_customer_phone, p_shipping_address,
      0, 0, 0, p_payment_method, 'unpaid', 'pending', nullif(btrim(p_delivery_notes), ''),
      p_idempotency_key, p_confirmation_token_hash)
    on conflict (idempotency_key) do nothing
    returning new_order.id, new_order.order_code into v_order_id, v_order_code;

  if v_order_id is null then
    select o.id, o.order_code, o.subtotal_paisa, o.delivery_paisa, o.total_paisa, o.payment_method
      into v_order_id, v_order_code, v_subtotal, v_delivery, v_total, p_payment_method
      from public.orders o
      where o.idempotency_key = p_idempotency_key
        and o.confirmation_token_hash = p_confirmation_token_hash;
    if v_order_id is null then
      raise exception using errcode = '22023', message = 'idempotency_conflict';
    end if;
    return query select v_order_id, v_order_code, v_subtotal, v_delivery, v_total, p_payment_method;
    return;
  end if;

  for v_line in
    select x."productId" as product_id, x."variantId" as variant_id, x.quantity
      from jsonb_to_recordset(p_items) as x("productId" uuid, "variantId" uuid, quantity integer)
      order by x."productId", x."variantId" nulls first
  loop
    select p.* into v_product from public.products p where p.id = v_line.product_id for update;
    if not found or not v_product.is_active or not v_product.is_published then
      raise exception using errcode = 'P0001', message = 'product_unavailable';
    end if;

    select count(*) into v_variant_count from public.product_variants pv where pv.product_id = v_product.id;
    v_price := v_product.price_paisa;
    v_size := null;
    if v_variant_count > 0 and v_line.variant_id is null then
      raise exception using errcode = 'P0001', message = 'variant_required';
    end if;
    if v_line.variant_id is not null then
      select pv.* into v_variant from public.product_variants pv
        where pv.id = v_line.variant_id and pv.product_id = v_product.id for update;
      if not found or not v_variant.is_active then
        raise exception using errcode = 'P0001', message = 'variant_unavailable';
      end if;
      if v_variant.stock_quantity < v_line.quantity then
        raise exception using errcode = 'P0001', message = 'insufficient_stock';
      end if;
      update public.product_variants set stock_quantity = stock_quantity - v_line.quantity
        where id = v_variant.id;
      v_size := v_variant.size_label;
    end if;
    if v_product.stock_quantity < v_line.quantity then
      raise exception using errcode = 'P0001', message = 'insufficient_stock';
    end if;
    update public.products set stock_quantity = stock_quantity - v_line.quantity where id = v_product.id;

    v_line_total := v_price * v_line.quantity;
    v_subtotal := v_subtotal + v_line_total;
    insert into public.order_items (order_id, product_id, variant_id, product_name,
      size_label, unit_price_paisa, quantity, line_total_paisa)
      values (v_order_id, v_product.id, v_line.variant_id, v_product.name,
        v_size, v_price, v_line.quantity, v_line_total);
  end loop;

  v_total := v_subtotal + v_delivery;
  update public.orders set subtotal_paisa = v_subtotal, delivery_paisa = v_delivery,
    total_paisa = v_total where id = v_order_id;
  insert into public.order_status_history (order_id, from_status, to_status, changed_by)
    values (v_order_id, null, 'pending', v_user_id);

  return query select v_order_id, v_order_code, v_subtotal, v_delivery, v_total, p_payment_method;
end;
$$;

revoke all on function public.create_order(uuid,text,text,text,jsonb,text,public.payment_method,jsonb) from public;
grant execute on function public.create_order(uuid,text,text,text,jsonb,text,public.payment_method,jsonb) to anon, authenticated;

create or replace function public.get_order_confirmation(p_confirmation_token_hash text)
returns table (order_code text, subtotal_paisa bigint, delivery_paisa bigint,
  total_paisa bigint, payment_method public.payment_method, payment_status public.payment_status)
language sql
stable
security definer
set search_path = ''
as $$
  select o.order_code, o.subtotal_paisa, o.delivery_paisa, o.total_paisa,
    o.payment_method, o.payment_status
  from public.orders o
  where o.confirmation_token_hash = p_confirmation_token_hash
    and p_confirmation_token_hash ~ '^[a-f0-9]{64}$';
$$;
revoke all on function public.get_order_confirmation(text) from public;
grant execute on function public.get_order_confirmation(text) to anon, authenticated;

