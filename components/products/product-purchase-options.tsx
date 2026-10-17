"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { buttonClassName } from "@/components/ui/button";
import type { ProductVariantRow } from "@/lib/supabase/types";

export function ProductPurchaseOptions({
  productId,
  productName,
  stockQuantity,
  variants,
  hasVariants,
}: {
  productId: string;
  productName: string;
  stockQuantity: number;
  variants: ProductVariantRow[];
  hasVariants: boolean;
}) {
  const { addItem, ready } = useCart();
  const [variantId, setVariantId] = useState("");
  const availableVariants = variants.filter((variant) => variant.is_active);
  const selected = availableVariants.find((variant) => variant.id === variantId);
  const outOfStock = hasVariants
    ? availableVariants.length === 0 || !availableVariants.some((variant) => variant.stock_quantity > 0)
    : stockQuantity <= 0;
  const disabled =
    !ready || outOfStock || (hasVariants && (!selected || selected.stock_quantity <= 0));

  return (
    <div className="mt-7 w-full">
      {hasVariants && (
        <div className="mb-4">
          <label htmlFor="product-variant" className="mb-2 block text-sm font-bold text-on-surface">
            Choose an option
          </label>
          <select
            id="product-variant"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-outline-variant bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
            disabled={!availableVariants.length}
          >
            <option value="">Select a size or option</option>
            {availableVariants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={variant.stock_quantity < 1}>
                {variant.size_label}{variant.stock_quantity < 1 ? " — Out of stock" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => addItem(productId, hasVariants ? variantId : null, productName)}
        className={buttonClassName({ variant: "primary", size: "lg", className: "w-full" })}
      >
        <ShoppingBag aria-hidden className="h-5 w-5" />
        {outOfStock ? "Out of stock" : "Add to bag"}
      </button>
      {hasVariants && !selected && !outOfStock && (
        <p className="mt-2 text-xs text-on-surface-variant">Choose an available option to add this item.</p>
      )}
    </div>
  );
}
