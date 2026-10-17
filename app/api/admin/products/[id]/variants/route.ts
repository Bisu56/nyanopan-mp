import { validateVariantInput } from "@/lib/admin/validation.mjs";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Invalid product." }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid option details." }, { status: 400 }); }
  const result = validateVariantInput(body);
  if (!result.data) return Response.json({ error: "Check the option fields.", fields: result.errors }, { status: 400 });
  const { data, error } = await admin.supabase.from("product_variants").insert({ ...result.data, product_id: id }).select("id").single();
  if (error || !data) return Response.json({ error: "The option could not be added. Its label may already exist." }, { status: 400 });
  return Response.json({ id: data.id }, { status: 201 });
}
