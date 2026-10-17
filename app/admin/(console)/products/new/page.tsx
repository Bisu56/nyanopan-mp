import { createServerClient } from "@/lib/supabase/server";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function NewAdminProductPage() {
  const supabase = await createServerClient();
  const { data: categories, error } = await supabase.from("categories").select("*").order("sort_order");
  return <section><h1 className="mb-6 font-serif text-3xl font-bold">Add product</h1>{error ? <p role="alert">Could not load categories.</p> : <ProductEditor product={null} categories={categories ?? []} />}</section>;
}
