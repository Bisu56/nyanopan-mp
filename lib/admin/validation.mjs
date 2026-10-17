const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PRODUCT_FIELDS = ["slug", "name", "description", "categoryId", "pricePaisa", "stockQuantity", "isActive", "isPublished"];
const CATEGORY_FIELDS = ["slug", "name", "description", "sortOrder"];

function objectInput(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateProductInput(value, partial = false) {
  if (!objectInput(value)) return { data: null, errors: { form: "Send a valid product." } };
  const errors = {};
  const data = {};
  for (const key of Object.keys(value)) if (!PRODUCT_FIELDS.includes(key)) errors.form = "The product contains an unsupported field.";
  const has = (key) => Object.hasOwn(value, key);
  const required = (key) => !partial && !has(key);

  if (required("slug") || (has("slug") && (typeof value.slug !== "string" || !SLUG.test(value.slug.trim()) || value.slug.length > 120))) errors.slug = "Use a lowercase URL slug with letters, numbers and hyphens.";
  else if (has("slug")) data.slug = value.slug.trim();
  if (required("name") || (has("name") && (typeof value.name !== "string" || value.name.trim().length < 2 || value.name.trim().length > 120))) errors.name = "Enter a product name from 2 to 120 characters.";
  else if (has("name")) data.name = value.name.trim();
  if (has("description") && (typeof value.description !== "string" || value.description.length > 5000)) errors.description = "Description must be 5,000 characters or fewer.";
  else if (has("description")) data.description = value.description;
  if (required("categoryId") || (has("categoryId") && (typeof value.categoryId !== "string" || !UUID.test(value.categoryId)))) errors.categoryId = "Choose a valid category.";
  else if (has("categoryId")) data.category_id = value.categoryId;
  if (required("pricePaisa") || (has("pricePaisa") && (!Number.isSafeInteger(value.pricePaisa) || value.pricePaisa < 1 || value.pricePaisa > 100_000_000))) errors.pricePaisa = "Price must be between 1 paisa and NPR 1,000,000.";
  else if (has("pricePaisa")) data.price_paisa = value.pricePaisa;
  if (required("stockQuantity") || (has("stockQuantity") && (!Number.isInteger(value.stockQuantity) || value.stockQuantity < 0 || value.stockQuantity > 1_000_000))) errors.stockQuantity = "Stock must be a whole number from 0 to 1,000,000.";
  else if (has("stockQuantity")) data.stock_quantity = value.stockQuantity;
  if (required("isActive") || (has("isActive") && typeof value.isActive !== "boolean")) errors.isActive = "Choose a valid product state.";
  else if (has("isActive")) data.is_active = value.isActive;
  if (required("isPublished") || (has("isPublished") && typeof value.isPublished !== "boolean")) errors.isPublished = "Choose a valid product state.";
  else if (has("isPublished")) data.is_published = value.isPublished;
  if (Object.keys(errors).length) return { data: null, errors };
  return { data, errors };
}

export function validateCategoryInput(value, partial = false) {
  if (!objectInput(value)) return { data: null, errors: { form: "Send a valid category." } };
  const errors = {};
  const data = {};
  for (const key of Object.keys(value)) if (!CATEGORY_FIELDS.includes(key)) errors.form = "The category contains an unsupported field.";
  const has = (key) => Object.hasOwn(value, key);
  const required = (key) => !partial && !has(key);
  if (required("slug") || (has("slug") && (typeof value.slug !== "string" || !SLUG.test(value.slug.trim()) || value.slug.length > 120))) errors.slug = "Use a lowercase URL slug with letters, numbers and hyphens.";
  else if (has("slug")) data.slug = value.slug.trim();
  if (required("name") || (has("name") && (typeof value.name !== "string" || value.name.trim().length < 2 || value.name.trim().length > 60))) errors.name = "Enter a category name from 2 to 60 characters.";
  else if (has("name")) data.name = value.name.trim();
  if (has("description") && value.description !== null && (typeof value.description !== "string" || value.description.length > 1000)) errors.description = "Description must be 1,000 characters or fewer.";
  else if (has("description")) data.description = value.description;
  if (has("sortOrder") && (!Number.isInteger(value.sortOrder) || value.sortOrder < 0 || value.sortOrder > 100_000)) errors.sortOrder = "Sort order must be a whole number from 0 to 100,000.";
  else if (has("sortOrder")) data.sort_order = value.sortOrder;
  if (Object.keys(errors).length) return { data: null, errors };
  return { data, errors };
}

export function validateVariantInput(value, partial = false) {
  if (!objectInput(value)) return { data: null, errors: { form: "Send a valid product option." } };
  const errors = {};
  const data = {};
  const has = (key) => Object.hasOwn(value, key);
  for (const key of Object.keys(value)) if (!["sizeLabel", "stockQuantity", "isActive"].includes(key)) errors.form = "The option contains an unsupported field.";
  if ((!partial && !has("sizeLabel")) || (has("sizeLabel") && (typeof value.sizeLabel !== "string" || !value.sizeLabel.trim() || value.sizeLabel.trim().length > 20))) errors.sizeLabel = "Enter an option label up to 20 characters.";
  else if (has("sizeLabel")) data.size_label = value.sizeLabel.trim();
  if ((!partial && !has("stockQuantity")) || (has("stockQuantity") && (!Number.isInteger(value.stockQuantity) || value.stockQuantity < 0 || value.stockQuantity > 1_000_000))) errors.stockQuantity = "Stock must be a whole number from 0 to 1,000,000.";
  else if (has("stockQuantity")) data.stock_quantity = value.stockQuantity;
  if (has("isActive") && typeof value.isActive !== "boolean") errors.isActive = "Choose a valid option state.";
  else if (has("isActive")) data.is_active = value.isActive;
  if (Object.keys(errors).length) return { data: null, errors };
  return { data, errors };
}

