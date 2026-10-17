"use client";

import { useEffect } from "react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Global error boundary (engineering rule #7).
 * Rendered instead of the whole tree when a route throws. The `reset()`
 * re-renders the failed segment without a full page reload.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a later milestone this will report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-error-container bg-error-container/40 px-6 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-on-surface">
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          An unexpected error occurred while loading this page. Please try again — if the
          problem continues, contact us with the order or page you were visiting.
        </p>
        <button type="button" onClick={reset} className={buttonClassName()}>
          Try again
        </button>
      </div>
    </Container>
  );
}
