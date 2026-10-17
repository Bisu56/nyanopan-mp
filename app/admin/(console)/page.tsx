import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase/server";
import { formatNpr } from "@/lib/format";

export default async function AdminHomePage() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("admin_order_summary");
  const summary = data?.[0];
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Store management</p>
      <h1 className="mt-2 font-serif text-3xl font-bold">Administrator dashboard</h1>
      {error ? <p role="alert" className="mt-6 rounded-xl bg-error-container/30 p-4 text-sm">Sales summary is unavailable right now.</p> : !summary || summary.order_count === 0 ? <p className="mt-6 rounded-xl bg-surface-container-low p-5 text-sm">No orders yet. Sales summaries will appear when customers place orders.</p> : <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Summary label="Orders" value={String(summary.order_count)} />
        <Summary label="Needs attention" value={String(summary.open_order_count)} />
        <Summary label="Delivered revenue" value={formatNpr(summary.delivered_revenue_paisa)} />
        <Summary label="Unpaid orders" value={String(summary.unpaid_order_count)} />
      </div>}
      <div className="mt-7 flex flex-wrap gap-3">
        <Link className={buttonClassName()} href="/admin/orders">Manage orders</Link>
        <Link className={buttonClassName({ variant: "secondary" })} href="/admin/products">Manage products</Link>
        <Link className={buttonClassName({ variant: "secondary" })} href="/admin/categories">Manage categories</Link>
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-surface-container-highest bg-white p-5"><p className="text-sm text-on-surface-variant">{label}</p><p className="mt-2 font-serif text-2xl font-bold">{value}</p></div>;
}
