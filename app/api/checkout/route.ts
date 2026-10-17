import { createHash } from "node:crypto";

import { validateCheckoutPayload } from "@/lib/checkout/validate.mjs";
import { createServerClient } from "@/lib/supabase/server";
import { isSameOriginRequest, readJsonBounded } from "@/lib/http/request-guards.mjs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ message: "Request origin is not allowed." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const parsed = await readJsonBounded(request, 16 * 1024);
  if (!parsed.ok) return Response.json({ message: parsed.tooLarge ? "Checkout request is too large." : "Send valid checkout details." }, { status: parsed.tooLarge ? 413 : 400, headers: { "Cache-Control": "no-store" } });
  const body = parsed.value;

  if (body && typeof body === "object" && "website" in body && typeof body.website === "string" && body.website.trim()) {
    return Response.json({ message: "Please review your checkout details." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const result = validateCheckoutPayload(body);
  if (!result.data) {
    return Response.json({ message: "Check the highlighted checkout details.", fieldErrors: result.errors }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const raw = body as Record<string, unknown>;
  const uuid = (value: unknown) => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  if (!uuid(raw.idempotencyKey) || !uuid(raw.confirmationToken)) {
    return Response.json({ message: "Refresh checkout and try again." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const tokenHash = createHash("sha256").update(raw.confirmationToken as string).digest("hex");
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("create_order", {
    p_idempotency_key: raw.idempotencyKey as string,
    p_confirmation_token_hash: tokenHash,
    p_customer_name: result.data.customerName,
    p_customer_phone: result.data.phone,
    p_shipping_address: {
      province: result.data.province,
      district: result.data.district,
      municipality: result.data.municipality,
      ward: result.data.ward,
      full_address: result.data.fullAddress,
    },
    p_delivery_notes: result.data.deliveryNotes,
    p_payment_method: result.data.paymentMethod,
    p_items: result.data.items,
  });

  if (error || !data?.[0]) {
    const message = error?.message ?? "";
    const known = message.includes("insufficient_stock")
      ? "Stock changed while you were checking out. Update your bag and try again."
      : message.includes("product_unavailable") || message.includes("variant_")
        ? "An item in your bag is no longer available. Update your bag and try again."
        : message.includes("idempotency_conflict")
          ? "This checkout attempt has expired. Start checkout again."
          : "We could not place your order right now. Please try again.";
    return Response.json({ message: known }, { status: error?.code === "P0001" || error?.code === "22023" ? 409 : 503, headers: { "Cache-Control": "no-store" } });
  }

  return Response.json({ confirmationPath: `/orders/confirmation/${raw.confirmationToken}` }, {
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
