"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { buttonClassName } from "@/components/ui/button";

export function AddToCartButton({
  productId,
  name,
  disabled = false,
  className,
}: {
  productId: string;
  name: string;
  disabled?: boolean;
  className?: string;
}) {
  const { addItem, ready } = useCart();

  return (
    <button
      type="button"
      disabled={disabled || !ready}
      onClick={() => addItem(productId, null, name)}
      className={buttonClassName({
        variant: "primary",
        size: "md",
        className: `w-full ${className ?? ""}`,
      })}
    >
      <ShoppingBag aria-hidden className="h-4 w-4" />
      {disabled ? "Out of stock" : "Add to bag"}
    </button>
  );
}
