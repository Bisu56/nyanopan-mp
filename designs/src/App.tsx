import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { ArtisanStoryView } from './views/ArtisanStoryView';

const MainContent: React.FC = () => {
  const { activeView, selectedProductId, toastMessage } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#211a16] antialiased">
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211a16] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-fadeIn border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#4f6352]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Main View Container (with padding-top to account for fixed header) */}
      <main className="flex-1 pt-28">
        {activeView === 'home' && <HomeView />}
        {activeView === 'shop-all' && <CatalogView />}
        {activeView === 'product-detail' && (
          <ProductDetailView productId={selectedProductId} />
        )}
        {activeView === 'cart' && <CartView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'artisan-story' && <ArtisanStoryView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
