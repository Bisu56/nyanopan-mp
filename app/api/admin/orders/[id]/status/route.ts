import type { OrderStatus } from "@/lib/supabase/types";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

const allowed = new Set<OrderStatus>(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await getAdminApiContext(request);
  if (!admin) return response;
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const status = (body as { status?: unknown } | null)?.status;
  if (typeof status !== "string" || !allowed.has(status as OrderStatus)) {
    return Response.json({ error: "Choose a valid order status." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const { error } = await admin.supabase.rpc("admin_transition_order", { p_order_id: id, p_new_status: status as OrderStatus });
  if (error) {
    const invalid = error.message.includes("invalid_order_transition") || error.code === "22023";
    const missing = error.message.includes("order_not_found") || error.code === "P0002";
    return Response.json({ error: invalid ? "That status change is not allowed." : missing ? "Order not found." : "Could not update this order." }, { status: invalid ? 409 : missing ? 404 : 500, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
