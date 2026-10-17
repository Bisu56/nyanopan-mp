# Implementation Status

Living checklist maintained at the end of every milestone. Last updated: **2026-10-17 (admin order workflow complete)**.

## Milestones

| # | Milestone | Status |
| --- | --- | --- |
| 1 | Foundation: repo hygiene, design tokens, UI kit, site shell | ✅ Complete |
| 2 | Local Supabase CLI, schema migrations + RLS, placeholder seed data | ✅ Complete |
| 3 | Product browsing: home catalog, filters, product detail | ✅ Complete |
| 4 | Cart: client cart store, cart page, quantity controls, server price/stock validation | ✅ Complete |
| 5 | Auth: Supabase signup/login/logout, session DAL, admin role | ⬜ Not started |
| 6 | Checkout & orders (guest allowed), COD, atomic stock decrement | ⬜ Not started |
| 7 | Admin interface: product CRUD, Storage uploads, order management | ⬜ Not started |
| 8 | Polish: order lookup, SEO, accessibility, tests, docs | ⬜ Not started |
| 9 | eSewa readiness: payment abstraction + docs (no live setup) | ⬜ Not started |

## Owner-requested Milestone 8 — admin order management (2026-10-17)

### Delivered

- Added a protected admin order list with order-code search and independent order
  and payment filters. Customer contact and delivery details are limited to the
  protected order detail view.
- Added the pending → confirmed → processing → shipped → delivered workflow and
  cancellation for unshipped orders, with per-stage timestamps and a status
  history. Payment has a separate history and can only move to paid through an
  explicit admin action.
- Added admin-only database procedures and removed direct order write grants.
  Cancellation restores the parent and variant stock in the same transaction;
  order locking and terminal cancellation make repeated requests idempotent.
  Referenced catalog rows are protected from deletion to preserve reconciliation.
- Added real database sales aggregates for order count, orders needing attention,
  unpaid orders and delivered revenue. The dashboard displays a clear empty
  state when there are no orders.
- Fixed catalog RLS test counts to scope assertions to their own fixtures when
  the configured seed data is present.

### Verification

- `npx supabase db reset --local --yes` — pass; all migrations, including the
  order workflow migration, applied to a clean local database.
- `npx supabase test db --local` — pass, 58 pgTAP assertions across four files.
- `npx supabase db lint --local --schema public --level error` — pass.
- `npm test`, `npm run lint` and `npx tsc --noEmit` — pass.

## Milestone 4 — Supabase catalog integration slice (2026-10-17)

### Delivered

- Added an additive catalog migration with publication state, publication and
  update timestamps, constraints, indexes and row-level security policies.
- Restricted public catalog reads to active, published products and their
  categories, variants and image metadata. Administrative writes require an
  authenticated admin profile in both the server DAL guard and database policies.
- Configured the `product-images` bucket as private, with a 5 MiB limit and image
  MIME type allowlist. Storage object access is admin-only; public display must
  use short-lived signed URLs after a server-side publication check.
- Updated local demo seed rows to explicitly publish only the active sample
  products, adopted Supabase's publishable-key environment variable, and removed
  the unused service-role client path.
- Updated catalog DAL filters and TypeScript row types for publication state.

### Verification

- `npm run lint` — pass.
- `npx tsc --noEmit` — pass.
- `npx supabase migration up --local` — new migration applied.
- `npx supabase test db` — pass, 10 RLS integration assertions.
- `npx supabase db lint --local --schema public --level error` — pass.
- `npm run build` — blocked in both sandboxed and elevated attempts because
  Turbopack cannot bind a local port in this environment.

The original roadmap labels this cart scope as Milestone 4 and labels authentication
as Milestone 5. The owner's latest request called the cart scope Milestone 5; the
authentication feature set remains unimplemented.

## Owner-requested cart and checkout-validation scope (2026-10-17)

### Delivered

- Added a versioned browser-persisted cart containing only product IDs, optional
  variant IDs and quantities. Catalog names, prices and stock are fetched from the
  server and are never trusted from browser storage.
- Added add-to-bag controls to simple product cards and selectable variant controls
  on product details. Cart lines are keyed by both product and variant, so different
  sizes remain separate while duplicate selections combine quantities.
- Added responsive cart controls, subtotal, empty state, mobile summary bar and
  accessible add/remove notifications.
- Added a server cart validation endpoint and reusable checkout-boundary DAL helper
  that re-read active published products, current prices, variants and stock. This
  only validates/quotes the bag; it does not create orders.
- Added Node unit tests for quantity limits, duplicate merging, variants, persisted
  state sanitization and empty carts.

### Verification

- `npm test` — pass.
- `npm run lint` — pass.
- `npx tsc --noEmit` — pass.
- `npm run build` — blocked in sandboxed and elevated runs because Turbopack
  cannot bind a local port in this environment. The `--webpack` fallback also
  failed because Next could not parse TypeScript's `--showConfig` output.

## Milestone 1 — complete (2026-10-17)

### Delivered

- **Repo hygiene:** `.gitignore` fixed so `.env.example` can be committed while real
  `.env*` files stay ignored; `.env.example` created with local Supabase CLI
  placeholders; this status file and a Nyanopan-specific `README.md`.
- **Design system:** Stitch token palette (`designs/src/index.css`) ported 1:1 into
  `app/globals.css` as Tailwind v4 `@theme` tokens (warm ivory surfaces, terracotta
  primary `#96432b`, sage secondary `#4f6352`, brown text, Material-3 naming).
  Playfair Display (serif headings) and Plus Jakarta Sans (body) are self-hosted via
  `next/font` — no runtime request to Google Fonts.
- **UI kit:** `components/ui/` — `Container`, `Button` (primary/secondary/ghost
  variants with a `buttonClassName` helper so `<Link>` can reuse the styling),
  `Badge`, `EmptyState`.
- **Site shell:** `SiteHeader` (announcement bar, serif wordmark, desktop nav,
  accessible mobile drawer with correct `aria-expanded`, skip-to-content link) and
  `SiteFooter`, both matching the Stitch header/footer designs.
- **Routes:** `/` (hero + trust strip + collections grid per design), plus honest
  placeholder pages `/products`, `/story`, `/cart` with empty states, and
  `loading.tsx` / `error.tsx` / `not-found.tsx` state conventions.

### Decisions taken this milestone (owner review welcome)

1. **No hotlinked demo images.** The Stitch mockups reference Google-hosted demo
   photos. Those are not Nyanopan's assets and can break without warning, so the
   site uses branded placeholder panels until real product photography is added to
   `public/images/products/`.
2. **Fabricated design content excluded.** The Stitch project contains invented
   testimonials and demo products. None were shipped (engineering rule #8).
3. **NPR only, COD only.** The design's NPR/USD currency toggle and the eSewa /
   Khalti / Fonepay badges are deferred — release 1 charges NPR and accepts COD.
   The footer advertises only what is actually true today.
4. **Icons:** `lucide-react` SVG icons replace the Material Symbols web font
   (smaller, offline-safe). Added as a project dependency, as in the design repo.
5. **Announcement bar and hero metrics** ("Free delivery inside Ring Road above
   NPR 2,500", "84+ Women Artisans") are carried over from the supplied design and
   **need your confirmation** before launch.

### Verification

- `npm run lint` — pass (0 errors)
- `npx tsc --noEmit` — pass
- `npm run build` — pass

## Milestone 2 — complete (2026-10-17)

### Delivered

- **Local Supabase CLI:** `supabase/config.toml` configures the local PostgreSQL,
  Auth, Storage and Studio services. The project is not linked to a hosted project.
- **Schema and access control:** the initial migration creates profiles, product
  catalog, variants, image metadata, orders, order items and order status history.
  RLS is enabled on every public table; public catalog reads are policy-controlled,
  customer order reads are limited to their own orders, and admin writes use the
  `is_admin()` helper.
- **Seed data:** local seed rows are explicitly labelled placeholders, not real
  Nyanopan products or prices.
- **Type and framework alignment:** database relationship metadata was added to
  the Supabase TypeScript types, and the request hook uses the Next.js 16 `proxy.ts`
  convention instead of deprecated `middleware.ts`.

### Verification

- `npx supabase status` — local stack available; no hosted project linked.
- `npx supabase migration list --local` — initial migration applied.
- `npx supabase db lint --local --schema public --level error` — pass, no schema
  errors.
- Read-only database queries — 4 placeholder categories and 4 placeholder
  products present; all 8 public tables have RLS enabled and at least one policy.
- `npm run lint` and `npx tsc --noEmit` — pass.
- `npm run build` — attempted, but Turbopack could not bind a local port in this
  environment. The Webpack fallback also could not parse TypeScript's
  `--showConfig` output, so a production build remains unverified here.

### Decisions and remaining inputs

- Local Supabase is the development target; no hosted project credentials or live
  services were configured.
- Replace placeholder catalog rows with owner-verified product details before
  presenting them as real products. Product photography is still pending.

## Milestone 3 — complete (2026-10-17)

### Delivered

- **Home catalog:** the homepage now streams a four-product selection from the
  active Supabase catalog, with a loading skeleton and clear unavailable/empty
  states.
- **Catalog route:** `/products` displays active products and supports server-side
  category, product-name search, price-range and sort filters through URL query
  parameters. Invalid categories return an empty state.
- **Product details:** `/products/[slug]` reads active products from the DAL,
  displays the catalog description, NPR price, stock availability and active
  variants, and returns the not-found UI for missing or inactive slugs.
- **Reusable storefront UI:** product cards, accessible GET filter controls, and
  route-specific loading and error states were added. No add-to-cart behavior was
  added; cart interactions belong to Milestone 4.

### Decisions and remaining inputs

- Stitch demo photos, ratings, reviews, color claims and batch claims were excluded.
  Cards and detail pages show a labeled photo placeholder until Nyanopan provides
  images and the Storage bucket is configured.
- The local database still contains clearly labelled sample rows. Supply verified
  product names, descriptions, prices, sizes and stock before launch.

### Verification

- `npm run lint` — pass.
- `npx tsc --noEmit` — pass.
- Local HTTP smoke checks — home, catalog, filtered catalog and active product
  detail returned 200; a missing slug rendered the not-found UI and `noindex`.
- `npm run build` — attempted in sandbox and with elevated execution; Turbopack
  fails while binding a local port (`Operation not permitted`). Production build
  remains unverified in this environment.

## Known gaps / pending inputs from the owner

- Real product catalog data (names, descriptions, prices, sizes, stock) — replace the sample rows before launch.
- Product photography — drop into `public/images/products/`.
- Confirmation of the announcement-bar delivery policy and artisan-count claims.
- Supabase: local CLI setup is verified; hosted project later — only `.env` values change.
## Milestone 6 — complete (2026-10-17)

### Delivered

- **Checkout:** customer name and phone, province, district, municipality,
  ward, full address, optional delivery notes, COD and manual payment options.
- **Order creation:** a new additive migration expands payment methods, adds
  idempotency and confirmation-token fields, and defines a restricted
  security-definer RPC. It validates the request, locks products and variants,
  checks active/published status and stock, decrements inventory atomically,
  and writes database-derived paisa prices and item snapshots.
- **Privacy:** anonymous table reads for orders, order items and status history
  are revoked. Confirmation uses a hashed, random bearer token and exposes only
  the order code, totals and payment state. Contact/address details never appear
  in API output or the receipt page.
- **Payments:** COD and manual methods both begin with an unpaid status. Optional
  manual instructions use the server-only `MANUAL_PAYMENT_INSTRUCTIONS`
  environment variable; no payment is verified automatically.
- **Retry safety:** a repeated attempt with the same idempotency key and token
  returns the original order without reserving stock a second time. The browser
  retains attempt details only in memory, not local storage.
- **Tests/docs:** checkout field validation tests and a pgTAP database integration
  test were added. README and `.env.example` document setup.

### Verification

- `npm test` — pass (cart tests and checkout validation).
- `npm run lint` — pass.
- `npx tsc --noEmit` — pass.
- `git diff --check` — pass.
- Local checkout migration applied; `npx supabase test db` — pass (21 pgTAP
  assertions across catalog RLS and checkout integration tests).
- `npx supabase db lint --local --schema public --level error` — pass.

### Remaining configuration

- Delivery is stored as zero until the owner confirms delivery pricing.
- Supply verified manual payment instructions in a server-only environment
  variable before advertising manual payment.
## Milestone 7 — admin management

### Delivered

- Admin email/password sign-in at `/admin/login` and a protected console at
  `/admin`. There is no public admin registration.
- Server layouts and each API mutation validate the cookie-backed Supabase JWT
  and the profile role. The current user's profile role is a protected database
  authorization record; the public API cannot update or insert profiles. Trusted
  operators provision admins by account UUID as documented in README.
- Protected management for product and category create/read/update/delete,
  product active/published state, base and variant stock, and product image
  uploads. Uploads validate JPEG, PNG, WebP or AVIF signatures and a 5 MiB cap,
  then use the request-bound authenticated client and existing private Storage
  policies. No service-role key is used.
- Admin validation unit tests and database tests for denied customer writes,
  role-promotion denial, and successful admin catalog writes.

### Verification

- Local admin migration applied; `npx supabase test db` — pass (35 assertions
  across admin access, catalog RLS and checkout).
- `npx supabase db lint --local --schema public --level error` — pass.
- `npm test`, `npm run lint` and `npx tsc --noEmit` — pass.
- `npm run build` — blocked by Turbopack's CSS worker failing to bind a local
  port (`Operation not permitted`), including outside the sandbox.
