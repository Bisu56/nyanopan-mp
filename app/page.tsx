import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Footprints,
  Gift,
  Home,
  ImageOff,
  Shirt,
  Sparkles,
  BadgeCheck,
  Banknote,
  PackageCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FeaturedProducts } from "@/components/products/featured-products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/*
 * Home page — hero and trust strip ported from the Stitch design
 * (designs/src/views/HomeView.tsx).
 *
 * Demo testimonials and photography from Stitch were excluded. Product photos
 * use uploaded catalog assets when available and an honest placeholder otherwise.
 */

const trustItems = [
  { icon: BadgeCheck, title: "Current catalog", subtitle: "Product details from the shop" },
  { icon: Banknote, title: "NPR pricing", subtitle: "Prices shown in Nepali rupees" },
  { icon: PackageCheck, title: "Availability checks", subtitle: "Stock rechecked at checkout" },
  { icon: Sparkles, title: "Payment choices", subtitle: "COD or manual payment" },
] as const;

const collections = [
  {
    icon: Footprints,
    title: "Felt Footwear",
    description: "Browse available felt footwear in the current catalog.",
    href: "/products?category=footwear",
  },
  {
    icon: Home,
    title: "Home Decor",
    description: "Browse available felt home goods in the current catalog.",
    href: "/products?category=home-decor",
  },
  {
    icon: Shirt,
    title: "Accessories",
    description: "Browse available felt accessories in the current catalog.",
    href: "/products?category=accessories",
  },
  {
    icon: Gift,
    title: "Gifting",
    description: "Browse products listed in the gifting collection.",
    href: "/products?category=gifting",
  },
] as const;

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative w-full overflow-hidden pb-12 pt-4">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 pt-4 lg:grid-cols-12 lg:gap-12 lg:pt-8">
            {/* Editorial copy */}
            <div className="z-10 flex flex-col items-start lg:col-span-7">
              <Badge tone="neutral" className="mb-6 uppercase tracking-wider">
                <span aria-hidden className="h-2 w-2 rounded-full bg-secondary" />
                Handcrafted wool felt goods from Nepal
              </Badge>

              <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-on-surface sm:text-5xl lg:text-[56px] lg:leading-[64px]">
                Warmth Crafted by
                <br />
                <span className="font-normal italic text-primary">Himalayan Hands.</span>
              </h1>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                Browse the current collection of handcrafted wool felt products. Product details,
                prices, and availability come from the Nyanopan catalog.
              </p>

              <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  href="/products?category=footwear"
                  className={buttonClassName({ size: "lg" })}
                >
                  Explore Footwear Collection
                  <ArrowRight aria-hidden className="h-[18px] w-[18px]" />
                </Link>
                <Link href="/story" className={buttonClassName({ variant: "secondary", size: "lg" })}>
                Read our story
                </Link>
              </div>

              <p className="mt-7 border-t border-surface-container-highest pt-5 text-sm text-on-surface-variant">
                Explore current products, prices, and availability in the shop.
              </p>
            </div>

            {/* Visual showcase — branded placeholder until Nyanopan photography arrives */}
            <div className="relative mt-6 lg:col-span-5 lg:mt-0">
              <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-surface-container-highest bg-surface-container-low p-8 text-center shadow-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
                  <ImageOff aria-hidden className="h-7 w-7" />
                </span>
                <p className="text-sm font-semibold text-on-surface">
                  Product photography
                </p>
                <p className="max-w-[16rem] text-xs leading-relaxed text-on-surface-variant">
                Product photos appear here when available in the catalog.
                </p>

              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="w-full border-y border-surface-container-highest bg-surface-container-low py-8">
        <Container>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {trustItems.map((item) => (
              <li
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-surface-container-highest bg-white/70 p-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
                  <item.icon aria-hidden className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-xs font-bold text-on-surface">{item.title}</h2>
                  <p className="truncate text-[11px] text-on-surface-variant">
                    {item.subtitle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Collections */}
      <section className="w-full py-16">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
                Curation
              </span>
              <h2 className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
                Crafted for Mindful Living
              </h2>
            </div>
            <p className="max-w-md text-sm text-on-surface-variant">
              Browse the products currently listed across the shop&apos;s collections.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <li key={collection.title}>
                <Link
                  href={collection.href}
                  className="group flex h-full flex-col rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-6 shadow-xs transition-all hover:shadow-md"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary transition-colors group-hover:bg-primary-fixed">
                    <collection.icon aria-hidden className="h-6 w-6" />
                  </span>
                  <h3 className="mb-1 font-serif text-lg font-bold text-on-surface">
                    {collection.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">
                    {collection.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles aria-hidden className="h-3.5 w-3.5" />
                    Browse the collection
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Suspense
        fallback={
          <Container className="py-14" role="status" aria-label="Loading products">
            <div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-surface-container-high" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-surface-container-high" />
              ))}
            </div>
            <span className="sr-only">Loading products…</span>
          </Container>
        }
      >
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
