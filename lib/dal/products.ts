/**
 * Data Access Layer — products and categories.
 *
 * All functions in this file are SERVER-ONLY. They import `server-only` at the
 * top so TypeScript/Next.js will throw a build error if they are accidentally
 * imported into a Client Component.
 *
 * Every function returns a plain result object (no throwing) so callers can
 * pattern-match on `{ data, error }` and decide how to surface errors:
 *   - Server Components: redirect to error.tsx or show inline empty state.
 *   - Route Handlers: return an appropriate HTTP status.
 *
 * These functions use the ANON client (with RLS enforced) so they respect the
 * same visibility rules as the public storefront:
 *   - Only active, published products are returned publicly.
 *   - The inactive seed row ("sample-inactive-wip") is hidden.
 */

import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type {
  CategoryRow,
  ProductImageRow,
  ProductRow,
  ProductVariantRow,
} from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Return types
// ---------------------------------------------------------------------------

export interface DalResult<T> {
  data: T | null;
  error: string | null;
}

/** A product with its category, variants and images joined in. */
export interface ProductWithRelations extends ProductRow {
  category: Pick<CategoryRow, "id" | "slug" | "name"> | null;
  variants: ProductVariantRow[];
  images: ProductImageRow[];
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/** Fetch all categories, ordered by sort_order. */
export async function getCategories(): Promise<DalResult<CategoryRow[]>> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[DAL] getCategories error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/** Fetch a single category by slug. */
export async function getCategoryBySlug(
  slug: string,
): Promise<DalResult<CategoryRow>> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    // PGRST116 = no rows returned — treat as a not-found, not a crash.
    if (error.code === "PGRST116") return { data: null, error: null };
    console.error("[DAL] getCategoryBySlug error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

interface GetProductsOptions {
  /** Filter by category slug (e.g. "footwear"). Omit to return all. */
  categorySlug?: string;
  /** Match part of a product name. */
  search?: string;
  /** Inclusive price limits in integer paisa. */
  minPricePaisa?: number;
  maxPricePaisa?: number;
  /** One of the catalog's supported sort orders. */
  sort?: "newest" | "price-asc" | "price-desc";
  /** Number of products to return. Defaults to 48. */
  limit?: number;
  /** Offset for pagination. Defaults to 0. */
  offset?: number;
}

/**
 * Fetch active, published products, optionally filtered by category.
 * Returns the product plus a slim category join for display purposes.
 */
export async function getProducts(
  options: GetProductsOptions = {},
): Promise<DalResult<ProductWithRelations[]>> {
  const {
    categorySlug,
    search,
    minPricePaisa,
    maxPricePaisa,
    sort = "newest",
    limit = 48,
    offset = 0,
  } = options;
  const supabase = await createServerClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories ( id, slug, name ),
      variants:product_variants ( * ),
      images:product_images ( * )
    `,
    )
    .eq("is_active", true)
    .eq("is_published", true)
    .order(sort === "newest" ? "created_at" : "price_paisa", {
      ascending: sort === "price-asc",
    })
    .range(offset, offset + limit - 1);

  const normalizedSearch = search?.trim().slice(0, 80);
  if (normalizedSearch) query = query.ilike("name", `%${normalizedSearch}%`);
  if (minPricePaisa !== undefined) query = query.gte("price_paisa", minPricePaisa);
  if (maxPricePaisa !== undefined) query = query.lte("price_paisa", maxPricePaisa);

  if (categorySlug) {
    // Resolve the category first so the filter stays on a typed product column.
    const { data: cat, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (categoryError) {
      console.error("[DAL] getProducts category lookup error:", categoryError.message);
      return { data: null, error: categoryError.message };
    }

    if (!cat) {
      // Unknown category slug — return empty rather than erroring.
      return { data: [], error: null };
    }

    query = query.eq("category_id", cat.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[DAL] getProducts error:", error.message);
    return { data: null, error: error.message };
  }

  // Sort images by sort_order for consistent display
  const products = (data ?? []).map((p) => ({
    ...p,
    variants: (p.variants ?? []).sort(
      (a: ProductVariantRow, b: ProductVariantRow) =>
        a.size_label.localeCompare(b.size_label, undefined, { numeric: true }),
    ),
    images: (p.images ?? []).sort(
      (a: ProductImageRow, b: ProductImageRow) => a.sort_order - b.sort_order,
    ),
  }));

  return { data: products as ProductWithRelations[], error: null };
}

/**
 * Fetch a single active product by slug, with category, variants and images.
 * Returns `data: null` (no error) if the product doesn't exist or is inactive.
 */
export async function getProductBySlug(
  slug: string,
): Promise<DalResult<ProductWithRelations>> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories ( id, slug, name ),
      variants:product_variants ( * ),
      images:product_images ( * )
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[DAL] getProductBySlug error:", error.message);
    return { data: null, error: error.message };
  }

  if (!data) return { data: null, error: null };

  const product: ProductWithRelations = {
    ...data,
    variants: (data.variants ?? []).sort(
      (a: ProductVariantRow, b: ProductVariantRow) =>
        a.size_label.localeCompare(b.size_label, undefined, { numeric: true }),
    ),
    images: (data.images ?? []).sort(
      (a: ProductImageRow, b: ProductImageRow) => a.sort_order - b.sort_order,
    ),
  };

  return { data: product, error: null };
}

/**
 * Fetch multiple products by their IDs.
 * Used by the cart to re-read live prices before checkout.
 * Only returns active, published products — drafts and deactivated items return nothing.
 */
export async function getProductsByIds(
  ids: string[],
): Promise<DalResult<ProductRow[]>> {
  if (ids.length === 0) return { data: [], error: null };

  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("is_active", true)
    .eq("is_published", true);

  if (error) {
    console.error("[DAL] getProductsByIds error:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data ?? [], error: null };
}
