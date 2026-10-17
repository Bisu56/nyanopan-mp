import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { copyrightYear, siteConfig } from "@/lib/site";

/**
 * Site footer ported from the Stitch design (designs/src/components/Footer.tsx).
 *
 * Release 1 truthfulness: only Cash on Delivery is advertised as accepted —
 * the design's eSewa/Khalti/Fonepay badges return in Milestone 9 once a real
 * payment integration exists (the owner decided: COD only for release 1).
 */
const collectionLinks = [
  { label: "Wool Felt Slippers", href: "/products?category=footwear" },
  { label: "Cozy Indoor Boots", href: "/products?category=footwear" },
  { label: "Felt Ball Rugs", href: "/products?category=home-decor" },
  { label: "Trivets & Coasters", href: "/products?category=home-decor" },
  { label: "Felted Pet Caves", href: "/products?category=home-decor" },
  { label: "Wool Dryer Balls", href: "/products?category=accessories" },
];

const craftLinks = [
  { label: "Our Kathmandu Workshop", href: "/story" },
  { label: "100% Himalayan & NZ Wool", href: "/story" },
  { label: "Fair Trade Practices", href: "/story" },
];

const careLinks = [
  { label: "Delivery across 7 Provinces", href: "/products" },
  { label: "Track My Order", href: "/cart" },
  { label: "Shopping Bag", href: "/cart" },
];

function FooterColumn({ title, links }: { title: string; links: typeof collectionLinks }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">
        {title}
      </h3>
      <ul className="space-y-2 text-xs text-on-surface-variant">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 w-full border-t border-surface-container-highest bg-surface-container-low text-on-surface">
      <Container className="pb-8 pt-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              {siteConfig.name}
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
              Made with care. Rooted in Nepal. Empowering local women artisans through
              ethically handmade wool felt footwear and mindful home goods.
            </p>
            <p className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <BadgeCheck aria-hidden className="h-[18px] w-[18px]" />
              Authentic Craft of Patan &amp; Kathmandu
            </p>
          </div>

          <div className="lg:col-span-3">
            <FooterColumn title="Shop Collections" links={collectionLinks} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Artisan & Craft" links={craftLinks} />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn title="Customer Care & Nepal Delivery" links={careLinks} />
          </div>
        </div>

        {/* Payments + copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-container-highest pt-6 md:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-on-surface-variant">
              Payments accepted in Nepal:
            </span>
            <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant shadow-xs">
              Cash on Delivery (COD)
            </span>
            <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-medium text-outline shadow-xs">
              Digital wallets coming soon
            </span>
          </div>
          <p className="text-center text-xs text-on-surface-variant md:text-right">
            © {copyrightYear} {siteConfig.name} Handcrafted. Kathmandu, Nepal.
          </p>
        </div>
      </Container>
    </footer>
  );
}
