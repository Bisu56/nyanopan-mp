-- Nyanopan — initial schema, constraints and Row Level Security.
-- Applied by `supabase db reset` / `supabase db push`.
--
-- Design notes:
-- * All money is INTEGER paisa (Rs 1 = 100 paisa). Never floats (rules #13-14).
-- * Every table has RLS enabled (rule #12). Public may only READ; writes are
--   admin-only. Orders are written exclusively by server-side, validated code
--   (service role / SECURITY DEFINER RPC) — never from the browser (rules #11, #13).
-- * order_items stores price/name/size SNAPSHOTS so order history stays correct
--   even if the catalog changes later.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
create type public.payment_method as enum ('cod');
create type public.payment_status as enum ('unpaid', 'paid');

-- ---------------------------------------------------------------------------
-- Trigger helper (no table dependency)
-- ---------------------------------------------------------------------------

-- updated_at maintenance for tables that have the column.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables  (must come BEFORE is_admin() which references profiles)
-- ---------------------------------------------------------------------------

-- One row per auth.users account. Created automatically on sign-up by the
-- trigger below — no public INSERT policy exists on this table.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text check (full_name is null or char_length(full_name) between 2 and 120),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 60),
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  description text not null default '',
  category_id uuid not null references public.categories (id) on delete restrict,
  price_paisa bigint not null check (price_paisa > 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
create index products_category_idx on public.products (category_id);
create index products_active_idx on public.products (is_active) where is_active;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Optional size/variant rows (footwear sizes). Stock is tracked per variant and
-- on the parent product; the M6 order RPC will handle both atomically.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size_label text not null check (char_length(size_label) between 1 and 20),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (product_id, size_label)
);

alter table public.product_variants enable row level security;

-- Image rows point at objects inside a private Supabase Storage bucket
-- (bucket + policies are created in the Milestone 7 storage migration).
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, storage_path)
);

alter table public.product_images enable row level security;

-- Guest checkout: user_id nullable, customer contact lives on the order.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_phone text not null check (char_length(customer_phone) between 7 and 20),
  customer_email text check (customer_email is null or customer_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  shipping_address jsonb not null,
  subtotal_paisa bigint not null check (subtotal_paisa >= 0),
  delivery_paisa bigint not null default 0 check (delivery_paisa >= 0),
  total_paisa bigint not null check (total_paisa >= 0),
  payment_method public.payment_method not null default 'cod',
  payment_status public.payment_status not null default 'unpaid',
  status public.order_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create index orders_user_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Snapshot rows: catalog price changes never rewrite order history.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  size_label text,
  unit_price_paisa bigint not null check (unit_price_paisa > 0),
  quantity integer not null check (quantity between 1 and 100),
  line_total_paisa bigint not null check (line_total_paisa > 0)
);

alter table public.order_items enable row level security;
create index order_items_order_idx on public.order_items (order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  changed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.order_status_history enable row level security;
create index order_status_history_order_idx on public.order_status_history (order_id);

-- ---------------------------------------------------------------------------
-- is_admin() helper — must come AFTER profiles table exists
-- ---------------------------------------------------------------------------

-- True when the calling user has an admin profile. SECURITY DEFINER avoids the
-- policy recursion that would happen if policies on profiles queried profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Profile auto-creation on sign-up (no public INSERT on profiles needed)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security policies
-- ---------------------------------------------------------------------------

-- profiles: users read their own row; admins read/manage all.
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.is_admin());

create policy "profiles_admin_delete"
  on public.profiles for delete
  using (public.is_admin());

-- categories: public read, admin write.
create policy "categories_public_read"
  on public.categories for select
  using (true);

create policy "categories_admin_write"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- products: everyone reads ACTIVE products; admins read/write all.
create policy "products_read_active_or_admin"
  on public.products for select
  using (is_active or public.is_admin());

create policy "products_admin_write"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- product_variants / product_images: follow the parent product's visibility.
create policy "variants_read_visible_product"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and (p.is_active or public.is_admin())
    )
  );

create policy "variants_admin_write"
  on public.product_variants for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "images_read_visible_product"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and (p.is_active or public.is_admin())
    )
  );

create policy "images_admin_write"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- orders: owners and admins read. NO insert/update/delete policy for
-- customers — order creation happens via the server-only validated RPC
-- (SECURITY DEFINER, Milestone 6) and status changes are admin-only (M7).
create policy "orders_read_owner_or_admin"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

create policy "orders_admin_update"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "orders_admin_insert"
  on public.orders for insert
  with check (public.is_admin());

create policy "orders_admin_delete"
  on public.orders for delete
  using (public.is_admin());

-- order_items: readable through the parent order; written server-side only.
create policy "order_items_read_via_order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- order_status_history: readable through the parent order; inserts are
-- admin/system only (no customer INSERT policy by design).
create policy "order_history_read_via_order"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );
