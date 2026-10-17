import Link from "next/link";
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
  { label: "All products", href: "/products" },
  { label: "Footwear", href: "/products?category=footwear" },
  { label: "Home decor", href: "/products?category=home-decor" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Gifting", href: "/products?category=gifting" },
];

const craftLinks = [
  { label: "Artisan story", href: "/story" },
  { label: "How ordering works", href: "/products" },
];

const careLinks = [
  { label: "Checkout and payment", href: "/products" },
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
              Browse the current handcrafted wool felt catalog, with product details and prices
              provided by the shop.
            </p>
          </div>

          <div className="lg:col-span-3">
            <FooterColumn title="Shop Collections" links={collectionLinks} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Artisan & Craft" links={craftLinks} />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn title="Customer information" links={careLinks} />
          </div>
        </div>

        {/* Payments + copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-container-highest pt-6 md:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-on-surface-variant">Available at checkout:</span>
            <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant shadow-xs">
              Cash on Delivery (COD)
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
