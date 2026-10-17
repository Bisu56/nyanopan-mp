import { createHash } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { formatNpr } from "@/lib/format";
import { Container } from "@/components/ui/container";
import { buttonClassName } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) notFound();
  const hash = createHash("sha256").update(token).digest("hex");
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("get_order_confirmation", { p_confirmation_token_hash: hash });
  const order = data?.[0];
  if (error || !order) notFound();
  const manualInstructions = process.env.MANUAL_PAYMENT_INSTRUCTIONS?.trim();

  return (
    <Container className="py-16 sm:py-24">
      <section className="mx-auto max-w-xl rounded-2xl border border-surface-container-highest bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Order received</p>
        <h1 className="mt-3 font-serif text-3xl font-bold">Thank you for your order</h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">Your order is pending confirmation. Keep this private page link to view your confirmation again.</p>
        <div className="my-7 rounded-xl bg-surface-container-low p-5 text-left">
          <p className="text-xs text-on-surface-variant">Order number</p>
          <p className="mt-1 text-lg font-bold">{order.order_code}</p>
          <div className="mt-4 flex justify-between text-sm"><span>Subtotal</span><span>{formatNpr(order.subtotal_paisa)}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span>Delivery</span><span>{order.delivery_paisa === 0 ? "To be confirmed" : formatNpr(order.delivery_paisa)}</span></div>
          <div className="mt-3 flex justify-between border-t border-outline-variant pt-3 font-bold"><span>Total</span><span>{formatNpr(order.total_paisa)}*</span></div>
        </div>
        {order.payment_method === "manual" ? (
          <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 text-left">
            <h2 className="font-bold">Manual payment instructions</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{manualInstructions || "Payment instructions are not available yet. Please wait for verified instructions before sending any funds."}</p>
            <p className="mt-3 text-xs font-semibold text-on-surface-variant">Payment status: {order.payment_status}. We never mark manual payments as received automatically.</p>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">Cash on delivery. Payment is due when the order arrives.</p>
        )}
        <p className="mt-5 text-xs text-on-surface-variant">*Delivery charge will be confirmed by the shop before dispatch.</p>
        <Link className={buttonClassName({ className: "mt-7" })} href="/products">Continue shopping</Link>
      </section>
    </Container>
  );
}
