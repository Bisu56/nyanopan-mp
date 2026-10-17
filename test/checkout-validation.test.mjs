import test from "node:test";
import assert from "node:assert/strict";
import { validateCheckoutPayload } from "../lib/checkout/validate.mjs";

const productId = "f2000000-0000-4000-8000-000000000001";
const variantId = "f2000000-0000-4000-8000-000000000002";
const valid = {
  customerName: "  Bishal Rai ",
  phone: "+977 (981)-234-5678",
  province: "Bagmati",
  district: "Kathmandu",
  municipality: "Kathmandu Metropolitan City",
  ward: "5",
  fullAddress: "Thamel, near the old square",
  deliveryNotes: "",
  paymentMethod: "cod",
  items: [{ productId, variantId: null, quantity: 2 }],
};

test("validates checkout and normalizes customer fields", () => {
  const result = validateCheckoutPayload(valid);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.customerName, "Bishal Rai");
  assert.equal(result.data.phone, "+9779812345678");
  assert.equal(result.data.deliveryNotes, null);
});

test("accepts manual payment and keeps product variant identity", () => {
  const result = validateCheckoutPayload({
    ...valid,
    paymentMethod: "manual",
    items: [{ productId, variantId, quantity: 1 }],
  });
  assert.equal(result.data.paymentMethod, "manual");
  assert.equal(result.data.items[0].variantId, variantId);
});

test("rejects invalid contact and address fields", () => {
  const result = validateCheckoutPayload({
    ...valid, customerName: "x", phone: "abc", province: "not-a-province",
    district: "", municipality: " ", ward: "5A", fullAddress: "x",
  });
  for (const key of ["customerName", "phone", "province", "district", "municipality", "ward", "fullAddress"]) {
    assert.ok(result.errors[key], `expected ${key} error`);
  }
});

test("rejects empty carts, invalid quantities and duplicate variants", () => {
  assert.ok(validateCheckoutPayload({ ...valid, items: [] }).errors.items);
  assert.ok(validateCheckoutPayload({ ...valid, items: [{ productId, variantId: null, quantity: 100 }] }).errors.items);
  assert.ok(validateCheckoutPayload({
    ...valid,
    items: [{ productId, variantId, quantity: 1 }, { productId, variantId, quantity: 2 }],
  }).errors.items);
});

test("does not accept client supplied prices or totals as checkout inputs", () => {
  const result = validateCheckoutPayload({ ...valid, totalPaisa: 1, items: [{ ...valid.items[0], pricePaisa: 1 }] });
  assert.deepEqual(result.data.items[0], { productId, variantId: null, quantity: 2 });
  assert.equal("totalPaisa" in result.data, false);
});

