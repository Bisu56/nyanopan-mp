"use client";

import { useEffect } from "react";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);

  return (
    <Container className="py-20">
      <section className="mx-auto max-w-lg rounded-2xl border border-error-container bg-error-container/30 p-8 text-center" role="alert">
        <h1 className="font-serif text-2xl font-bold text-on-surface">We couldn&apos;t load the catalog</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Please try again. Your filters will remain in the address bar.</p>
        <button type="button" onClick={reset} className={`${buttonClassName()} mt-5`}>
          Try again
        </button>
      </section>
    </Container>
  );
}
