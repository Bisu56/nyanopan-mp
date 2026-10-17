import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { PRODUCTS } from '../data/products';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, options?: { color?: string; size?: number; quantity?: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  giftNoteEnabled: boolean;
  setGiftNoteEnabled: (enabled: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountAmount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  currency: 'NPR' | 'USD';
  setCurrency: (c: 'NPR' | 'USD') => void;
  formatPrice: (nprAmount: number) => string;
  subtotal: number;
  totalQuantity: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  shippingPercentage: number;
  activeView: string;
  setActiveView: (view: string, params?: { productId?: string; category?: string }) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    productId: 'patan-classic-slipper',
    name: 'The Patan Classic Felt Slipper',
    categoryLabel: 'Footwear',
    price: 3850,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTxXC17Ck1QPlq1S6cjPmWiYKPLiRGKHL_PdIsVwyhYXIdZy9_0cTb3r6m2tF2_RxqBami8D67pIH--QfTeWhJEbBSEYfkqJFJmdz-zqzHEnAZTdzF-f2LtuRyqOlNv-q56tOe5FwIWxdQIAFXcGzoLEOoB42VCmGBBp8gW8N2JhmMw3m_TwEhY8dNcmP2knOkXp98XS8KasUjYoqzOlX9Q2Ved-THM3DPlzGHbvkCO_313-J4PY_A',
    selectedColor: 'Terracotta Clay',
    selectedSize: 39,
    soleType: 'Buffalo Suede Indoor Sole',
    quantity: 1,
    originLocation: 'Patan',
  },
  {
    id: 'cart-2',
    productId: 'himalayan-felt-pebble-trivet',
    name: 'Himalayan Felt Ball Trivet (Set of 2)',
    categoryLabel: 'Living & Dining',
    price: 1200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBULij2MRrnVvv3PDg6qhSZaFGwDkt-7ZB8sT0304Q_ZWT_Xk_OmZXiILurnzHc0hSUB1YQsvu32xoSHjfBBLKpJklx5UG4qnm7fqIZt5E_cWM1MWkPQBo-G602yDAcDYtlVQHVH5vAILYReMwwJV5mItsDK6ARVMc7IyjXhpczhG7Vga6U1P0DMFeu1iYn-k9x3sm5yi8VDAawWFNIHHN_WTtMg41ULptpboHrT5gmHSH0WoTRKNcZ',
    selectedColor: 'Earth Tones & Sage',
    soleType: '100% High-Mountain Wool',
    quantity: 2,
    originLocation: 'Kathmandu',
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nyanopan_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART_ITEMS;
    } catch {
      return INITIAL_CART_ITEMS;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nyanopan_wishlist');
      return saved ? JSON.parse(saved) : ['patan-classic-slipper', 'langtang-ankle-bootie'];
    } catch {
      return ['patan-classic-slipper', 'langtang-ankle-bootie'];
    }
  });

  const [giftNoteEnabled, setGiftNoteEnabled] = useState(true);
  const [giftMessage, setGiftMessage] = useState(
    'To a warm home in Pokhara, sending cozy footsteps and Himalayan warmth for your new terrace apartment. With love, Ananya'
  );
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(300); // Default Artisan Support Credit of NPR 300 as in mockup
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR');
  const [activeView, setActiveViewState] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('patan-classic-slipper');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('nyanopan_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nyanopan_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setActiveView = (view: string, params?: { productId?: string; category?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.category) {
      setCategoryFilter(params.category);
    }
    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    product: Product,
    options?: { color?: string; size?: number; quantity?: number }
  ) => {
    const qty = options?.quantity || 1;
    const selectedColor = options?.color || product.colors[0]?.name || 'Standard';
    const selectedSize = options?.size || product.sizes?.[3] || product.sizes?.[0];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += qty;
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        name: product.name,
        categoryLabel: product.categoryLabel,
        price: product.price,
        image: product.images[0],
        selectedColor,
        selectedSize,
        soleType: product.soleType || 'Buffalo Suede Indoor Sole',
        quantity: qty,
        originLocation: product.origin.includes('Patan') ? 'Patan' : 'Kathmandu',
      };
      return [...prev, newItem];
    });

    showToast(`Added "${product.name}" to your handcrafted bag`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast('Your bag has been cleared');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items');
        return prev.filter((id) => id !== productId);
      } else {
        const p = PRODUCTS.find((x) => x.id === productId);
        showToast(`Saved "${p?.name || 'Item'}" to your wishlist`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'HIMALAYANWINTER') {
      setDiscountAmount(500);
      setPromoCode(cleaned);
      showToast('Promotional voucher "HIMALAYANWINTER" applied: NPR 500 off!');
      return { success: true, message: 'Voucher applied! NPR 500 Artisan Credit.' };
    } else if (cleaned === 'NYANO10') {
      setDiscountAmount(650);
      setPromoCode(cleaned);
      showToast('Voucher "NYANO10" applied: 10% seasonal discount!');
      return { success: true, message: '10% discount applied!' };
    } else if (cleaned === 'FREESHIP') {
      showToast('Voucher applied: Instant free expedited shipping!');
      return { success: true, message: 'Free expedited delivery applied!' };
    } else {
      return { success: false, message: 'Invalid or expired promotional voucher code' };
    }
  };

  const formatPrice = (nprAmount: number) => {
    if (currency === 'USD') {
      const usd = (nprAmount / 133).toFixed(2);
      return `$${usd}`;
    }
    return `NPR ${nprAmount.toLocaleString()}`;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 2500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        giftNoteEnabled,
        setGiftNoteEnabled,
        giftMessage,
        setGiftMessage,
        promoCode,
        setPromoCode,
        discountAmount,
        applyPromoCode,
        currency,
        setCurrency,
        formatPrice,
        subtotal,
        totalQuantity,
        freeShippingThreshold,
        isFreeShipping,
        amountNeededForFreeShipping,
        shippingPercentage,
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        categoryFilter,
        setCategoryFilter,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
