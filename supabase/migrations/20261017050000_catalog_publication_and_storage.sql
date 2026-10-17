-- Catalog publication state, public visibility rules and private image storage.

alter table public.categories
  add column updated_at timestamptz not null default now();

alter table public.products
  add column is_published boolean not null default false,
  add column published_at timestamptz,
  add constraint products_publish_timestamp_check
    check (is_published = (published_at is not null));

alter table public.product_images
  add column updated_at timestamptz not null default now(),
  add constraint product_images_storage_path_check check (
    char_length(storage_path) between 1 and 500
    and storage_path !~ '(^/|(^|/)\.\.?(/|$))'
    and storage_path !~ '[[:cntrl:]]'
  );

create index products_public_catalog_idx
  on public.products (category_id, created_at desc)
  where is_active and is_published;
create index products_published_at_idx
  on public.products (published_at desc)
  where is_active and is_published;
create index product_images_product_sort_idx
  on public.product_images (product_id, sort_order, created_at);

drop trigger products_set_updated_at on public.products;

create or replace function public.set_product_timestamps()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  if new.is_published then
    if tg_op = 'INSERT' or not old.is_published then
      new.published_at = coalesce(new.published_at, now());
    elsif new.published_at is null then
      new.published_at = now();
    end if;
  else
    new.published_at = null;
  end if;
  return new;
end;
$$;

create trigger products_set_timestamps
  before insert or update on public.products
  for each row execute function public.set_product_timestamps();

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger product_images_set_updated_at
  before update on public.product_images
  for each row execute function public.set_updated_at();

-- RLS is row filtering; table grants are also narrowed explicitly.
revoke all on table public.categories, public.products, public.product_images
  from public, anon, authenticated;
grant select on table public.categories, public.products, public.product_images
  to anon;
grant select, insert, update, delete
  on table public.categories, public.products, public.product_images
  to authenticated;

drop policy categories_public_read on public.categories;
drop policy categories_admin_write on public.categories;
drop policy products_read_active_or_admin on public.products;
drop policy products_admin_write on public.products;
drop policy images_read_visible_product on public.product_images;
drop policy images_admin_write on public.product_images;
drop policy variants_read_visible_product on public.product_variants;

create policy categories_read_published_catalog
  on public.categories for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.category_id = categories.id and p.is_active and p.is_published
  ));
create policy categories_admin_read
  on public.categories for select to authenticated
  using (public.is_admin());
create policy categories_admin_insert
  on public.categories for insert to authenticated
  with check (public.is_admin());
create policy categories_admin_update
  on public.categories for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy categories_admin_delete
  on public.categories for delete to authenticated
  using (public.is_admin());

create policy products_read_published_catalog
  on public.products for select to anon, authenticated
  using (is_active and is_published);
create policy products_admin_read
  on public.products for select to authenticated
  using (public.is_admin());
create policy products_admin_insert
  on public.products for insert to authenticated
  with check (public.is_admin());
create policy products_admin_update
  on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy products_admin_delete
  on public.products for delete to authenticated
  using (public.is_admin());

create policy images_read_published_catalog
  on public.product_images for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_images.product_id and p.is_active and p.is_published
  ));
create policy images_admin_read
  on public.product_images for select to authenticated
  using (public.is_admin());
create policy images_admin_insert
  on public.product_images for insert to authenticated
  with check (public.is_admin());
create policy images_admin_update
  on public.product_images for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy images_admin_delete
  on public.product_images for delete to authenticated
  using (public.is_admin());

create policy variants_read_published_catalog
  on public.product_variants for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_variants.product_id and p.is_active and p.is_published
  ));

-- Product images remain private objects. Server code may mint short-lived
-- signed URLs only after checking the parent product's publication state.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy product_images_admin_read_objects
  on storage.objects for select to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
create policy product_images_admin_insert_objects
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy product_images_admin_update_objects
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
create policy product_images_admin_delete_objects
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- Storage bucket config also provisions this bucket on local startup.
