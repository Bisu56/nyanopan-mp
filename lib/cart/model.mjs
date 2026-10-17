/** @typedef {{ productId: string, variantId: string | null, quantity: number }} CartLine */

export const CART_STORAGE_KEY = "nyanopan-cart-v1";
export const MAX_CART_QUANTITY = 99;
export const MAX_CART_LINES = 50;

/** @param {Pick<CartLine, "productId" | "variantId">} line */
export function cartLineKey(line) {
  return `${line.productId}:${line.variantId ?? ""}`;
}

/** @param {unknown} value @returns {value is CartLine[]} */
export function isCartLines(value) {
  return (
    Array.isArray(value) &&
    value.length <= MAX_CART_LINES &&
    value.every(
      (line) =>
        line !== null &&
        typeof line === "object" &&
        typeof line.productId === "string" &&
        line.productId.length > 0 &&
        (line.variantId === null || typeof line.variantId === "string") &&
        Number.isInteger(line.quantity) &&
        line.quantity >= 1 &&
        line.quantity <= MAX_CART_QUANTITY,
    )
  );
}

/**
 * Reads only the small identifier/quantity allowlist from persisted state.
 * Invalid, old or oversized data is discarded.
 * @param {unknown} value
 * @returns {CartLine[]}
 */
export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];

  const merged = new Map();
  for (const row of value) {
    if (
      !row ||
      typeof row !== "object" ||
      typeof row.productId !== "string" ||
      row.productId.length === 0 ||
      !(row.variantId === null || typeof row.variantId === "string") ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1
    ) {
      continue;
    }

    const line = {
      productId: row.productId,
      variantId: row.variantId,
      quantity: Math.min(row.quantity, MAX_CART_QUANTITY),
    };
    const key = cartLineKey(line);
    const current = merged.get(key);
    if (current) {
      current.quantity = Math.min(
        current.quantity + line.quantity,
        MAX_CART_QUANTITY,
      );
    } else if (merged.size < MAX_CART_LINES) {
      merged.set(key, line);
    }
  }

  return [...merged.values()];
}

/** @param {CartLine[]} lines @param {string} productId @param {string | null} variantId @param {number} [quantity] */
export function addCartItem(lines, productId, variantId, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1) return lines;
  const next = [...lines];
  const key = cartLineKey({ productId, variantId });
  const index = next.findIndex((line) => cartLineKey(line) === key);

  if (index >= 0) {
    next[index] = {
      ...next[index],
      quantity: Math.min(next[index].quantity + quantity, MAX_CART_QUANTITY),
    };
  } else if (next.length < MAX_CART_LINES) {
    next.push({
      productId,
      variantId,
      quantity: Math.min(quantity, MAX_CART_QUANTITY),
    });
  }

  return next;
}

/** @param {CartLine[]} lines @param {string} productId @param {string | null} variantId @param {number} quantity */
export function setCartQuantity(lines, productId, variantId, quantity) {
  const key = cartLineKey({ productId, variantId });
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return lines.filter((line) => cartLineKey(line) !== key);
  }

  const bounded = Math.min(quantity, MAX_CART_QUANTITY);
  return lines.map((line) =>
    cartLineKey(line) === key ? { ...line, quantity: bounded } : line,
  );
}

/** @param {CartLine[]} lines @param {string} productId @param {string | null} variantId */
export function removeCartItem(lines, productId, variantId) {
  const key = cartLineKey({ productId, variantId });
  return lines.filter((line) => cartLineKey(line) !== key);
}

/** @param {CartLine[]} lines */
export function countCartItems(lines) {
  return lines.reduce((count, line) => count + line.quantity, 0);
}
