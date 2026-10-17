import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

import { CatalogFiltersForm } from "@/components/products/catalog-filters";
import type { CatalogFilters } from "@/components/products/catalog-filters";
import { ProductCard } from "@/components/products/product-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClassName } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/dal/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse Nyanopan's handmade wool felt footwear, home decor and accessories.",
  alternates: { canonical: "/products" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const requestedCategory = getSingleParam(params.category);
  const requestedPrice = getSingleParam(params.price);
  const requestedSort = getSingleParam(params.sort);
  const requestedSearch = getSingleParam(params.q)?.trim().slice(0, 80);

  const categoriesResult = await getCategories();
  const categories = categoriesResult.data ?? [];
  const category = categories.find((item) => item.slug === requestedCategory);
  const priceBounds = {
    "under-2500": { maxPricePaisa: 249_999 },
    "2500-5000": { minPricePaisa: 250_000, maxPricePaisa: 500_000 },
    "over-5000": { minPricePaisa: 500_001 },
  } as const;
  const price = requestedPrice && requestedPrice in priceBounds
    ? priceBounds[requestedPrice as keyof typeof priceBounds]
    : undefined;
  const sort = requestedSort === "price-asc" || requestedSort === "price-desc"
    ? requestedSort
    : "newest";

  const productsResult = requestedCategory && !category
    ? { data: [], error: null }
    : await getProducts({
        categorySlug: category?.slug,
        search: requestedSearch,
        ...price,
        sort,
      });

  const filters: CatalogFilters = {
    category: category?.slug,
    q: requestedSearch,
    price: price ? requestedPrice : undefined,
    sort,
  };

  return (
    <Container className="py-10 sm:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
          Nyanopan collection
        </p>
        <h1 className="font-serif text-3xl font-bold text-on-surface sm:text-5xl">
          {category?.name ?? "Shop all"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
          Browse the products currently listed in the Nyanopan catalog. Product details and prices
          shown here come from the catalog database.
        </p>
      </header>

      <CatalogFiltersForm categories={categories} filters={filters} />

      {categoriesResult.error && (
        <p role="status" className="mt-4 rounded-xl bg-error-container/50 p-3 text-sm text-on-error-container">
          Collection filters could not be loaded. You can still browse all products.
        </p>
      )}

      {productsResult.error ? (
        <section className="mt-8 rounded-2xl border border-error-container bg-error-container/30 px-6 py-12 text-center" role="alert">
          <SlidersHorizontal aria-hidden className="mx-auto mb-3 h-7 w-7 text-primary" />
          <h2 className="font-serif text-xl font-bold text-on-surface">The catalog is unavailable</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-on-surface-variant">
            We couldn&apos;t load products right now. Please try again in a moment.
          </p>
          <Link href="/products" className={`${buttonClassName({ variant: "secondary" })} mt-5`}>
            Try again <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </section>
      ) : productsResult.data?.length ? (
        <>
          <p className="mt-7 text-sm text-on-surface-variant" aria-live="polite">
            {productsResult.data.length} {productsResult.data.length === 1 ? "product" : "products"}
            {requestedSearch ? ` matching “${requestedSearch}”` : " available"}
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsResult.data.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={<SlidersHorizontal aria-hidden className="h-7 w-7" />}
            title="No products match these filters"
            description="Try another search or clear the filters to see what is currently in the catalog."
            action={
              <Link href="/products" className={buttonClassName({ variant: "secondary" })}>
                Clear filters
              </Link>
            }
          />
        </div>
      )}
    </Container>
  );
}
