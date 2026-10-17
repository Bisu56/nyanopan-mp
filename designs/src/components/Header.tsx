import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenWishlist }) => {
  const { cart, wishlist, currency, setCurrency, activeView, setActiveView } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Shop All', view: 'shop-all', category: 'all' },
    { label: 'Felt Footwear', view: 'shop-all', category: 'footwear' },
    { label: 'Home Decor', view: 'shop-all', category: 'home-decor' },
    { label: 'Accessories', view: 'shop-all', category: 'accessories' },
    { label: 'Artisan Story', view: 'artisan-story' },
    { label: 'Gifting', view: 'shop-all', category: 'gifting' },
  ];

  const handleNavClick = (view: string, category?: string) => {
    setActiveView(view, category ? { category } : undefined);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f5]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(42,35,30,0.04)] border-b border-[#eee0d8]/50">
      {/* Announcement Bar */}
      <div className="w-full bg-[#f3e6dd] py-1.5 text-center px-4 md:px-6">
        <p className="text-[11px] md:text-xs text-[#55433e] font-medium tracking-wide">
          Handcrafted in the Kathmandu Valley • Free delivery inside Ring Road on orders above NPR 2,500 • Worldwide Artisan Shipping
        </p>
      </div>

      {/* Main Header Bar */}
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left cursor-pointer"
            aria-label="Nyanopan Home"
          >
            <img
              alt="Nyanopan Brand Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrF2ytbCMMkwonyMCkKjDUSJD0thKH1Zq9hmD24UwMQHIVcsp3L4fA08vJKrNND3A2OH5bREGS5n68QqVGd0BEoa6oPtN-n4ZGLagrfB_vDNLRV8in0kjIPJ3kN4_iC2CaHkvQ7QgfinvfCWxp7nEenIfEg4SEJEuufPeklzuuKZmDvfZxsis4gLB9EZp-3IHSeuBCa_FVHP5JXCRNfj7lDPeLri2Hw6Eg1LcBcHe_KLl-09lqMh3G"
            />
            <span className="font-serif text-2xl font-bold text-[#96432b] tracking-tight">
              Nyanopan
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 py-1 px-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              activeView === item.view ||
              (activeView === 'product-detail' && item.view === 'shop-all' && item.category === 'footwear');

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view, item.category)}
                className={`px-3 py-1.5 text-[14px] font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#b55b41] text-[#fffbff] font-semibold shadow-xs'
                    : 'text-[#55433e] hover:text-[#211a16] hover:bg-[#f9ebe3]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'NPR' ? 'USD' : 'NPR')}
            className="hidden sm:flex items-center px-2.5 py-1 bg-[#f9ebe3] hover:bg-[#f3e6dd] rounded-lg text-xs font-semibold text-[#211a16] transition-colors cursor-pointer"
            title="Toggle Currency"
          >
            <span>{currency === 'NPR' ? 'NPR (Rs.)' : 'USD ($)'}</span>
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Catalog"
            className="p-2 text-[#55433e] hover:text-[#211a16] hover:bg-[#f9ebe3] rounded-full transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="Saved Wishlist"
            className="relative p-2 text-[#55433e] hover:text-[#211a16] hover:bg-[#f9ebe3] rounded-full transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#96432b] text-white text-[10px] font-bold leading-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setActiveView('cart')}
            aria-label="Shopping Bag"
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              activeView === 'cart'
                ? 'bg-[#96432b] text-white'
                : 'text-[#55433e] hover:text-[#211a16] hover:bg-[#f9ebe3]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span
                className={`absolute top-0 right-0 w-4 h-4 text-[10px] font-bold leading-4 flex items-center justify-center rounded-full ${
                  activeView === 'cart'
                    ? 'bg-white text-[#96432b]'
                    : 'bg-[#96432b] text-white'
                }`}
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Account Avatar */}
          <div className="relative pl-1">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-label="User Account"
              className="flex items-center rounded-full ring-2 ring-[#eee0d8] hover:ring-[#96432b] transition-all cursor-pointer"
              type="button"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNm9emJ7tw_Ldh3N2gzvSGpCYWox0774Y-OhgOYohYTNDxe8Xo43j4prcOojnZ-e2SFsSaMPfBLpN5YJ1r_DrxLqEz8XGufXLwRSWliMaIFCqvAO7ChhXomwigNZmqNOwFxLCMnuf7UOYhC3s_zP_SKLTsixV6Crw9l4MoP7ZX0ZYL2tmfT6flrgV9A1AP4fa45rdcw1LG8ZN2OmL0-cTV9H8ACbliSLVbhppg68eeJ40vDEWp0Bwa"
              />
            </button>

            {/* Account Quick Dropdown */}
            {accountMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#eee0d8] py-2 z-50 text-xs"
                onClick={() => setAccountMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#eee0d8]">
                  <p className="font-semibold text-[#211a16]">Pooja Shrestha</p>
                  <p className="text-[#55433e] text-[11px]">pooja.shrestha@craftnepal.org</p>
                  <span className="inline-block mt-1 text-[10px] bg-[#d2e9d2] text-[#0d1f12] px-2 py-0.5 rounded-full font-medium">
                    Kathmandu Guild Member
                  </span>
                </div>
                <button
                  onClick={() => setActiveView('cart')}
                  className="w-full text-left px-4 py-2 hover:bg-[#fff1e9] text-[#211a16] flex items-center justify-between cursor-pointer"
                >
                  <span>My Handcrafted Bag</span>
                  <span className="font-bold text-[#96432b]">{totalCartCount}</span>
                </button>
                <button
                  onClick={() => setActiveView('checkout')}
                  className="w-full text-left px-4 py-2 hover:bg-[#fff1e9] text-[#211a16] flex items-center justify-between cursor-pointer"
                >
                  <span>Express Checkout</span>
                  <span className="material-symbols-outlined text-[16px] text-[#4f6352]">bolt</span>
                </button>
                <button
                  onClick={() => setActiveView('artisan-story')}
                  className="w-full text-left px-4 py-2 hover:bg-[#fff1e9] text-[#211a16] cursor-pointer"
                >
                  Artisan Collective Story
                </button>
                <div className="border-t border-[#eee0d8] mt-1 pt-1">
                  <div className="px-4 py-1.5 text-[11px] text-[#55433e]">
                    Currency: <span className="font-bold text-[#96432b]">{currency}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#55433e] hover:text-[#211a16] rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fff8f5] border-b border-[#eee0d8] px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.view, item.category)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#211a16] hover:bg-[#f9ebe3] rounded-lg transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#eee0d8] flex items-center justify-between">
            <span className="text-xs text-[#55433e]">Display Currency:</span>
            <button
              onClick={() => setCurrency(currency === 'NPR' ? 'USD' : 'NPR')}
              className="px-3 py-1 bg-[#f9ebe3] rounded-lg text-xs font-semibold text-[#211a16]"
            >
              {currency === 'NPR' ? 'NPR (Rs.)' : 'USD ($)'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
