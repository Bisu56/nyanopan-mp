import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ProductEditor } from "@/components/admin/product-editor";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function EditAdminProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const supabase = await createServerClient();
  const [{ data: product, error: productError }, { data: categories, error: categoryError }, { data: variants, error: variantError }, { data: images, error: imageError }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("product_variants").select("*").eq("product_id", id).order("size_label"),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort_order"),
  ]);
  if (productError || !product) notFound();
  if (categoryError || variantError || imageError) return <p role="alert">Could not load all product management details.</p>;
  const productImages = images ?? [];
  const { data: signed } = productImages.length
    ? await supabase.storage.from("product-images").createSignedUrls(productImages.map((image) => image.storage_path), 60 * 60)
    : { data: [] };
  const urls = new Map((signed ?? []).flatMap((image) => image.path && image.signedUrl ? [[image.path, image.signedUrl] as const] : []));
  const imagesForEditor = productImages.map((image) => ({ ...image, signedUrl: urls.get(image.storage_path) ?? null }));
  return <section><p className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">Catalog</p><h1 className="mb-6 font-serif text-3xl font-bold">Edit {product.name}</h1><ProductEditor product={product} categories={categories ?? []} variants={variants ?? []} images={imagesForEditor} /></section>;
}
