import { isCartLines } from "@/lib/cart/model.mjs";
import { validateCartForCheckout } from "@/lib/dal/products";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON cart." }, { status: 400 });
  }

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
