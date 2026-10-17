import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatNpr } from "@/lib/format";
import { OrderControls } from "@/components/admin/order-controls";
import type { OrderPaymentHistoryRow, OrderStatusHistoryRow } from "@/lib/supabase/types";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: order, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) return <p role="alert" className="rounded-xl bg-error-container/30 p-4 text-sm">Could not load this order.</p>;
  if (!order) notFound();
  const [{ data: items }, { data: statusHistory }, { data: paymentHistory }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
    supabase.from("order_payment_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);
  const address = order.shipping_address;
  return <section>
    <Link className="text-sm font-semibold text-primary hover:underline" href="/admin/orders">← All orders</Link>
    <div className="mt-4 flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-secondary">Order</p><h1 className="mt-1 font-serif text-3xl font-bold">{order.order_code}</h1><p className="mt-2 text-sm text-on-surface-variant">Placed {date(order.created_at)} · Updated {date(order.updated_at)}</p></div><div className="rounded-full bg-surface-container px-3 py-1.5 text-sm font-semibold">{label(order.status)}</div></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-surface-container-highest bg-white p-5"><h2 className="font-serif text-xl font-bold">Items</h2><ul className="mt-4 divide-y divide-surface-container-highest">{(items ?? []).map((item) => <li key={item.id} className="flex justify-between gap-4 py-3"><div><p className="font-semibold">{item.product_name}{item.size_label ? ` · ${item.size_label}` : ""}</p><p className="mt-1 text-sm text-on-surface-variant">{formatNpr(item.unit_price_paisa)} × {item.quantity}</p></div><p className="font-semibold">{formatNpr(item.line_total_paisa)}</p></li>)}</ul><div className="mt-4 space-y-2 border-t border-surface-container-highest pt-4 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{formatNpr(order.subtotal_paisa)}</span></p><p className="flex justify-between"><span>Delivery</span><span>{formatNpr(order.delivery_paisa)}</span></p><p className="flex justify-between text-base font-bold"><span>Total</span><span>{formatNpr(order.total_paisa)}</span></p></div></section>
        <section className="rounded-2xl border border-surface-container-highest bg-white p-5"><h2 className="font-serif text-xl font-bold">Customer and delivery</h2><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><Info label="Name" value={order.customer_name}/><Info label="Phone" value={order.customer_phone}/><Info label="Email" value={order.customer_email ?? "Not provided"}/><Info label="Province" value={address.province}/><Info label="District" value={address.district}/><Info label="Municipality" value={address.municipality}/><Info label="Ward" value={address.ward}/><div className="sm:col-span-2"><Info label="Full address" value={address.full_address}/></div><div className="sm:col-span-2"><Info label="Delivery notes" value={order.delivery_notes ?? "None"}/></div></dl></section>
        <section className="rounded-2xl border border-surface-container-highest bg-white p-5"><h2 className="font-serif text-xl font-bold">Order history</h2><History status={statusHistory ?? []} payment={paymentHistory ?? []}/></section>
      </div>
      <aside className="space-y-4"><OrderControls orderId={order.id} status={order.status} paymentStatus={order.payment_status}/><div className="rounded-2xl border border-surface-container-highest bg-white p-5"><h2 className="font-serif text-xl font-bold">Payment</h2><p className="mt-3 text-sm">{order.payment_method.toUpperCase()} · {label(order.payment_status)}</p><p className="mt-1 text-xs text-on-surface-variant">{order.paid_at ? `Confirmed ${date(order.paid_at)}` : "Payment has not been confirmed."}</p><p className="mt-3 text-xs text-on-surface-variant">Payment is tracked separately from order fulfilment.</p></div></aside>
    </div>
  </section>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>; }
function History({ status, payment }: { status: OrderStatusHistoryRow[]; payment: OrderPaymentHistoryRow[] }) {
  const events = [...status.map((e) => ({ kind: "Order status", from: e.from_status, to: e.to_status, at: e.created_at })), ...payment.map((e) => ({ kind: "Payment", from: e.from_status, to: e.to_status, at: e.created_at }))].sort((a, b) => b.at.localeCompare(a.at));
  return events.length === 0 ? <p className="mt-3 text-sm text-on-surface-variant">No history is available.</p> : <ol className="mt-4 space-y-3">{events.map((event, index) => <li key={`${event.kind}-${event.at}-${index}`} className="border-l-2 border-primary/30 pl-3"><p className="text-sm font-semibold">{event.kind}: {event.from ? `${label(event.from)} → ` : ""}{label(event.to)}</p><p className="mt-1 text-xs text-on-surface-variant">{date(event.at)}</p></li>)}</ol>;
}
function label(value: string) { return value[0].toUpperCase() + value.slice(1); }
function date(value: string) { return new Intl.DateTimeFormat("en-NP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kathmandu" }).format(new Date(value)); }
