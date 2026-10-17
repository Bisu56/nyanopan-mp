-- Milestone 9: allow signed delivery of files only when their catalog item is
-- currently active and published. The bucket itself remains private.
create policy product_images_read_published_objects
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1
      from public.product_images pi
      join public.products p on p.id = pi.product_id
      where pi.storage_path = storage.objects.name
        and p.is_active and p.is_published
    )
  );
