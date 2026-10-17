import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Shopping Bag",
};

/** Placeholder cart (Milestone 1) — the real cart ships in Milestone 4. */
export default function CartPage() {
  return (
    <Container className="py-16">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
          Your Shopping Bag
        </h1>
      </header>

      <EmptyState
        icon={<ShoppingBag aria-hidden className="h-7 w-7" />}
        title="Your bag is empty"
        description="Add handmade felt favourites from the catalog and they will appear here. The shopping bag itself arrives in an upcoming milestone."
        action={
          <Link href="/products" className={buttonClassName()}>
            Explore the collection
          </Link>
        }
      />
    </Container>
  );
}
