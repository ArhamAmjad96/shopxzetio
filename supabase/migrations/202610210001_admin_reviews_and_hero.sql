-- Migration: 202610210001_admin_reviews_and_hero.sql
-- Description: Enable direct admin reviews insert and add is_hero column with indexes

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
