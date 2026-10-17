import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { ProductList } from "@/components/admin/product-list";
import { buttonClassName } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-secondary">Catalog</p><h1 className="mt-2 font-serif text-3xl font-bold">Products</h1></div><Link className={buttonClassName()} href="/admin/products/new">Add product</Link></div>
      {error ? <p role="alert" className="rounded-xl bg-error-container/30 p-4 text-sm">Could not load products.</p> : <ProductList products={data ?? []} />}
    </section>
  );
}
