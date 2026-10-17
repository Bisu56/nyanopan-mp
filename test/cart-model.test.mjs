import assert from "node:assert/strict";
import test from "node:test";

import {
  addCartItem,
  cartLineKey,
  countCartItems,
  removeCartItem,
  sanitizeCart,
  setCartQuantity,
} from "../lib/cart/model.mjs";

test("quantity updates are bounded and zero removes the line", () => {
  const cart = [{ productId: "p1", variantId: null, quantity: 2 }];
  assert.equal(setCartQuantity(cart, "p1", null, 5)[0].quantity, 5);
  assert.equal(setCartQuantity(cart, "p1", null, 120)[0].quantity, 99);
  assert.deepEqual(setCartQuantity(cart, "p1", null, 0), []);
});

test("adding a duplicate product and variant merges the quantity", () => {
  const cart = addCartItem([], "p1", null, 1);
  const next = addCartItem(cart, "p1", null, 2);
  assert.deepEqual(next, [{ productId: "p1", variantId: null, quantity: 3 }]);
  assert.equal(countCartItems(next), 3);
});

test("different variants of the same product stay separate", () => {
  const cart = addCartItem([], "p1", "size-38");
  const next = addCartItem(cart, "p1", "size-39");
  assert.equal(next.length, 2);
  assert.notEqual(cartLineKey(next[0]), cartLineKey(next[1]));
  assert.equal(removeCartItem(next, "p1", "size-38")[0].variantId, "size-39");
});

test("sanitizing persisted state removes invalid entries and merges duplicates", () => {
  assert.deepEqual(
    sanitizeCart([
      { productId: "p1", variantId: null, quantity: 2, price: 999 },
      { productId: "p1", variantId: null, quantity: 3 },
      { productId: "", variantId: null, quantity: 1 },
      { productId: "p2", variantId: "v2", quantity: -1 },
    ]),
    [{ productId: "p1", variantId: null, quantity: 5 }],
  );
});

test("empty cart has zero items and removing its only line stays empty", () => {
  assert.deepEqual(sanitizeCart(null), []);
  assert.equal(countCartItems([]), 0);
  assert.deepEqual(removeCartItem([{ productId: "p1", variantId: null, quantity: 1 }], "p1", null), []);
});
