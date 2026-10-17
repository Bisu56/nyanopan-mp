import React from 'react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useCart();

  return (
    <footer className="w-full bg-[#fff1e9] text-[#211a16] mt-16 border-t border-[#eee0d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-[#96432b] tracking-tight">
                Nyanopan
              </span>
            </div>
            <p className="text-sm text-[#55433e] leading-relaxed max-w-sm">
              Made with care. Rooted in Nepal. Empowering local women artisans through ethically
              handmade wool felt footwear and mindful home goods.
            </p>
            <div className="flex items-center gap-2 text-[#4f6352] text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Authentic Craft of Patan &amp; Kathmandu</span>
            </div>
          </div>

          {/* Shop Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-[#211a16] tracking-wider uppercase">
              Shop Collections
            </h3>
            <ul className="space-y-2 text-xs text-[#55433e]">
              <li>
                <button
                  onClick={() => setActiveView('shop-all', { category: 'footwear' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Wool Felt Slippers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop-all', { category: 'footwear' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Cozy Indoor Boots
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop-all', { category: 'home-decor' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Felt Ball Rugs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop-all', { category: 'home-decor' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Trivets &amp; Coasters
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop-all', { category: 'home-decor' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Felted Pet Caves
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop-all', { category: 'accessories' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Wool Dryer Balls
                </button>
              </li>
            </ul>
          </div>

          {/* Artisan & Craft */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-[#211a16] tracking-wider uppercase">
              Artisan &amp; Craft
            </h3>
            <ul className="space-y-2 text-xs text-[#55433e]">
              <li>
                <button
                  onClick={() => setActiveView('artisan-story')}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Our Kathmandu Workshop
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('artisan-story')}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  100% Himalayan &amp; NZ Wool
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('artisan-story')}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Fair Trade Practices
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('product-detail', { productId: 'patan-classic-slipper' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Care Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-[#211a16] tracking-wider uppercase">
              Customer Care &amp; Nepal Delivery
            </h3>
            <ul className="space-y-2 text-xs text-[#55433e]">
              <li>
                <button
                  onClick={() => setActiveView('checkout')}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Delivery across 7 Provinces
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('checkout')}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Track My Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('product-detail', { productId: 'patan-classic-slipper' })}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Returns &amp; Exchanges
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('cart')}
                  className="hover:text-[#96432b] transition-colors cursor-pointer"
                >
                  Shopping Bag
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="mt-12 pt-6 border-t border-[#eee0d8] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#55433e] mr-1">Accepted Nepal &amp; Global Payments:</span>
            <span className="px-2 py-0.5 bg-[#f9ebe3] rounded text-[11px] font-bold text-[#4f6352] shadow-xs">
              eSewa
            </span>
            <span className="px-2 py-0.5 bg-[#f9ebe3] rounded text-[11px] font-bold text-[#96432b] shadow-xs">
              Khalti
            </span>
            <span className="px-2 py-0.5 bg-[#f9ebe3] rounded text-[11px] font-bold text-[#211a16] shadow-xs">
              Fonepay
            </span>
            <span className="px-2 py-0.5 bg-[#f9ebe3] rounded text-[11px] font-semibold text-[#55433e] shadow-xs">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 bg-[#f9ebe3] rounded text-[11px] font-semibold text-[#55433e] shadow-xs">
              Visa / SCT
            </span>
          </div>
          <p className="text-xs text-[#55433e] text-center md:text-right">
            © 2025 Nyanopan Handcrafted Pvt. Ltd. All rights reserved. Kathmandu, Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
};
