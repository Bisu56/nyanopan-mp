import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Artisan Story",
  description: "The people and heritage craft behind Nyanopan's handmade felt goods.",
};

/**
 * Placeholder artisan-story page (Milestone 1).
 * No story copy is written here on purpose: business history and artisan
 * details must be supplied and verified by the owner (engineering rule #8 —
 * never invent real product or business information).
 */
export default function StoryPage() {
  return (
    <Container className="py-16">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
          Our Artisan Story
        </h1>
      </header>

      <EmptyState
        icon={<BookOpen aria-hidden className="h-7 w-7" />}
        title="Story page coming soon"
        description="A full page about the Kathmandu workshop, the women-led collective and the wet-felting craft is planned for a later milestone — written from materials you provide, never invented."
        action={
          <Link href="/products" className={buttonClassName({ variant: "secondary" })}>
            Browse the catalog
          </Link>
        }
      />
    </Container>
  );
}
