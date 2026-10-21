-- Migration: 202610210001_admin_reviews_and_hero.sql
-- Description: Enable direct admin reviews insert, add is_hero column, and enable review media uploads

-- 1. Allow admins to insert customer reviews directly
create policy reviews_admin_insert on public.reviews
  for insert to authenticated
  with check (public.is_admin());

-- 2. Add is_hero column to products table if not already present
alter table public.products
  add column if not exists is_hero boolean not null default false;

-- 3. Create performance indexes for storefront catalog filtering
create index if not exists idx_products_is_hero on public.products(is_hero);
create index if not exists idx_products_featured on public.products(featured);

-- 4. Enable public review media storage and allow admin uploads of images and videos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-images', 'review-images', true, 62914560, null)
on conflict (id) do update set
  public = true,
  file_size_limit = 62914560,
  allowed_mime_types = null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 62914560, null)
on conflict (id) do update set
  public = true,
  file_size_limit = 62914560,
  allowed_mime_types = null;

drop policy if exists storage_review_admin_manage on storage.objects;
create policy storage_review_admin_manage on storage.objects
  for all to authenticated
  using (bucket_id in ('review-images', 'product-images') and public.is_admin())
  with check (bucket_id in ('review-images', 'product-images') and public.is_admin());
