import { validateCategoryInput } from "@/lib/admin/validation.mjs";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

export async function POST(request: Request) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid category details." }, { status: 400 }); }
  const result = validateCategoryInput(body);
  if (!result.data) return Response.json({ error: "Check the category fields.", fields: result.errors }, { status: 400 });
  const { data, error } = await admin.supabase.from("categories").insert(result.data).select("id").single();
  if (error || !data) return Response.json({ error: "The category could not be created. Check the slug." }, { status: 400 });
  return Response.json({ id: data.id }, { status: 201 });
}
