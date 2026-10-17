import test from "node:test";
import assert from "node:assert/strict";
import { validateProductInput, validateCategoryInput, validateVariantInput } from "../lib/admin/validation.mjs";

const categoryId = "f1000000-0000-4000-8000-000000000001";
const product = {
  slug: "felt-slippers", name: "Felt Slippers", description: "Handmade wool slippers",
  categoryId, pricePaisa: 125000, stockQuantity: 4, isActive: false, isPublished: false,
};

test("validates product fields and maps trusted database columns", () => {
  const result = validateProductInput(product);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.price_paisa, 125000);
  assert.equal(result.data.category_id, categoryId);
  assert.equal("is_admin" in result.data, false);
});

test("rejects unsafe product slug, price, category and stock values", () => {
  const result = validateProductInput({ ...product, slug: "../private", pricePaisa: -5, categoryId: "not-a-uuid", stockQuantity: 1.2 });
  for (const key of ["slug", "pricePaisa", "categoryId", "stockQuantity"]) assert.ok(result.errors[key]);
});

test("supports narrow product updates but rejects empty and unknown mutations", () => {
  assert.deepEqual(validateProductInput({ stockQuantity: 8 }, true).data, { stock_quantity: 8 });
  assert.equal(validateProductInput({}, true).data && Object.keys(validateProductInput({}, true).data).length, 0);
  assert.ok(validateProductInput({ role: "admin" }, true).errors.form);
});

test("validates category and variant changes", () => {
  assert.equal(validateCategoryInput({ slug: "home-decor", name: "Home Decor", sortOrder: 2 }).data.sort_order, 2);
  assert.ok(validateCategoryInput({ slug: "Home Decor", name: "x" }).errors.slug);
  assert.equal(validateVariantInput({ sizeLabel: "M", stockQuantity: 3, isActive: true }).data.stock_quantity, 3);
  assert.ok(validateVariantInput({ sizeLabel: "L", stockQuantity: -1 }).errors.stockQuantity);
});

