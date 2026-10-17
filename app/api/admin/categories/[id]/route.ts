import { validateCategoryInput } from "@/lib/admin/validation.mjs";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Invalid category." }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid category details." }, { status: 400 }); }
  const result = validateCategoryInput(body, true);
  if (!result.data || !Object.keys(result.data).length) return Response.json({ error: "Check the category fields.", fields: result.errors }, { status: 400 });
  const { data, error } = await admin.supabase.from("categories").update(result.data).eq("id", id).select("id").maybeSingle();
  if (error) return Response.json({ error: "The category could not be updated. Check its values and slug." }, { status: 400 });
  if (!data) return Response.json({ error: "Category not found." }, { status: 404 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request, { params }: Context) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Invalid category." }, { status: 400 });
  const { data, error } = await admin.supabase.from("categories").delete().eq("id", id).select("id").maybeSingle();
  if (error) return Response.json({ error: "Category cannot be deleted while products use it." }, { status: 409 });
  if (!data) return Response.json({ error: "Category not found." }, { status: 404 });
  return Response.json({ ok: true });
}
