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
| Auth / Storage | Supabase Auth + Supabase Storage (Milestones 5 and 7) |
| Payments (release 1) | Cash on Delivery only; eSewa API integration deferred (Milestone 9) |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    then fill in the values printed by `npx supabase status` (Milestone 2)

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000.

### Local database

```bash
npx supabase start     # starts local Postgres/Auth/Storage (requires Docker)
npx supabase status    # prints the URL + keys for .env.local
npx supabase db reset  # re-runs all migrations + seed data
```

The local configuration, initial schema and placeholder seed data are included in
this repository; no `supabase init` step is needed. The schema and seed are applied
and verified locally.
The Supabase project is not linked to a hosted project; local CLI commands above
operate on the local development stack.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (fails on type errors) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
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

- All user input is validated on the **server** (Zod).
- Prices, stock and order totals are **never trusted** from the browser; they are
  re-read from the database and recomputed server-side in integer paisa.
- Privileged Supabase operations use the service-role key **only on the server**.
- Row Level Security is enabled on every table; public read, admin write.
- Secrets and `.env.local` are never committed (`.env.example` is the template).
- No real product data, reviews or business claims are invented; placeholder
  content is clearly labelled until the owner supplies verified material.

## Project status

See [`docs/implementation-status.md`](docs/implementation-status.md) for the
milestone-by-milestone status. The Stitch design reference lives in
[`designs/`](designs/) and is the source of truth for the visual language.
