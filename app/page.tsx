import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Footprints,
  Gift,
  Hand,
  Home,
  ImageOff,
  Leaf,
  Shirt,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/*
 * Home page — hero and trust strip ported from the Stitch design
 * (designs/src/views/HomeView.tsx).
 *
 * Excluded on purpose (engineering rule #8, no invented content):
 * - the design's testimonials (fabricated reviews with fake names)
 * - the design's featured-product grid (demo products with demo prices)
 * - hotlinked Google-hosted demo photography (not Nyanopan's assets)
 * Product grids and real photography arrive in Milestone 3.
 */

const trustItems = [
  { icon: Hand, title: "Handmade in Nepal", subtitle: "Kathmandu & Patan craft" },
  { icon: Droplets, title: "Chemical-Free Felting", subtitle: "Water, olive soap & sun" },
  { icon: Users, title: "Fair Wage Collective", subtitle: "Women-led social craft" },
  { icon: Truck, title: "Pan-Nepal & Global", subtitle: "7 Provinces & Worldwide" },
] as const;

const collections = [
  {
    icon: Footprints,
    title: "Felt Footwear",
    description: "Seamless slippers, mules and indoor boots felted to shape.",
    href: "/products?category=footwear",
  },
  {
    icon: Home,
    title: "Home Decor",
    description: "Felt ball rugs, trivets, coasters and pet caves for mindful homes.",
    href: "/products?category=home-decor",
  },
  {
    icon: Shirt,
    title: "Accessories",
    description: "Everyday wool felt goods, dryers balls and small treasures.",
    href: "/products?category=accessories",
  },
  {
    icon: Gift,
    title: "Gifting",
    description: "Thoughtful handcrafted gift sets, made in small artisan batches.",
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
                Handmade in the Patan Valley
              </Badge>

              <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-on-surface sm:text-5xl lg:text-[56px] lg:leading-[64px]">
                Warmth Crafted by
                <br />
                <span className="font-normal italic text-primary">Himalayan Hands.</span>
              </h1>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                Ethically handmade wool felt slippers, boots, and mindful living goods shaped
                with pure New Zealand wool and Kathmandu heritage craft. Made with care. Rooted
                in Nepal.
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
                  Discover Our Artisan Collective
                </Link>
              </div>

              {/* Metrics — brand claims carried over from the supplied design */}
              <dl className="mt-6 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-surface-container-highest pt-8">
                <div>
                  <dt className="sr-only">Natural highland wool</dt>
                  <dd>
                    <p className="font-serif text-2xl font-bold text-primary">100%</p>
                    <p className="text-xs text-on-surface-variant">Natural Highland Wool</p>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Women artisans</dt>
                  <dd>
                    <p className="font-serif text-2xl font-bold text-on-surface">84+</p>
                    <p className="text-xs text-on-surface-variant">Women Artisans</p>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Glues or synthetics</dt>
                  <dd>
                    <p className="font-serif text-2xl font-bold text-secondary">0</p>
                    <p className="text-xs text-on-surface-variant">Glues or Synthetics</p>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Visual showcase — branded placeholder until Nyanopan photography arrives */}
            <div className="relative mt-6 lg:col-span-5 lg:mt-0">
              <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-surface-container-highest bg-surface-container-low p-8 text-center shadow-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
                  <ImageOff aria-hidden className="h-7 w-7" />
                </span>
                <p className="text-sm font-semibold text-on-surface">
                  Studio photography arriving soon
                </p>
                <p className="max-w-[16rem] text-xs leading-relaxed text-on-surface-variant">
                  Product photos will be added to{" "}
                  <code className="rounded bg-surface-container px-1 py-0.5">
                    public/images/products/
                  </code>{" "}
                  and served from Supabase Storage.
                </p>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-surface-container-highest bg-white/95 p-4 shadow-xs backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Leaf aria-hidden className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface">100% Organic Wool</p>
                      <p className="text-[11px] text-on-surface-variant">
                        Lalitpur Heritage Workshop
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary-container px-2.5 py-1 text-[10px] font-bold text-on-secondary-container">
                    Hand-felted
                  </span>
                </div>
              </div>

              <div className="absolute -right-3 -top-3 hidden flex-col items-center rounded-xl border border-surface-container-highest bg-white px-3.5 py-2 shadow-md sm:flex">
                <span className="font-serif text-base font-bold italic text-primary">
                  Seamless
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Hand-Wet Felted
                </span>
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
              Explore our collections shaped by hand in small artisan batches using traditional
              wet compression.
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
    </div>
  );
}
