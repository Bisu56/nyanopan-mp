import { validateProductInput } from "@/lib/admin/validation.mjs";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

export async function POST(request: Request) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Send valid product details." }, { status: 400 }); }
  const result = validateProductInput(body);
  if (!result.data) return Response.json({ error: "Check the product fields.", fields: result.errors }, { status: 400 });
  const { data, error } = await admin.supabase.from("products").insert({
    slug: result.data.slug,
    name: result.data.name,
    description: result.data.description ?? "",
    category_id: result.data.category_id,
    price_paisa: result.data.price_paisa,
    stock_quantity: result.data.stock_quantity,
    is_active: result.data.is_active ?? false,
    is_published: result.data.is_published ?? false,
  }).select("id").single();
  if (error || !data) return Response.json({ error: "The product could not be created. Check the slug and category." }, { status: 400 });
  return Response.json({ id: data.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
