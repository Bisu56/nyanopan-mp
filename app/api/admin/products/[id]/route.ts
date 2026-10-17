import { validateProductInput } from "@/lib/admin/validation.mjs";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Invalid product." }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid product details." }, { status: 400 }); }
  const result = validateProductInput(body, true);
  if (!result.data || !Object.keys(result.data).length) return Response.json({ error: "Check the product fields.", fields: result.errors }, { status: 400 });
  const { data, error } = await admin.supabase.from("products").update(result.data).eq("id", id).select("id").maybeSingle();
  if (error) return Response.json({ error: "The product could not be updated. Check its values and slug." }, { status: 400 });
  if (!data) return Response.json({ error: "Product not found." }, { status: 404 });
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request, { params }: Context) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Invalid product." }, { status: 400 });
  const { data: images } = await admin.supabase.from("product_images").select("storage_path").eq("product_id", id);
  const { data, error } = await admin.supabase.from("products").delete().eq("id", id).select("id").maybeSingle();
  if (error) return Response.json({ error: "Product could not be deleted. Products assigned to categories or orders may need to be archived instead." }, { status: 409 });
  if (!data) return Response.json({ error: "Product not found." }, { status: 404 });
  const paths = (images ?? []).map((image) => image.storage_path);
  if (paths.length) await admin.supabase.storage.from("product-images").remove(paths);
  return Response.json({ ok: true });
}
