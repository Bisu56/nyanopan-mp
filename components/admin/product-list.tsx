"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductRow } from "@/lib/supabase/types";
import { buttonClassName } from "@/components/ui/button";
import { formatNpr } from "@/lib/format";

export function ProductList({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  async function remove(product: ProductRow) {
    if (!window.confirm("Delete " + product.name + "? Orders preserve their item snapshots.")) return;
    setBusyId(product.id); setMessage("");
    const response = await fetch("/api/admin/products/" + product.id, { method: "DELETE" });
    const result = await response.json();
    setBusyId("");
    if (!response.ok) setMessage(result.error ?? "Could not delete product.");
    else router.refresh();
  }
  return (
    <div>
      {message && <p role="alert" className="mb-4 rounded-xl bg-error-container/30 p-3 text-sm text-error">{message}</p>}
      {products.length === 0 ? <p className="rounded-xl bg-surface-container-low p-5 text-sm">No products yet.</p> : (
        <ul className="divide-y divide-surface-container-highest rounded-2xl border border-surface-container-highest bg-white">
          {products.map((product) => <li key={product.id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
            <div className="min-w-0 flex-1"><Link className="font-semibold hover:text-primary" href={"/admin/products/" + product.id}>{product.name}</Link><p className="mt-1 text-xs text-on-surface-variant">{product.slug} · {formatNpr(product.price_paisa)} · stock {product.stock_quantity}</p></div>
            <div className="flex gap-2 text-xs"><span className="rounded-full bg-surface-container px-2.5 py-1">{product.is_active ? "Active" : "Inactive"}</span><span className="rounded-full bg-surface-container px-2.5 py-1">{product.is_published ? "Published" : "Draft"}</span></div>
            <button className={buttonClassName({ variant: "secondary", size: "md" })} type="button" disabled={busyId === product.id} onClick={() => void remove(product)}>Delete</button>
          </li>)}
        </ul>
      )}
    </div>
  );
}

