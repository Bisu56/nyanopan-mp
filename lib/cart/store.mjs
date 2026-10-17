import {
  addCartItem,
  CART_STORAGE_KEY,
  countCartItems,
  removeCartItem,
  sanitizeCart,
  setCartQuantity,
} from "./model.mjs";

let snapshot = { lines: [], itemCount: 0, ready: false };
const serverSnapshot = { lines: [], itemCount: 0, ready: false };
let initialized = false;
const listeners = new Set();

function publish(lines, persist = true) {
  snapshot = { lines, itemCount: countCartItems(lines), ready: true };
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ version: 1, items: lines }),
      );
    } catch {
      // The in-memory cart remains usable when browser storage is unavailable.
    }
  }
  listeners.forEach((listener) => listener());
}

function readSavedCart() {
  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return sanitizeCart(parsed?.version === 1 ? parsed.items : parsed);
  } catch {
    return [];
  }
}

function onStorage(event) {
  if (event.key !== CART_STORAGE_KEY) return;
  try {
    const parsed = event.newValue ? JSON.parse(event.newValue) : [];
    publish(sanitizeCart(parsed?.version === 1 ? parsed.items : parsed), false);
  } catch {
    publish([], false);
  }
}

/** @param {() => void} listener */
export function subscribeCart(listener) {
  listeners.add(listener);
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    snapshot = {
      lines: readSavedCart(),
      itemCount: 0,
      ready: true,
    };
    snapshot.itemCount = countCartItems(snapshot.lines);
    window.addEventListener("storage", onStorage);
    listener();
  }
  return () => listeners.delete(listener);
}

export function getCartSnapshot() {
  return snapshot;
}

export function getServerCartSnapshot() {
  return serverSnapshot;
}

/** @param {string} productId @param {string | null} variantId */
export function addToStoredCart(productId, variantId) {
  publish(addCartItem(snapshot.lines, productId, variantId));
}

/** @param {string} productId @param {string | null} variantId @param {number} quantity */
export function updateStoredCartQuantity(productId, variantId, quantity) {
  publish(setCartQuantity(snapshot.lines, productId, variantId, quantity));
}

/** @param {string} productId @param {string | null} variantId */
export function removeFromStoredCart(productId, variantId) {
  publish(removeCartItem(snapshot.lines, productId, variantId));
}

export function clearStoredCart() {
  publish([]);
}
