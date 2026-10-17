/**
 * Site-wide configuration and navigation.
 *
 * Single source of truth for brand strings and navigation so the header,
 * footer and future pages never drift apart. Category filters point at
 * `/products?category=...`; Milestone 3 makes the catalog read that query
 * parameter.
 */

export const siteConfig = {
  name: "Nyanopan",
  tagline: "Handcrafted Wool Feltcraft & Footwear",
  description:
    "Ethically handmade wool felt slippers, boots, and mindful living goods shaped with pure New Zealand wool and Kathmandu heritage craft.",
  announcement:
    "Handcrafted in the Kathmandu Valley • Free delivery inside Ring Road on orders above NPR 2,500 • Worldwide Artisan Shipping",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/**
 * Evaluated once at module load, not during render — Cache Components forbids
 * `new Date()` inside prerendered components because it changes between
 * renders. A deploy/build refreshes it, which is frequent enough for a
 * copyright year.
 */
export const copyrightYear = new Date().getFullYear();

export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: readonly NavLink[] = [
  { label: "Shop All", href: "/products" },
  { label: "Felt Footwear", href: "/products?category=footwear" },
  { label: "Home Decor", href: "/products?category=home-decor" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Gifting", href: "/products?category=gifting" },
  { label: "Artisan Story", href: "/story" },
] as const;
