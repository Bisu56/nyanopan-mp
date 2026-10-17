import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { buttonClassName } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/dal/products";
import { formatNpr } from "@/lib/format";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  if (!result.data) return { title: "Product" };

  return {
    title: result.data.name,
    description: result.data.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (result.error) {
    return (
      <Container className="py-16 sm:py-24">
        <section role="alert" className="mx-auto max-w-xl rounded-2xl border border-error-container bg-error-container/30 p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-on-surface">Product details are unavailable</h1>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            We couldn&apos;t load this product. Please return to the catalog and try again.
          </p>
          <Link href="/products" className={`${buttonClassName({ variant: "secondary" })} mt-5`}>
            <ArrowLeft aria-hidden className="h-4 w-4" /> Back to products
          </Link>
        </section>
      </Container>
    );
  }

  if (!result.data) notFound();
  const product = result.data;
  const availableVariants = product.variants.filter((variant) => variant.is_active);
  const inStock = availableVariants.length
    ? availableVariants.some((variant) => variant.stock_quantity > 0)
    : product.stock_quantity > 0;

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-on-surface-variant">
        <Link href="/products" className="hover:text-primary">Shop</Link>
        {product.category && (
          <>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2" aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-on-surface">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex aspect-square min-h-64 items-center justify-center overflow-hidden rounded-3xl border border-surface-container-highest bg-gradient-to-br from-primary-fixed/70 via-surface-container-low to-secondary-container/60">
          <div className="flex flex-col items-center gap-3 text-center text-on-surface-variant">
            <ImageOff aria-hidden className="h-10 w-10 opacity-70" />
            <p className="text-sm font-medium">Product photo coming soon</p>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <Badge tone="sage">{product.category?.name ?? "Nyanopan collection"}</Badge>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-on-surface sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-primary">{formatNpr(product.price_paisa)}</p>
          <p className="mt-5 whitespace-pre-line text-base leading-7 text-on-surface-variant">
            {product.description}
          </p>

          <div className="mt-6">
            <Badge tone={inStock ? "sage" : "neutral"}>
              {inStock ? "In stock" : "Currently unavailable"}
            </Badge>
          </div>

          {availableVariants.length > 0 && (
            <section className="mt-7 w-full" aria-labelledby="available-sizes">
              <h2 id="available-sizes" className="text-sm font-bold text-on-surface">
                Available variants
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {availableVariants.map((variant) => (
                  <li key={variant.id}>
                    <span className="inline-flex min-h-10 items-center rounded-lg border border-outline-variant bg-white px-3 text-sm text-on-surface">
                      {variant.size_label}
                      {variant.stock_quantity < 1 ? " · Out of stock" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-7 border-t border-surface-container-highest pt-5 text-xs leading-relaxed text-on-surface-variant">
            Product information and availability are read from the Nyanopan catalog. Ordering will
            be available in a later milestone.
          </p>
          <Link href="/products" className={`${buttonClassName({ variant: "secondary" })} mt-6`}>
            <ArrowLeft aria-hidden className="h-4 w-4" /> Continue browsing
          </Link>
        </div>
      </div>
    </Container>
  );
}
