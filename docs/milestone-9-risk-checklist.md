# Milestone 9 audit checklist

## Completed in this pass

- [x] Compared shipped page structure and content against the supplied Stitch
  storefront, while removing prototype testimonials, metrics, delivery promises,
  and craft claims that are not backed by current catalog or owner data.
- [x] Replaced the footer's false order-tracking link and reviewed internal
  storefront/admin links against the current route tree and category slugs.
- [x] Render uploaded product images on catalog, product, and admin screens using
  short-lived signed URLs. The Storage bucket remains private; the new RLS rule
  signs only files belonging to active, published products for public visitors.
  Broken or expired image URLs return to a labeled placeholder.
- [x] Added product metadata, canonical URLs, escaped Product/Offer JSON-LD,
  generated sitemap and robots rules. Checkout, cart, admin, and tokenized
  confirmation routes are marked private from indexing.
- [x] Added same-origin checks, bounded JSON request bodies, and a checkout
  honeypot. Checkout still validates through the trusted database function,
  which calculates totals and locks/decrements stock atomically.
- [x] Reviewed server authorization, RLS, order/payment RPCs, image Storage
  policies, PII output, and secret use. No service-role key was added to the
  browser; admin reads and writes remain request-bound and RLS protected.
- [x] Added conservative response headers and Escape handling/focus return for
  the mobile navigation. Checkout server validation errors are associated with
  their fields for assistive technology.

## Remaining risks / launch checklist

- [ ] Add shared server-side checkout rate limiting and a stronger bot control
  (for example, a provider-backed challenge). The honeypot and request-size
  bounds reduce simple abuse, but public `create_order` RPC access can bypass
  the Next.js route checks and a client can spoof `Origin`.
- [ ] Review production Supabase project settings and apply all local migrations;
  hosted-project role grants, Auth settings, Storage configuration, and RLS were
  not inspected from this workspace.
- [ ] Configure `NEXT_PUBLIC_SITE_URL` to the real HTTPS storefront domain and
  verify sitemap, robots, canonical metadata, OAuth callback hosts, and headers
  after deployment.
- [ ] Deploy on Node.js 22 or newer. The installed Supabase SSR peer requires
  `supabase-js` 2.114+, whose package engine requires Node 22; the current shell
  used Node 20.19.5.
- [ ] Supply owner-approved product photos and verified product descriptions,
  shipping, payment, and artisan-story content. Missing photos currently use an
  intentional placeholder; no demo image or fabricated testimonial is shipped.
- [ ] Confirm the delivery charge workflow. The stored delivery amount is zero
  until the shop confirms a rate, and the confirmation page explains this; the
  system does not yet collect a later delivery adjustment.
- [ ] Perform browser QA at phone/tablet/desktop widths, keyboard-only checkout
  and admin operation, and screen-reader checks. This pass used code inspection
  and automated checks; it did not use a browser automation or assistive-tech
  session.
- [ ] Run production traffic/load checks for the real catalog and signed image
  URLs, including expiration behavior and image upload dimensions/optimization.
- [ ] Review database retention, access logging, operational backups, and the
  privacy notice for customer names, phone numbers, addresses, and delivery notes.
- [ ] Resolve the five high npm audit findings in the development-only ESLint
  dependency chain when a compatible patched `braces` release is available.
  Current npm metadata offers a framework downgrade as its automatic fix; that
  downgrade was not applied. Runtime dependencies are checked separately.
