import Link from "next/link";
import { Compass } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Branded 404 page. */
export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-surface-container-highest bg-surface-container-low px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
          <Compass aria-hidden className="h-7 w-7" />
        </span>
        <h1 className="font-serif text-2xl font-bold text-on-surface">Page not found</h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          The page you are looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get
          you back to the workshop.
        </p>
        <Link href="/" className={buttonClassName()}>
          Return home
        </Link>
      </div>
    </Container>
  );
}
