-- Milestone 8: protected order operations, separate payment tracking and
-- transactional cancellation restocking. Stock is reserved at checkout.

-- Add the processing step while preserving existing rows and history.
alter table public.orders alter column status drop default;
create type public.order_status_next as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
alter table public.orders alter column status type public.order_status_next using status::text::public.order_status_next;
alter table public.order_status_history alter column from_status type public.order_status_next using from_status::text::public.order_status_next;
alter table public.order_status_history alter column to_status type public.order_status_next using to_status::text::public.order_status_next;
drop type public.order_status;
alter type public.order_status_next rename to order_status;
alter table public.orders alter column status set default 'pending'::public.order_status;

-- Products referenced by an order must remain available for stock reconciliation.
alter table public.order_items drop constraint order_items_product_id_fkey;
alter table public.order_items add constraint order_items_product_id_fkey
  foreign key (product_id) references public.products(id) on delete restrict;
alter table public.order_items drop constraint order_items_variant_id_fkey;
alter table public.order_items add constraint order_items_variant_id_fkey
  foreign key (variant_id) references public.product_variants(id) on delete restrict;

alter table public.orders
  add column confirmed_at timestamptz,
  add column processing_at timestamptz,
  add column shipped_at timestamptz,
  add column delivered_at timestamptz,
  add column cancelled_at timestamptz,
  add column paid_at timestamptz;
create index orders_status_created_idx on public.orders(status, created_at desc);
create index orders_payment_status_created_idx on public.orders(payment_status, created_at desc);

create table public.order_payment_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.payment_status,
  to_status public.payment_status not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.order_payment_history enable row level security;
create index order_payment_history_order_idx on public.order_payment_history(order_id, created_at desc);
create policy order_payment_history_admin_read on public.order_payment_history
  for select using (public.is_admin());
revoke all on public.order_payment_history from anon, authenticated;
grant select on public.order_payment_history to authenticated;

-- No direct writes can bypass the transition rules or their audit trail.
drop policy if exists orders_admin_update on public.orders;
drop policy if exists orders_admin_insert on public.orders;
drop policy if exists orders_admin_delete on public.orders;
revoke insert, update, delete on public.orders from anon, authenticated;
revoke insert, update, delete on public.order_status_history from anon, authenticated;

create or replace function public.admin_transition_order(
  p_order_id uuid,
  p_new_status public.order_status
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_from public.order_status;
  v_item record;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception using errcode = '42501', message = 'administrator_required';
  end if;
  if p_order_id is null or p_new_status is null then
    raise exception using errcode = '22023', message = 'invalid_order_transition';
  end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'order_not_found'; end if;
  if v_order.status = p_new_status then return v_order; end if;
  v_from := v_order.status;
  if not (
    (v_from = 'pending' and p_new_status in ('confirmed','cancelled')) or
    (v_from = 'confirmed' and p_new_status in ('processing','cancelled')) or
    (v_from = 'processing' and p_new_status in ('shipped','cancelled')) or
    (v_from = 'shipped' and p_new_status = 'delivered')
  ) then raise exception using errcode = '22023', message = 'invalid_order_transition'; end if;
  if p_new_status = 'cancelled' then
    for v_item in select oi.product_id, oi.variant_id, oi.quantity
      from public.order_items oi where oi.order_id = v_order.id
      order by oi.product_id, oi.variant_id nulls first
    loop
      if v_item.product_id is null then raise exception using errcode = '23503', message = 'order_stock_reference_missing'; end if;
      perform 1 from public.products p where p.id = v_item.product_id for update;
      if not found then raise exception using errcode = '23503', message = 'order_stock_reference_missing'; end if;
      if v_item.variant_id is not null then
        perform 1 from public.product_variants pv where pv.id = v_item.variant_id and pv.product_id = v_item.product_id for update;
        if not found then raise exception using errcode = '23503', message = 'order_stock_reference_missing'; end if;
        update public.product_variants set stock_quantity = stock_quantity + v_item.quantity where id = v_item.variant_id;
      end if;
      update public.products set stock_quantity = stock_quantity + v_item.quantity where id = v_item.product_id;
    end loop;
  end if;
  update public.orders set status = p_new_status,
    confirmed_at = case when p_new_status = 'confirmed' then now() else confirmed_at end,
    processing_at = case when p_new_status = 'processing' then now() else processing_at end,
    shipped_at = case when p_new_status = 'shipped' then now() else shipped_at end,
    delivered_at = case when p_new_status = 'delivered' then now() else delivered_at end,
    cancelled_at = case when p_new_status = 'cancelled' then now() else cancelled_at end
    where id = v_order.id returning * into v_order;
  insert into public.order_status_history(order_id, from_status, to_status, changed_by)
    values (v_order.id, v_from, p_new_status, auth.uid());
  return v_order;
end;
$$;
revoke all on function public.admin_transition_order(uuid, public.order_status) from public, anon;
grant execute on function public.admin_transition_order(uuid, public.order_status) to authenticated;

create or replace function public.admin_set_order_payment_status(
  p_order_id uuid,
  p_new_status public.payment_status
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_from public.payment_status;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception using errcode = '42501', message = 'administrator_required';
  end if;
  if p_order_id is null or p_new_status is distinct from 'paid'::public.payment_status then
    raise exception using errcode = '22023', message = 'invalid_payment_transition';
  end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'order_not_found'; end if;
  if v_order.payment_status = 'paid' then return v_order; end if;
  v_from := v_order.payment_status;
  update public.orders set payment_status = 'paid', paid_at = now()
    where id = v_order.id returning * into v_order;
  insert into public.order_payment_history(order_id, from_status, to_status, changed_by)
    values(v_order.id, v_from, 'paid', auth.uid());
  return v_order;
end;
$$;
revoke all on function public.admin_set_order_payment_status(uuid, public.payment_status) from public, anon;
grant execute on function public.admin_set_order_payment_status(uuid, public.payment_status) to authenticated;

create or replace function public.admin_order_summary()
returns table (order_count bigint, open_order_count bigint, unpaid_order_count bigint, delivered_revenue_paisa bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception using errcode = '42501', message = 'administrator_required';
  end if;
  return query select count(*)::bigint,
    count(*) filter (where o.status in ('pending','confirmed','processing'))::bigint,
    count(*) filter (where o.payment_status = 'unpaid')::bigint,
    coalesce(sum(o.total_paisa) filter (where o.status = 'delivered'), 0)::bigint
  from public.orders o;
end;
$$;
revoke all on function public.admin_order_summary() from public, anon;
grant execute on function public.admin_order_summary() to authenticated;
