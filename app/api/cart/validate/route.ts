import { isCartLines } from "@/lib/cart/model.mjs";
import { validateCartForCheckout } from "@/lib/dal/products";
import { isSameOriginRequest, readJsonBounded } from "@/lib/http/request-guards.mjs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const parsed = await readJsonBounded(request, 16 * 1024);
  if (!parsed.ok) return Response.json({ error: parsed.tooLarge ? "Cart request is too large." : "Send a valid JSON cart." }, { status: parsed.tooLarge ? 413 : 400, headers: { "Cache-Control": "no-store" } });
  const body = parsed.value;

  if (
    body === null ||
    typeof body !== "object" ||
    !("items" in body) ||
    !isCartLines(body.items) ||
    body.items.some(
      (line) =>
        !UUID_PATTERN.test(line.productId) ||
        (line.variantId !== null && !UUID_PATTERN.test(line.variantId)),
    )
  ) {
    return Response.json({ error: "The cart contains invalid items." }, { status: 400 });
  }

  const result = await validateCartForCheckout(body.items);
  if (result.error || !result.data) {
    return Response.json(
      { error: result.error ?? "We could not check the cart." },
      { status: 503 },
    );
  }

  return Response.json(result.data, {
    headers: { "Cache-Control": "no-store" },
  });
}
