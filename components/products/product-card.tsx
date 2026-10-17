import Link from "next/link";
import { ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatNpr } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/dal/products";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const inStock = product.stock_quantity > 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-surface-container-highest bg-white shadow-xs transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-container-low">
          <span className="absolute inset-0 bg-gradient-to-br from-primary-fixed/60 via-surface-container-low to-secondary-container/50" />
          <span className="relative flex flex-col items-center gap-2 text-on-surface-variant">
            <ImageOff aria-hidden className="h-8 w-8 opacity-70" />
            <span className="text-xs font-medium">Product photo coming soon</span>
          </span>
          <Badge tone={inStock ? "sage" : "neutral"} className="absolute left-3 top-3">
            {inStock ? "In stock" : "Out of stock"}
          </Badge>
        </div>
        <div className="space-y-2 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            {product.category?.name ?? "Nyanopan collection"}
          </p>
          <h3 className="font-serif text-lg font-bold leading-snug text-on-surface group-hover:text-primary">
            {product.name}
          </h3>
          <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-on-surface-variant">
            {product.description}
          </p>
          <p className="pt-1 text-sm font-bold text-on-surface">{formatNpr(product.price_paisa)}</p>
        </div>
      </Link>
    </article>
  );
}
