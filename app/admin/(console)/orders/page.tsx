import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import type { OrderStatus, PaymentStatus } from "@/lib/supabase/types";
import { formatNpr } from "@/lib/format";

export const metadata = { robots: { index: false, follow: false } };

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const qRaw = typeof params.q === "string" ? params.q : "";
  const q = qRaw.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40);
  const status = typeof params.status === "string" && statuses.includes(params.status as OrderStatus) ? params.status as OrderStatus : "";
  const payment = params.payment === "paid" || params.payment === "unpaid" ? params.payment as PaymentStatus : "";
  const supabase = await createServerClient();
  let query = supabase.from("orders").select("id,order_code,status,payment_status,payment_method,total_paisa,created_at").order("created_at", { ascending: false }).limit(100);
  if (q) query = query.ilike("order_code", `%${q}%`);
  if (status) query = query.eq("status", status);
  if (payment) query = query.eq("payment_status", payment);
  const { data, error } = await query;
  const orders = data ?? [];
  return <section>
    <div className="mb-6"><p className="text-sm font-semibold uppercase tracking-wide text-secondary">Sales</p><h1 className="mt-2 font-serif text-3xl font-bold">Orders</h1><p className="mt-2 text-sm text-on-surface-variant">Search by order code. Customer contact details are only shown on an individual order.</p></div>
    <form className="mb-5 grid gap-3 rounded-2xl border border-surface-container-highest bg-white p-4 sm:grid-cols-[1fr_12rem_12rem_auto] sm:items-end" action="/admin/orders">
      <label className="grid gap-1 text-sm font-semibold">Order code<input name="q" defaultValue={qRaw} maxLength={40} className="rounded-xl border border-surface-container-highest px-3 py-2 font-normal" placeholder="NYA-…" /></label>
      <label className="grid gap-1 text-sm font-semibold">Order status<select name="status" defaultValue={status} className="rounded-xl border border-surface-container-highest px-3 py-2 font-normal"><option value="">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-semibold">Payment<select name="payment" defaultValue={payment} className="rounded-xl border border-surface-container-highest px-3 py-2 font-normal"><option value="">All payments</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option></select></label>
      <button className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">Filter</button>
    </form>
    {error ? <p role="alert" className="rounded-xl bg-error-container/30 p-4 text-sm">Could not load orders.</p> : orders.length === 0 ? <p className="rounded-xl bg-surface-container-low p-5 text-sm">{q || status || payment ? "No orders match these filters." : "No orders yet. New customer orders will appear here."}</p> : <div className="overflow-x-auto rounded-2xl border border-surface-container-highest bg-white"><table className="w-full min-w-[46rem] text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase tracking-wide"><tr><th className="p-4">Order</th><th className="p-4">Placed</th><th className="p-4">Status</th><th className="p-4">Payment</th><th className="p-4 text-right">Total</th></tr></thead><tbody className="divide-y divide-surface-container-highest">{orders.map((order) => <tr key={order.id}><td className="p-4 font-semibold"><Link className="text-primary underline-offset-4 hover:underline" href={`/admin/orders/${order.id}`}>{order.order_code}</Link></td><td className="p-4">{date(order.created_at)}</td><td className="p-4">{label(order.status)}</td><td className="p-4">{order.payment_method.toUpperCase()} · {label(order.payment_status)}</td><td className="p-4 text-right">{formatNpr(order.total_paisa)}</td></tr>)}</tbody></table></div>}
    {!error && orders.length === 100 && <p className="mt-3 text-xs text-on-surface-variant">Showing the 100 most recent matching orders. Narrow the search to find older orders.</p>}
  </section>;
}

function label(value: string) { return value[0].toUpperCase() + value.slice(1); }
function date(value: string) { return new Intl.DateTimeFormat("en-NP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kathmandu" }).format(new Date(value)); }
