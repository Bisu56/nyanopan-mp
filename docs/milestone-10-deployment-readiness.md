# Milestone 10 — deployment readiness

## Proposed target and compatibility

No hosting provider, linked Vercel project, production Supabase project, domain,
or DNS configuration is present in this repository. This runbook uses **Vercel
as a proposed target**, based on the Next.js App Router stack; the owner should
confirm the host before creating/linking a project or deploying.

The app uses Next.js server-rendered pages, request-time `headers()`/cookies,
Route Handlers for cart validation, checkout and admin APIs, Node.js crypto, and
request-bound Supabase SSR clients. Vercel's Next.js integration supports server
rendering and Node.js functions, so these features fit. Vercel's standard
`next/image` optimization is intentionally bypassed for product photos: the app
uses private-bucket signed URLs that expire, and it avoids proxying/caching those
personalized URLs through an image transform service. Vercel's optimization
could be revisited only with a design that preserves the private-object access
boundary. Use Node.js 22 or newer to satisfy the checked-in engine and Supabase
client requirements.

## Environment configuration

Set these in the hosting provider's **Production** environment, then redeploy;
provider environment changes do not alter existing deployments.

| Name | Value / handling |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase project's API URL. Public config, not a secret. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production publishable/anon key. Public by design; RLS must remain enabled. |
| `NEXT_PUBLIC_SITE_URL` | Exact canonical HTTPS origin, e.g. `https://shop.example.com`; no trailing slash. |
| `MANUAL_PAYMENT_INSTRUCTIONS` | Leave blank until the owner approves and verifies instructions. No live gateway is configured. |

Do not define a service-role key in any `NEXT_PUBLIC_` variable. This app's
catalog/admin code uses the caller's session and RLS; it does not need a
service-role key. Do not copy local Supabase values or `.env.local` into
Production. Keep Preview connected only to a separate staging Supabase project
and use test-only catalog/order data. Restrict access to Production variables;
save sensitive values in the provider's encrypted variable store and rotate them
if they are exposed. Never place secrets in git, build logs, screenshots or this
runbook.

## Supabase production preparation

1. Create a separate production Supabase project in the owner-selected region;
   record the project reference and API URL in the owner's password manager.
2. Confirm a recent backup and inspect current migration history before applying
   migrations. Link the CLI only from an authorized operator's workstation and
   review `supabase migration list` before `supabase db push`. Apply migrations
   only; do **not** pass `--include-seed`, because `supabase/seed.sql` is demo
   data. Verify RLS, grants, `is_admin()` policies, Storage bucket privacy, and
   the public-active-published product filters in the hosted project afterward.
3. In Supabase Auth URL Configuration, set Site URL to the exact canonical
   `NEXT_PUBLIC_SITE_URL`. Allow that exact production origin/path as needed.
   Keep localhost and preview wildcards out of the production allowlist unless
   operationally required; if preview auth is needed, use a staging project.
4. In Auth settings, disable public email signup (`enable_signup = false`),
   require confirmed email for accounts, use a strong password policy, and
   configure production SMTP only if account email flows are needed. There is no
   public admin-signup UI. Provision one owner-controlled account, verify it,
   then promote its trusted Auth UUID to `profiles.role = 'admin'` using the
   documented operator SQL. Test a non-admin denial and admin success before
   opening the console to staff. Keep at least two trusted operators with
   recovery access if the owner wants operational continuity; remove access
   promptly when roles change.
5. Review Supabase Security Advisor, Auth rate limits/bot controls, database
   network/security settings, Storage policies, and project logs. Confirm order
   PII is available only to authorized admin sessions and retention/access
   responsibilities are documented. No service-role key is part of app runtime.

The app currently has no order email/SMS notification integration. Admins must
inspect `/admin/orders` manually until a notification mechanism is implemented
and tested; do not promise order alerts to customers or staff.

## Domain, DNS, and HTTPS

After the host and domain owner are confirmed, add the domain to the host and
inspect the exact records requested by that project. The owner or DNS operator
must make the change at the current DNS provider. For Vercel, its general
examples are an A record for the apex and a CNAME for a subdomain, but use the
project-specific values from Vercel's domain inspection. Preserve existing
email-related MX/TXT records. Do not change nameservers as a shortcut. Verify
domain ownership and DNS before changing production traffic. Vercel provisions
TLS after domain verification; check the certificate and redirect HTTP to HTTPS.
Update `NEXT_PUBLIC_SITE_URL` and Supabase Auth Site URL/allowlists to the final
HTTPS origin, then redeploy and verify canonical, sitemap and robots URLs.

## Production release and rollback

1. Confirm the production build and all gates below pass in a Node 22+ CI or
   supported build environment. Create a Preview/staging deployment first, with
   staging-only Supabase variables. Do not share a real production database with
   untrusted Preview deployments.
2. Back up Supabase and record the current migration head and known-good hosting
   deployment. Apply reviewed additive database migrations before deploying code
   that depends on them. Avoid destructive schema changes; use expand/migrate/
   contract across separate releases.
3. Deploy the app to Preview and complete the end-to-end checks below. Production
   deploy remains an explicit owner action after review. No deployment has been
   initiated by this milestone.
4. If application behavior regresses, point production back to the prior known-
   good deployment using the host's rollback function and verify health. A code
   rollback does **not** reverse Supabase schema/data changes or environment
   changes. For database incidents, stop writes if needed, assess restore-point
   loss, then restore from the chosen backup/PITR or use a reviewed forward-fix.
   Test database recovery in staging first; document who may authorize a
   production restore because it can overwrite newer orders.
5. Keep the previous deploy identifier, migration head, backup timestamp, and
   incident notes together. Re-run smoke checks after rollback and communicate
   any order/data gap to the owner.

## End-to-end release checklist

- [ ] Host and plan confirmed; production and staging environments separated;
  Node.js 22+ selected.
- [ ] Production build, lint, type-check, unit tests, Supabase migration tests,
  database lint and dependency checks pass. Resolve the current local production
  build blocker in supported CI before release.
- [ ] Production Supabase migrations reviewed, backed up and applied without
  demo seed data; RLS, grants, Storage policies and Security Advisor reviewed.
- [ ] Auth production URL, exact allowed redirects, disabled public signup,
  confirmed operator account and admin-role UUID reviewed. Test admin and
  non-admin access.
- [ ] Production env vars set only in the host's protected Production scope;
  Preview uses staging credentials; no service-role secret is exposed.
- [ ] Browse home, catalog filters, product details, missing/empty/error states,
  sitemap and robots; check canonical/product metadata and signed image expiry.
- [ ] Test phone, tablet and desktop navigation and catalog/cart rendering.
- [ ] Test full mobile checkout with an explicitly approved, clearly identified
  test order in staging; verify current prices/stock and server-computed totals,
  duplicate-submit handling, confirmation privacy, cancellation stock restore,
  and that manual payment remains unverified. Do not place a production test
  order unless the owner approves the resulting customer/order record.
- [ ] Verify admin can search/filter and open orders, update order/payment status,
  and cannot perform invalid transitions; verify customer PII is absent from
  public endpoints/pages and non-admin users are denied.
- [ ] Decide how staff will notice new orders. Notification delivery is not
  implemented; configure and test an approved provider or explicitly assign
  manual order monitoring before launch.
- [ ] Confirm no live payment provider is configured or enabled. Keep manual
  payment instructions blank until the owner approves; approve COD operations
  separately before public launch.
- [ ] Confirm backup schedule/retention for the selected Supabase plan, take a
  pre-release backup, and rehearse restore/PITR plus application rollback in
  staging. Verify media recovery expectations for the private Storage bucket.
- [ ] Domain owner applies reviewed DNS records; verify DNS, HTTPS certificate,
  HTTP-to-HTTPS redirect, canonical URL, auth origin, security headers and
  production smoke checks.
- [ ] Record support contact, incident owner, order-notification plan, rollback
  deployment ID, migration head and latest restorable backup before launch.

## Official guidance reviewed

- [Vercel: Next.js framework integration](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Vercel: Environment variables](https://vercel.com/docs/environment-variables)
- [Vercel: Custom domain setup](https://vercel.com/docs/domains/set-up-custom-domain)
- [Vercel: Function runtimes and durations](https://vercel.com/docs/functions/runtimes)
- [Vercel: Production rollback](https://vercel.com/docs/cli/rollback)
- [Supabase: Production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Supabase: Auth redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase: Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase: Database backups](https://supabase.com/docs/guides/platform/backups)
