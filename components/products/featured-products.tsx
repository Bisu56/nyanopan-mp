import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/dal/products";

export async function FeaturedProducts() {
  let result;
  try {
    result = await getProducts({ limit: 4 });
  } catch (error) {
    console.error("[Home] Featured catalog error:", error);
    result = { data: null, error: "Unable to load the catalog." };
  }

  return (
    <section className="py-14 sm:py-16" aria-labelledby="featured-products-heading">
      <Container>
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              From the catalog
            </p>
            <h2 id="featured-products-heading" className="mt-2 font-serif text-3xl font-bold text-on-surface">
              Browse handmade goods
            </h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-deep">
            Shop all products <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        {result.error ? (
          <p role="status" className="rounded-2xl border border-surface-container-highest bg-surface-container-low p-6 text-sm text-on-surface-variant">
            The catalog is temporarily unavailable. You can still browse collections or try again later.
          </p>
        ) : result.data?.length ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {result.data.map((product) => (
              <li key={product.id}><ProductCard product={product} /></li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-surface-container-highest bg-surface-container-low p-6 text-sm text-on-surface-variant">
            No products have been published yet. Check back soon.
          </p>
        )}
      </Container>
    </section>
  );
}
