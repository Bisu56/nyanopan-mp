import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse Nyanopan's handmade wool felt footwear, home decor and accessories.",
};

/**
 * Placeholder catalog (Milestone 1).
 * Milestone 3 replaces this with the Supabase-backed product grid, category
 * filters (`?category=...`), search and pagination — with loading/empty/error
 * states around the data itself.
 */
export default function ProductsPage() {
  return (
    <Container className="py-16">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
          Shop All
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
          Felt footwear, home decor, accessories and gifting — hand-shaped in the Kathmandu
          Valley.
        </p>
      </header>

      <EmptyState
        icon={<Store aria-hidden className="h-7 w-7" />}
        title="The catalog is being stocked"
        description="No products have been published yet. The storefront arrives in the next milestone, fed live from the Nyanopan catalog database."
        action={
          <Link href="/" className={buttonClassName({ variant: "secondary" })}>
            Back to home
          </Link>
        }
      />
    </Container>
  );
}
