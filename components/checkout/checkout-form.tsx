"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Container } from "@/components/ui/container";
import { buttonClassName } from "@/components/ui/button";
import { formatNpr } from "@/lib/format";

const provinces = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
type FormFields = {
  customerName: string; phone: string; province: string; district: string;
  municipality: string; ward: string; fullAddress: string; deliveryNotes: string;
  paymentMethod: "cod" | "manual";
};
const initial: FormFields = {
  customerName: "", phone: "", province: "", district: "", municipality: "",
  ward: "", fullAddress: "", deliveryNotes: "", paymentMethod: "cod",
};

export function CheckoutForm() {
  const { lines, ready, clearCart } = useCart();
  const router = useRouter();
  const [fields, setFields] = useState(initial);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [retry, setRetry] = useState(false);
  const inFlight = useRef(false);
  const submission = useRef<{ idempotencyKey: string; confirmationToken: string; payload: object } | null>(null);
  const [quote, setQuote] = useState<{ signature: string; subtotal: number } | null>(null);

  const signature = JSON.stringify(lines);
  useEffect(() => {
    if (!ready || !JSON.parse(signature).length) {
      return;
    }
    const controller = new AbortController();
    fetch("/api/cart/validate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: JSON.parse(signature) }), cache: "no-store", signal: controller.signal,
    }).then(async (r) => {
      const q = await r.json();
      if (r.ok && q.valid) setQuote({ signature, subtotal: q.subtotalPaisa });
      else if (!controller.signal.aborted) setQuote({ signature, subtotal: -1 });
    }).catch(() => { if (!controller.signal.aborted) setQuote({ signature, subtotal: -1 }); });
    return () => controller.abort();
  // signature captures cart changes; endpoint remains advisory and RPC is authoritative.
  }, [signature, ready]);
  const currentQuote = quote?.signature === signature && quote.subtotal >= 0 ? quote : null;

  function set<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    if (retry) setError("Retry this order attempt before changing details.");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || inFlight.current || retry) {
      if (retry && submission.current) await send(submission.current.payload);
      return;
    }
    const attempt = {
      idempotencyKey: crypto.randomUUID(),
      confirmationToken: crypto.randomUUID(),
      ...fields,
      items: lines,
    };
    const payload = {
      ...attempt,
    };
    submission.current = {
      idempotencyKey: attempt.idempotencyKey,
      confirmationToken: attempt.confirmationToken,
      payload,
    };
    await send(payload);
  }

  async function send(payload: object) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message ?? "Please check your order details.");
        setFieldErrors(result.fieldErrors ?? {});
        if (response.status >= 500) setRetry(true);
        else submission.current = null;
        return;
      }
      clearCart();
      submission.current = null;
      router.replace(result.confirmationPath);
    } catch {
      setRetry(true);
      setError("We could not confirm whether your order was placed. Retry safely to check the same attempt.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (!ready) return <Container className="py-16"><p role="status">Loading your bag…</p></Container>;
  if (!lines.length) return (
    <Container className="py-16">
      <h1 className="font-serif text-3xl font-bold">Checkout</h1>
      <p className="mt-4">Your bag is empty.</p>
      <Link className={buttonClassName({ className: "mt-6" })} href="/products">Explore products</Link>
    </Container>
  );

  const input = "mt-1 w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary";
  const label = "block text-sm font-semibold text-on-surface";
  const fieldError = (name: string) => fieldErrors[name] ? <span id={`${name}-error`} className="mt-1 block text-xs text-error">{fieldErrors[name]}</span> : null;
  const locked = pending || retry;
  return (
    <Container className="py-8 pb-20 sm:py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Secure checkout</p>
        <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">Delivery details</h1>
      </header>
      {error && <p role="alert" className="mb-6 rounded-xl border border-error-container bg-error-container/30 p-4 text-sm">{error}{retry && <button type="button" className="ml-2 font-bold underline" onClick={() => submission.current && send(submission.current.payload)}>Retry same order</button>}</p>}
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-7">
          <fieldset disabled={locked} className="space-y-5 rounded-2xl border border-surface-container-highest bg-white p-5 sm:p-7">
            <legend className="px-2 font-serif text-xl font-bold">Your information</legend>
            <div>
              <label className={label} htmlFor="customerName">Full name</label>
              <input className={input} id="customerName" autoComplete="name" maxLength={120} required value={fields.customerName} aria-describedby={fieldErrors.customerName ? "customerName-error" : undefined} onChange={(e) => set("customerName", e.target.value)} />
              {fieldError("customerName")}
            </div>
            <div>
              <label className={label} htmlFor="phone">Phone number</label>
              <input className={input} id="phone" type="tel" autoComplete="tel" maxLength={24} required value={fields.phone} aria-describedby={fieldErrors.phone ? "phone-error" : undefined} onChange={(e) => set("phone", e.target.value)} />
              {fieldError("phone")}
            </div>
          </fieldset>

          <fieldset disabled={locked} className="grid gap-5 rounded-2xl border border-surface-container-highest bg-white p-5 sm:grid-cols-2 sm:p-7">
            <legend className="px-2 font-serif text-xl font-bold">Delivery address</legend>
            <div>
              <label className={label} htmlFor="province">Province</label>
              <select className={input} id="province" required value={fields.province} onChange={(e) => set("province", e.target.value)}>
                <option value="">Select province</option>{provinces.map((p) => <option key={p}>{p}</option>)}
              </select>{fieldError("province")}
            </div>
            <div>
              <label className={label} htmlFor="district">District</label>
              <input className={input} id="district" autoComplete="address-level2" maxLength={100} required value={fields.district} onChange={(e) => set("district", e.target.value)} />{fieldError("district")}
            </div>
            <div>
              <label className={label} htmlFor="municipality">Municipality / rural municipality</label>
              <input className={input} id="municipality" maxLength={120} required value={fields.municipality} onChange={(e) => set("municipality", e.target.value)} />{fieldError("municipality")}
            </div>
            <div>
              <label className={label} htmlFor="ward">Ward number</label>
              <input className={input} id="ward" inputMode="numeric" maxLength={32} required value={fields.ward} onChange={(e) => set("ward", e.target.value)} />{fieldError("ward")}
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="fullAddress">Full address, landmark or tole</label>
              <textarea className={input} id="fullAddress" rows={3} maxLength={500} required value={fields.fullAddress} onChange={(e) => set("fullAddress", e.target.value)} />{fieldError("fullAddress")}
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="deliveryNotes">Delivery notes <span className="font-normal text-on-surface-variant">(optional)</span></label>
              <textarea className={input} id="deliveryNotes" rows={2} maxLength={500} value={fields.deliveryNotes} onChange={(e) => set("deliveryNotes", e.target.value)} />{fieldError("deliveryNotes")}
            </div>
          </fieldset>

          <fieldset disabled={locked} className="space-y-4 rounded-2xl border border-surface-container-highest bg-white p-5 sm:p-7">
            <legend className="px-2 font-serif text-xl font-bold">Payment method</legend>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-outline-variant p-4">
              <input type="radio" name="paymentMethod" checked={fields.paymentMethod === "cod"} onChange={() => set("paymentMethod", "cod")} />
              <span><strong className="block text-sm">Cash on delivery</strong><span className="text-xs text-on-surface-variant">Pay when your order arrives.</span></span>
            </label>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-outline-variant p-4">
              <input type="radio" name="paymentMethod" checked={fields.paymentMethod === "manual"} onChange={() => set("paymentMethod", "manual")} />
              <span><strong className="block text-sm">Manual payment</strong><span className="text-xs text-on-surface-variant">Payment instructions will appear after placing your order. Payment remains unverified until reviewed.</span></span>
            </label>
          </fieldset>
        </div>

        <aside className="h-fit rounded-2xl border border-surface-container-highest bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-bold">Order summary</h2>
          <p className="mt-4 text-sm text-on-surface-variant">{lines.reduce((n, line) => n + line.quantity, 0)} items</p>
          <div className="mt-4 flex justify-between border-t border-surface-container-highest pt-4 text-sm"><span>Subtotal</span><span>{currentQuote ? formatNpr(currentQuote.subtotal) : "Checking…"}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span>Delivery</span><span>Confirmed after order</span></div>
          <p className="mt-3 text-xs text-on-surface-variant">The latest prices and stock are checked atomically when you place your order.</p>
          <button className={buttonClassName({ variant: "primary", size: "lg", className: "mt-6 w-full" })} type="submit" disabled={locked || !currentQuote}>
            {pending ? "Placing order…" : retry ? "Retry same order" : "Place order"}
          </button>
          <Link className={buttonClassName({ variant: "secondary", className: "mt-3 w-full" })} href="/cart">Return to bag</Link>
        </aside>
      </form>
    </Container>
  );
}

