import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CategoryRow } from "@/lib/supabase/types";

export type CatalogFilters = {
  category?: string;
  q?: string;
  price?: string;
  sort?: string;
};

export function CatalogFiltersForm({
  categories,
  filters,
}: {
  categories: CategoryRow[];
  filters: CatalogFilters;
}) {
  return (
    <form
      action="/products"
      method="get"
      className="grid gap-3 rounded-2xl border border-surface-container-highest bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.5fr)_1fr_1fr_1fr_auto] lg:items-end"
    >
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="catalog-search" className="mb-1.5 block text-xs font-semibold text-on-surface">
          Search products
        </label>
        <div className="flex h-11 items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 focus-within:outline-2 focus-within:outline-primary">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-on-surface-variant" />
          <input
            id="catalog-search"
            name="q"
            type="search"
            maxLength={80}
            defaultValue={filters.q}
            placeholder="Search by name"
            className="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
          />
        </div>
      </div>

      <label className="text-xs font-semibold text-on-surface">
        <span className="mb-1.5 block">Collection</span>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary"
        >
          <option value="">All collections</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs font-semibold text-on-surface">
        <span className="mb-1.5 block">Price</span>
        <select
          name="price"
          defaultValue={filters.price ?? ""}
          className="h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary"
        >
          <option value="">Any price</option>
          <option value="under-2500">Under NPR 2,500</option>
          <option value="2500-5000">NPR 2,500–5,000</option>
          <option value="over-5000">Over NPR 5,000</option>
        </select>
      </label>

      <label className="text-xs font-semibold text-on-surface">
        <span className="mb-1.5 block">Sort by</span>
        <select
          name="sort"
          defaultValue={filters.sort ?? "newest"}
          className="h-11 w-full rounded-xl border border-outline-variant bg-surface px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-primary"
        >
          <option value="newest">Recently added</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>

      <Button type="submit" variant="primary" size="md" className="h-11 w-full lg:w-auto">
        Apply filters
      </Button>
    </form>
  );
}
