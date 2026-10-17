import { CategoryManager } from "@/components/admin/category-manager";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  return <section><p className="text-sm font-semibold uppercase tracking-wide text-secondary">Catalog</p><h1 className="mb-6 mt-2 font-serif text-3xl font-bold">Categories</h1>{error ? <p role="alert">Could not load categories.</p> : <CategoryManager categories={data ?? []} />}</section>;
}
