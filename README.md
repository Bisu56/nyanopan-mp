# Nyanopan — Handmade Nepali E-commerce

Production e-commerce storefront for **Nyanopan**, a real Nepali handmade-product
business selling wool felt footwear, accessories and home decor. Built with the
Next.js App Router, TypeScript, Tailwind CSS v4 and Supabase (PostgreSQL, Auth,
Storage). All prices are in Nepali Rupees (NPR).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with a custom token palette (see `app/globals.css`) |
| Database | Supabase PostgreSQL with Row Level Security, local-first via Supabase CLI |
| Auth / Storage | Supabase Auth + private Supabase Storage bucket (admin uploads; short-lived signed reads) |
| Payments (release 1) | Cash on Delivery and owner-provided manual payment instructions; online gateway deferred |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    then fill in the URL and publishable key printed by `npx supabase status`

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000.

### Local database

```bash
npx supabase start     # starts local Postgres/Auth/Storage (requires Docker)
npx supabase status    # copy API URL and publishable key into .env.local
npx supabase db reset  # re-runs all migrations + seed data
npx supabase test db   # runs database RLS/integration tests
```

The local configuration, migrations and placeholder seed data are included in
this repository; no `supabase init` step is needed. `db reset` rebuilds the local
database and inserts demo placeholders. Replace those explicitly labelled sample
rows with owner-verified product details before launch. To load the demo products
again after a reset, `supabase/seed.sql` is run automatically by `db reset`; do not
use real customer or catalog data in this file.
The Supabase project is not linked to a hosted project; local CLI commands above
operate on the local development stack.

### Catalog database and image storage

The catalog migration adds a separate `is_published` state. Public API reads of
categories, products, variants and image metadata are limited to products where
both `is_active` and `is_published` are true. Product images are in the private
`product-images` Storage bucket (5 MiB maximum; JPEG, PNG, WebP and AVIF only).
Only users with an admin profile can read or modify bucket objects. Public product
image delivery must use short-lived signed URLs created server-side after checking
the product's active and published state; never make this bucket public.

The shopping bag is saved in versioned browser storage with product IDs, optional
variant IDs and quantities only. Product names, prices and stock are fetched from
the server. `/api/cart/validate` recalculates the current subtotal and checks
product/variant availability whenever the bag is viewed; checkout must call the
same server validation again. Order placement rechecks database prices and stock
inside one transaction while locking inventory, then stores price snapshots.
Delivery is recorded as zero until the owner confirms a rate. The API is
idempotent and returns a private confirmation path; guest receipts do not expose
contact or address details. Manual payments remain `unpaid` until reviewed.

Set `MANUAL_PAYMENT_INSTRUCTIONS` in the server environment to show verified
directions. Leave it blank until those directions are confirmed; the receipt
will advise customers not to send funds yet. Never use a `NEXT_PUBLIC_` variable
for payment credentials or other secrets.

The app uses `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The publishable key is intended for
browser use and does not replace RLS. Server-side admin code should call
`requireAdmin()` and continue using its request-bound client, so RLS checks the
same identity. No service-role key is needed for this catalog integration. Never
put a service-role key or other secret in a `NEXT_PUBLIC_` variable.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (fails on type errors) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm test` | Cart and checkout validation unit tests (Node test runner) |
| `npx tsc --noEmit` | Standalone type-check |

## Project structure

```
app/                  Routes (App Router). Each route owns loading/error states.
components/
  layout/             Site-wide shell: header, footer
  products/           Catalog cards, filters and featured product list
  ui/                 Reusable presentational components (Button, Badge, …)
lib/                  Helpers and configuration (no React)
docs/                 Implementation status and engineering notes
designs/              Supplied Stitch design reference (not shipped to the site)
supabase/             Local Supabase config, database migrations and seed data
```

## Engineering rules this repo follows

- All checkout input is validated on the **server** before reaching the database.
- Prices, stock and order totals are **never trusted** from the browser; they are
  re-read from the database and recomputed server-side in integer paisa.
- Administrative catalog writes are authorized on the server and independently
  restricted by RLS; the service-role key is not used for catalog operations.
- Row Level Security is enabled on every table; public read, admin write.
- Guest order creation uses a restricted server-side database function; anonymous
  direct reads are revoked and confirmation lookup returns no personal data.
- Secrets and `.env.local` are never committed (`.env.example` is the template).
- No real product data, reviews or business claims are invented; placeholder
  content is clearly labelled until the owner supplies verified material.

## Project status

See [`docs/implementation-status.md`](docs/implementation-status.md) for the
milestone-by-milestone status. The Stitch design reference lives in
[`designs/`](designs/) and is the source of truth for the visual language.
