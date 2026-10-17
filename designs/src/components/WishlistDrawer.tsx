import React from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart, setActiveView, formatPrice } = useCart();

  if (!isOpen) return null;

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#2A231E]/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fff8f5] h-full shadow-2xl flex flex-col z-10 border-l border-[#eee0d8] animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-[#eee0d8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#96432b]">favorite</span>
            <h3 className="font-serif text-lg font-bold text-[#211a16]">
              Saved Artisan Pieces ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#f9ebe3] text-[#55433e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="text-center py-12 text-[#55433e] space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#dbc1ba]">favorite_border</span>
              <p className="text-sm font-semibold text-[#211a16]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#55433e]">
                Explore our Himalayan felt slippers and home goods to save your favorite artisan pieces.
              </p>
              <button
                onClick={() => {
                  setActiveView('shop-all');
                  onClose();
                }}
                className="mt-2 px-4 py-2 bg-[#96432b] text-white rounded-lg text-xs font-semibold"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            savedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-xs border border-[#eee0d8]"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-20 rounded-lg object-cover bg-[#f9ebe3] cursor-pointer"
                  onClick={() => {
                    setActiveView('product-detail', { productId: product.id });
                    onClose();
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-xs font-bold text-[#211a16] truncate cursor-pointer hover:text-[#96432b]"
                    onClick={() => {
                      setActiveView('product-detail', { productId: product.id });
                      onClose();
                    }}
                  >
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-[#55433e] truncate">{product.origin}</p>
                  <p className="text-xs font-bold text-[#96432b] mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="p-1.5 bg-[#f9ebe3] hover:bg-[#96432b] hover:text-white text-[#96432b] rounded-lg text-xs transition-colors cursor-pointer"
                    title="Add to Bag"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
