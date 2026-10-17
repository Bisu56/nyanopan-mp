import { getAdminApiContext } from "@/lib/supabase/admin-api";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await getAdminApiContext(request);
  if (!admin) return response;
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if ((body as { status?: unknown } | null)?.status !== "paid") {
    return Response.json({ error: "Only an explicit unpaid to paid confirmation is supported." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const { error } = await admin.supabase.rpc("admin_set_order_payment_status", { p_order_id: id, p_new_status: "paid" });
  if (error) {
    const missing = error.message.includes("order_not_found") || error.code === "P0002";
    return Response.json({ error: missing ? "Order not found." : "Could not update payment status." }, { status: missing ? 404 : 500, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
