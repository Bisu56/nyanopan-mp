"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  addToStoredCart,
  clearStoredCart,
  getCartSnapshot,
  getServerCartSnapshot,
  removeFromStoredCart,
  subscribeCart,
  updateStoredCartQuantity,
} from "@/lib/cart/store.mjs";
import type { CartLine } from "@/lib/cart/model.mjs";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  ready: boolean;
  addItem: (productId: string, variantId: string | null, name: string) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  removeItem: (productId: string, variantId: string | null, name: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const [notice, setNotice] = useState("");

  const addItem = useCallback((productId: string, variantId: string | null, name: string) => {
    addToStoredCart(productId, variantId);
    setNotice(`${name} added to your bag.`);
  }, []);
  const setQuantity = useCallback((productId: string, variantId: string | null, quantity: number) => {
    updateStoredCartQuantity(productId, variantId, quantity);
  }, []);
  const removeItem = useCallback((productId: string, variantId: string | null, name: string) => {
    removeFromStoredCart(productId, variantId);
    setNotice(`${name} removed from your bag.`);
  }, []);
  const clearCart = useCallback(() => {
    clearStoredCart();
    setNotice("Your order was placed. Your bag is now empty.");
  }, []);

  const value = useMemo(
    () => ({ ...cart, addItem, setQuantity, removeItem, clearCart }),
    [cart, addItem, setQuantity, removeItem, clearCart],
  );
  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 left-4 right-4 z-[60] flex justify-center sm:left-auto sm:right-6 sm:max-w-sm">
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className="flex w-full items-center justify-between gap-4 rounded-xl bg-on-surface px-4 py-3 text-sm font-medium text-white shadow-lg"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              className="rounded p-1 text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              onClick={() => setNotice("")}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used within CartProvider");
  return cart;
}
