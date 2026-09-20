# ShopXzetio asset library

Everything referenced by a public `/assets/...` URL lives in this folder so Vite and Vercel deploy it unchanged.

## Folder convention

- `brand/` — store identity, partner marks, and campaign artwork.
- `products/<catalog folder>/` — one folder per product; the catalog generator scans these folders.
- `reels/` — curated storefront videos.
- `reviews/pro-players/` — reviewer portraits.
- `reviews/<review batch>/images|videos/` — customer media grouped by ingestion batch.

Admin-uploaded product images live in the Supabase `product-images` bucket under `products/<product-id>/`; they are not duplicated in this repository.

## Maintenance commands

```bash
npm run build:data
npm run optimize:assets
npm run test:assets
```

The production build runs the asset verifier automatically. Product uploads in the admin portal are resized to a maximum of 1600 pixels and converted to WebP before upload.
