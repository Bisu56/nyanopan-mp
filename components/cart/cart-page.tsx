"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { cartLineKey, MAX_CART_QUANTITY } from "@/lib/cart/model.mjs";
import { formatNpr } from "@/lib/format";

type QuoteItem = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string | null;
  quantity: number;
  pricePaisa: number;
  stockQuantity: number;
  lineSubtotalPaisa: number;
};

type QuoteIssue = {
  productId: string;
  variantId: string | null;
  code: string;
  message: string;
};

type CartQuote = {
  valid: boolean;
  items: QuoteItem[];
  issues: QuoteIssue[];
  subtotalPaisa: number;
};

const EMPTY_CART_QUOTE: CartQuote = {
  valid: true,
  items: [],
  issues: [],
  subtotalPaisa: 0,
};

export function CartPage() {
  const { lines, ready, setQuantity, removeItem } = useCart();
  const [quoteState, setQuoteState] = useState<{
    key: string;
    quote?: CartQuote;
    error?: string;
  } | null>(null);
  const [quoteAttempt, setQuoteAttempt] = useState(0);
  const cartSignature = JSON.stringify(lines);
  const requestKey = `${cartSignature}:${quoteAttempt}`;

  useEffect(() => {
    if (!ready || cartSignature === "[]") return;

    const controller = new AbortController();

    fetch("/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: JSON.parse(cartSignature) }),
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "We could not check your bag.");
        setQuoteState({ key: requestKey, quote: payload as CartQuote });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setQuoteState({
          key: requestKey,
          error: error instanceof Error ? error.message : "We could not check your bag.",
        });
      })

    return () => controller.abort();
  }, [cartSignature, ready, requestKey]);

  const currentQuoteState = quoteState?.key === requestKey ? quoteState : null;
  const quote = useMemo(
    () => lines.length === 0 ? EMPTY_CART_QUOTE : currentQuoteState?.quote ?? null,
    [lines.length, currentQuoteState],
  );
  const quoteError = currentQuoteState?.error ?? "";
  const loadingQuote = ready && lines.length > 0 && !currentQuoteState;

  const itemByKey = useMemo(
    () => new Map((quote?.items ?? []).map((item) => [cartLineKey(item), item])),
    [quote],
  );
  const issueByKey = useMemo(
    () => new Map((quote?.issues ?? []).map((issue) => [cartLineKey(issue), issue])),
    [quote],
  );

  if (!ready) {
    return (
      <Container className="py-16" aria-busy="true">
        <p role="status" className="text-sm text-on-surface-variant">Loading your saved bag…</p>
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <header className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-on-surface md:text-4xl">Your Shopping Bag</h1>
        </header>
        <EmptyState
          icon={<ShoppingBag aria-hidden className="h-7 w-7" />}
          title="Your bag is empty"
          description="Find a handmade favourite and add it to your bag. Your bag is saved on this device for your next visit."
          action={<Link href="/products" className={buttonClassName()}>Explore the collection</Link>}
        />
      </Container>
    );
  }

  const subtotal = quote?.subtotalPaisa ?? 0;
  const hasIssues = !quote || !quote.valid || Boolean(quoteError);

  return (
    <Container className="py-8 pb-32 sm:py-12 sm:pb-12">
      <header className="mb-7 sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Your selections</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-on-surface md:text-4xl">Your Shopping Bag</h1>
      </header>

      {quoteError && (
        <p role="alert" className="mb-5 rounded-xl border border-error-container bg-error-container/30 p-4 text-sm text-on-surface">
          {quoteError}{" "}
          <button type="button" className="font-bold underline" onClick={() => setQuoteAttempt((attempt) => attempt + 1)}>
            Try again
          </button>
        </p>
      )}
      {loadingQuote && <p role="status" className="mb-4 text-sm text-on-surface-variant">Checking current prices and availability…</p>}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <ul className="divide-y divide-surface-container-highest rounded-2xl border border-surface-container-highest bg-white px-4 sm:px-6">
          {lines.map((line) => {
            const key = cartLineKey(line);
            const item = itemByKey.get(key);
            const issue = issueByKey.get(key);
            const label = item?.name ?? "Unavailable product";
            const canIncrement = line.quantity < MAX_CART_QUANTITY && (!item || line.quantity < item.stockQuantity);

            return (
              <li key={key} className="py-5 sm:py-6">
                <div className="flex gap-4 sm:gap-5">
                  <div aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-3xl text-primary-fixed sm:h-28 sm:w-28">
                    <ShoppingBag className="h-8 w-8 opacity-50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {item ? (
                      <Link href={`/products/${item.slug}`} className="font-serif text-base font-bold text-on-surface hover:text-primary sm:text-lg">
                        {item.name}
                      </Link>
                    ) : (
                      <p className="font-serif text-base font-bold text-on-surface sm:text-lg">Unavailable product</p>
                    )}
                    {item?.variantLabel && <p className="mt-1 text-sm text-on-surface-variant">Option: {item.variantLabel}</p>}
                    {item && <p className="mt-2 text-sm font-semibold text-primary">{formatNpr(item.pricePaisa)} each</p>}
                    {issue && <p role="alert" className="mt-2 text-xs leading-relaxed text-error">{issue.message}</p>}
                    {!item && !issue && <p className="mt-2 text-xs text-on-surface-variant">Remove this item and choose another product.</p>}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex h-10 items-center rounded-lg border border-outline-variant" aria-label={`Quantity for ${label}`}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${label}`}
                          disabled={line.quantity <= 1}
                          onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                          className="grid h-10 w-10 place-items-center rounded-l-lg text-on-surface hover:bg-surface-container disabled:opacity-40"
                        >
                          <Minus aria-hidden className="h-4 w-4" />
                        </button>
                        <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${label}`}
                          disabled={!canIncrement}
                          onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                          className="grid h-10 w-10 place-items-center rounded-r-lg text-on-surface hover:bg-surface-container disabled:opacity-40"
                        >
                          <Plus aria-hidden className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId, line.variantId, label)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-error focus-visible:outline-2 focus-visible:outline-error"
                      >
                        <Trash2 aria-hidden className="h-4 w-4" /> Remove
                      </button>
                      {item && <span className="ml-auto text-sm font-bold text-on-surface">{formatNpr(item.lineSubtotalPaisa)}</span>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="hidden h-fit rounded-2xl border border-surface-container-highest bg-white p-6 lg:block">
          <h2 className="font-serif text-xl font-bold">Bag summary</h2>
          <div className="mt-5 flex justify-between border-t border-surface-container-highest pt-4 text-base font-bold">
            <span>Subtotal</span><span>{formatNpr(subtotal)}</span>
          </div>
          <p aria-live="polite" className="mt-3 text-xs leading-relaxed text-on-surface-variant">
            {hasIssues ? "Resolve availability issues to continue." : "Prices and stock will be checked again before checkout."}
          </p>
          <button type="button" disabled className={`${buttonClassName({ variant: "primary", size: "lg" })} mt-5 w-full opacity-60`}>
            Checkout coming soon
          </button>
          <Link href="/products" className={`${buttonClassName({ variant: "secondary", size: "md" })} mt-3 w-full`}>
            Continue shopping
          </Link>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-container-highest bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(42,35,30,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-on-surface-variant">Subtotal</p>
            <p className="text-lg font-bold text-on-surface">{formatNpr(subtotal)}</p>
          </div>
          <button type="button" disabled className={`${buttonClassName({ variant: "primary", size: "md" })} min-w-44 opacity-60`}>
            Checkout coming soon
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-7xl text-center text-[11px] text-on-surface-variant" aria-live="polite">
          {hasIssues ? "Resolve availability issues to continue." : "Prices and stock will be checked again before checkout."}
        </p>
      </div>
    </Container>
  );
}
