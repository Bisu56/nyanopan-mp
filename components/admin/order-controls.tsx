"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus, PaymentStatus } from "@/lib/supabase/types";
import { buttonClassName } from "@/components/ui/button";

const nextStatuses: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
};

export function OrderControls({ orderId, status, paymentStatus }: { orderId: string; status: OrderStatus; paymentStatus: PaymentStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function update(kind: "status" | "payment", value: string) {
    if (kind === "status" && value === "cancelled" && !window.confirm("Cancel this order and return its reserved stock to inventory?")) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/${kind}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error ?? "Could not save this change."); return; }
      setMessage(kind === "payment" ? "Payment marked paid." : "Order status updated.");
      router.refresh();
    } catch { setMessage("Could not save this change. Check your connection and try again."); }
    finally { setBusy(false); }
  }
  return <div className="rounded-2xl border border-surface-container-highest bg-white p-5">
    <h2 className="font-serif text-xl font-bold">Update order</h2>
    <div className="mt-4 flex flex-wrap gap-2">
      {(nextStatuses[status] ?? []).map((next) => <button key={next} disabled={busy} className={buttonClassName({ variant: next === "cancelled" ? "secondary" : "primary" })} onClick={() => void update("status", next)} type="button">{next === "cancelled" ? "Cancel order" : `Mark ${next}`}</button>)}
      {paymentStatus === "unpaid" && <button disabled={busy} className={buttonClassName({ variant: "secondary" })} onClick={() => void update("payment", "paid")} type="button">Confirm payment received</button>}
    </div>
    {message && <p className="mt-3 text-sm" role="status">{message}</p>}
  </div>;
}
