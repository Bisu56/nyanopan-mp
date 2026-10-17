import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { setActiveView, formatPrice } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-[#2A231E]/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-[#fff8f5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#eee0d8] overflow-hidden z-10 animate-fadeIn">
        {/* Search Input */}
        <div className="p-4 border-b border-[#eee0d8] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#96432b]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search felt slippers, coasters, dryer balls, cat caves..."
            className="w-full bg-transparent text-sm text-[#211a16] placeholder:text-[#88726c] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#55433e] hover:text-[#211a16] p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#f9ebe3] text-[#55433e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs text-[#55433e]">
              <p className="font-semibold text-[#211a16] mb-1">Popular Artisan Searches:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {['Patan Classic Slipper', 'Trivet Set', 'Low-Back Mule', 'Pet Cave', 'Dryer Balls'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 bg-[#f9ebe3] hover:bg-[#f3e6dd] rounded-full text-xs text-[#211a16] transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#55433e]">
              <p>No handcrafted pieces found matching "{query}".</p>
              <p className="mt-1 text-[#88726c]">Try searching for wool, felt, slipper, or Patan.</p>
            </div>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setActiveView('product-detail', { productId: product.id });
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-[#fff1e9] rounded-xl transition-colors text-left group cursor-pointer"
              >
                <div className="w-12 h-14 rounded-lg bg-[#f9ebe3] overflow-hidden shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#211a16] truncate group-hover:text-[#96432b]">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-[#55433e] truncate">{product.categoryLabel} • {product.origin}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#96432b]">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
