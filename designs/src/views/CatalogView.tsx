import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { SizeGuideModal } from '../components/SizeGuideModal';

export const CatalogView: React.FC = () => {
  const {
    categoryFilter,
    setCategoryFilter,
    addToCart,
    setActiveView,
    formatPrice,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [pricePreset, setPricePreset] = useState<'all' | 'under2500' | 'mid' | 'above5000'>('all');
  const [selectedPigment, setSelectedPigment] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([38, 41]);
  const [selectedSole, setSelectedSole] = useState<string | null>(null);
  const [pureWoolOnly, setPureWoolOnly] = useState(true);
  const [fairTradeOnly, setFairTradeOnly] = useState(true);
  const [zeroGluesOnly, setZeroGluesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Curated / Featured');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pigments = [
    { name: 'Terracotta', hex: '#B85D43' },
    { name: 'Oatmeal', hex: '#EAE2D7' },
    { name: 'Pine', hex: '#4F6352' },
    { name: 'Ochre', hex: '#C99E5C' },
    { name: 'Charcoal', hex: '#362F2A' },
    { name: 'Sand', hex: '#DBC1BA' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter);
    }

    // Price preset
    if (pricePreset === 'under2500') {
      list = list.filter((p) => p.price < 2500);
    } else if (pricePreset === 'mid') {
      list = list.filter((p) => p.price >= 2500 && p.price <= 5000);
    } else if (pricePreset === 'above5000') {
      list = list.filter((p) => p.price > 5000);
    }

    // Pigment filter
    if (selectedPigment) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase().includes(selectedPigment.toLowerCase()))
      );
    }

    // Sole type filter
    if (selectedSole) {
      list = list.filter((p) => p.soleType?.includes(selectedSole));
    }

    // Sorting
    if (sortBy === 'Price: Low to High') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Most Reviewed by Valley Residents') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'Newest Batch') {
      list.sort((a, b) => (b.stockRemaining || 0) - (a.stockRemaining || 0));
    }

    return list;
  }, [categoryFilter, pricePreset, selectedPigment, selectedSole, sortBy]);

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setPricePreset('all');
    setSelectedPigment(null);
    setSelectedSole(null);
    setSelectedSizes([]);
  };

  const toggleSizeFilter = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="w-full relative">
      {/* Subtle Atmospheric Gradient Backing */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#96432b]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#4f6352]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#55433e] text-xs mb-4">
          <button onClick={() => setActiveView('home')} className="hover:text-[#96432b] cursor-pointer">
            Home
          </button>
          <span className="text-[#55433e]/50">/</span>
          <span className="text-[#211a16] font-medium">Shop All Handcrafted Goods</span>
        </nav>

        {/* Editorial Catalog Header */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d2e9d2]/60 text-[#556957] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f6352]"></span>
                <span>Authentic Himalayan Woolcraft</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl text-[#211a16] font-bold tracking-tight">
                Handmade Felt Collections
              </h1>
              <p className="text-sm md:text-base text-[#55433e] max-w-2xl leading-relaxed">
                Each piece is hand-felted in the Kathmandu Valley using 100% pure wool, non-toxic
                organic mineral dyes, and zero synthetic glues. Sculpted slowly in limited artisan
                batches.
              </p>
            </div>

            {/* Batch Highlight Metric Card */}
            <div className="flex items-center gap-6 bg-[#fff1e9] p-4 rounded-2xl shadow-xs border border-[#eee0d8] self-start lg:self-auto">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#55433e] block uppercase tracking-wider font-semibold">
                  Current Cycle
                </span>
                <p className="font-serif text-lg font-bold text-[#96432b]">Winter Batch #14</p>
              </div>
              <div className="w-px h-10 bg-[#dbc1ba]/40"></div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#55433e] block uppercase tracking-wider font-semibold">
                  Artisan Co-op
                </span>
                <p className="font-serif text-lg font-bold text-[#4f6352]">38 Guild Hands</p>
              </div>
            </div>
          </div>

          {/* Filter Sub-bar: Active Chips & Sort Dropdown */}
          <div className="mt-6 pt-3 bg-white/70 backdrop-blur-xs rounded-xl p-3 sm:p-4 shadow-xs border border-[#eee0d8] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#211a16] mr-1">
                Showing {filteredProducts.length} Artisan Goods
              </span>

              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-[#f3e6dd] px-3 py-1 rounded-full text-[#211a16] text-xs">
                  <span>Category: {categoryFilter}</span>
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className="text-[#55433e] hover:text-[#ba1a1a] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              {pricePreset !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-[#f3e6dd] px-3 py-1 rounded-full text-[#211a16] text-xs">
                  <span>
                    {pricePreset === 'under2500'
                      ? 'Under NPR 2,500'
                      : pricePreset === 'mid'
                      ? 'NPR 2,500 – 5,000'
                      : 'Above NPR 5,000'}
                  </span>
                  <button
                    onClick={() => setPricePreset('all')}
                    className="text-[#55433e] hover:text-[#ba1a1a] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              {selectedPigment && (
                <span className="inline-flex items-center gap-1.5 bg-[#f3e6dd] px-3 py-1 rounded-full text-[#211a16] text-xs">
                  <span>Pigment: {selectedPigment}</span>
                  <button
                    onClick={() => setSelectedPigment(null)}
                    className="text-[#55433e] hover:text-[#ba1a1a] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              {(categoryFilter !== 'all' || pricePreset !== 'all' || selectedPigment) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[#96432b] hover:text-[#833822] text-xs underline underline-offset-4 ml-1 cursor-pointer font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Sort Select Control */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <label
                htmlFor="catalog-sort"
                className="text-xs text-[#55433e] whitespace-nowrap font-medium"
              >
                Sort by:
              </label>
              <div className="relative">
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#f9ebe3] pl-3 pr-8 py-1.5 rounded-lg text-[#211a16] text-xs font-semibold focus:outline-none focus:bg-[#f3e6dd] cursor-pointer shadow-xs border border-[#eee0d8]"
                >
                  <option>Curated / Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Batch</option>
                  <option>Most Reviewed by Valley Residents</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#55433e] text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Catalog Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eee0d8] space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#eee0d8]">
                <h2 className="text-xs font-bold text-[#211a16] uppercase tracking-wider">
                  Refine Goods
                </h2>
                <span className="material-symbols-outlined text-[#4f6352] text-[20px]">tune</span>
              </div>

              {/* Categories Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#211a16] flex items-center justify-between">
                  <span>Category</span>
                </h3>
                <ul className="space-y-1 text-xs pt-1">
                  <li>
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`w-full flex items-center justify-between py-1 transition-colors cursor-pointer ${
                        categoryFilter === 'all'
                          ? 'text-[#96432b] font-bold'
                          : 'text-[#55433e] hover:text-[#96432b]'
                      }`}
                    >
                      <span>All Collections</span>
                      <span className="text-[11px] text-[#88726c]">{PRODUCTS.length}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCategoryFilter('footwear')}
                      className={`w-full flex items-center justify-between py-1 transition-colors cursor-pointer ${
                        categoryFilter === 'footwear'
                          ? 'text-[#96432b] font-bold'
                          : 'text-[#55433e] hover:text-[#96432b]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {categoryFilter === 'footwear' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#96432b]"></span>
                        )}
                        Felt Footwear
                      </span>
                      <span className="bg-[#96432b]/10 text-[#96432b] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                        {PRODUCTS.filter((p) => p.category === 'footwear').length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCategoryFilter('home-decor')}
                      className={`w-full flex items-center justify-between py-1 transition-colors cursor-pointer ${
                        categoryFilter === 'home-decor'
                          ? 'text-[#96432b] font-bold'
                          : 'text-[#55433e] hover:text-[#96432b]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {categoryFilter === 'home-decor' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#96432b]"></span>
                        )}
                        Home Decor &amp; Rugs
                      </span>
                      <span className="text-[11px] text-[#88726c]">
                        {PRODUCTS.filter((p) => p.category === 'home-decor').length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCategoryFilter('accessories')}
                      className={`w-full flex items-center justify-between py-1 transition-colors cursor-pointer ${
                        categoryFilter === 'accessories'
                          ? 'text-[#96432b] font-bold'
                          : 'text-[#55433e] hover:text-[#96432b]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {categoryFilter === 'accessories' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#96432b]"></span>
                        )}
                        Warm Accessories
                      </span>
                      <span className="text-[11px] text-[#88726c]">
                        {PRODUCTS.filter((p) => p.category === 'accessories').length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCategoryFilter('gifting')}
                      className={`w-full flex items-center justify-between py-1 transition-colors cursor-pointer ${
                        categoryFilter === 'gifting'
                          ? 'text-[#96432b] font-bold'
                          : 'text-[#55433e] hover:text-[#96432b]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {categoryFilter === 'gifting' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#96432b]"></span>
                        )}
                        Mindful Gifting
                      </span>
                      <span className="text-[11px] text-[#88726c]">
                        {PRODUCTS.filter((p) => p.category === 'gifting').length}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Price Filter Section */}
              <div className="space-y-2 pt-2 border-t border-[#eee0d8]">
                <h3 className="text-xs font-bold text-[#211a16]">Price (NPR)</h3>
                <div className="flex flex-col gap-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPricePreset(pricePreset === 'under2500' ? 'all' : 'under2500')}
                    className={`text-left transition-colors cursor-pointer ${
                      pricePreset === 'under2500' ? 'text-[#96432b] font-bold' : 'text-[#55433e] hover:text-[#96432b]'
                    }`}
                  >
                    Under Rs. 2,500
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricePreset(pricePreset === 'mid' ? 'all' : 'mid')}
                    className={`text-left transition-colors cursor-pointer ${
                      pricePreset === 'mid' ? 'text-[#96432b] font-bold' : 'text-[#55433e] hover:text-[#96432b]'
                    }`}
                  >
                    Rs. 2,500 — Rs. 5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricePreset(pricePreset === 'above5000' ? 'all' : 'above5000')}
                    className={`text-left transition-colors cursor-pointer ${
                      pricePreset === 'above5000' ? 'text-[#96432b] font-bold' : 'text-[#55433e] hover:text-[#96432b]'
                    }`}
                  >
                    Above Rs. 5,000
                  </button>
                </div>
              </div>

              {/* Color Palette Filter */}
              <div className="space-y-2 pt-2 border-t border-[#eee0d8]">
                <h3 className="text-xs font-bold text-[#211a16]">Artisan Pigment</h3>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {pigments.map((pigment) => {
                    const isSelected = selectedPigment === pigment.name;
                    return (
                      <button
                        key={pigment.name}
                        type="button"
                        onClick={() => setSelectedPigment(isSelected ? null : pigment.name)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                        title={pigment.name}
                      >
                        <span
                          className={`w-7 h-7 rounded-full shadow-xs transition-transform group-hover:scale-105 ${
                            isSelected
                              ? 'ring-2 ring-[#96432b] ring-offset-2 ring-offset-white scale-110'
                              : ''
                          }`}
                          style={{ backgroundColor: pigment.hex }}
                        ></span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? 'font-bold text-[#96432b]' : 'text-[#55433e]'
                          }`}
                        >
                          {pigment.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shoe Size Filter (EU) */}
              <div className="space-y-2 pt-2 border-t border-[#eee0d8]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#211a16]">Footwear Size (EU)</h3>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[11px] text-[#96432b] hover:underline cursor-pointer"
                  >
                    Size Chart
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSizeFilter(size)}
                        className={`py-1.5 rounded text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#96432b] text-white font-bold shadow-xs'
                            : 'bg-[#f9ebe3] text-[#211a16] hover:bg-[#f3e6dd]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sole Type Filter */}
              <div className="space-y-2 pt-2 border-t border-[#eee0d8]">
                <h3 className="text-xs font-bold text-[#211a16]">Underfoot Sole</h3>
                <div className="space-y-2 pt-1 text-xs">
                  <label
                    className="flex items-center gap-2 cursor-pointer group select-none"
                    onClick={() =>
                      setSelectedSole(selectedSole === 'Suede' ? null : 'Suede')
                    }
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[12px] border ${
                        selectedSole === 'Suede'
                          ? 'bg-[#96432b] border-[#96432b] text-white'
                          : 'border-[#88726c] bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-[#211a16] group-hover:text-[#96432b]">
                      Buffalo Suede (Indoor Silent)
                    </span>
                  </label>
                  <label
                    className="flex items-center gap-2 cursor-pointer group select-none"
                    onClick={() =>
                      setSelectedSole(selectedSole === 'Crepe' ? null : 'Crepe')
                    }
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[12px] border ${
                        selectedSole === 'Crepe'
                          ? 'bg-[#96432b] border-[#96432b] text-white'
                          : 'border-[#88726c] bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-[#55433e] group-hover:text-[#96432b]">
                      Crepe Natural Rubber (Dual-Use)
                    </span>
                  </label>
                </div>
              </div>

              {/* Craft Certification */}
              <div className="space-y-2 pt-2 border-t border-[#eee0d8]">
                <h3 className="text-xs font-bold text-[#211a16]">Integrity Marks</h3>
                <div className="space-y-2 pt-1 text-xs">
                  <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setPureWoolOnly(!pureWoolOnly)}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[12px] border ${
                        pureWoolOnly
                          ? 'bg-[#96432b] border-[#96432b] text-white'
                          : 'border-[#88726c] bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-[#211a16]">100% Pure Himalayan Wool</span>
                  </label>
                  <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setFairTradeOnly(!fairTradeOnly)}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[12px] border ${
                        fairTradeOnly
                          ? 'bg-[#96432b] border-[#96432b] text-white'
                          : 'border-[#88726c] bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-[#211a16]">Fair Trade Certified Nepal</span>
                  </label>
                  <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setZeroGluesOnly(!zeroGluesOnly)}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[12px] border ${
                        zeroGluesOnly
                          ? 'bg-[#96432b] border-[#96432b] text-white'
                          : 'border-[#88726c] bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-[#55433e]">Zero Chemical Glues</span>
                  </label>
                </div>
              </div>

              {/* Artisan Spotlight mini-callout */}
              <div className="p-4 rounded-xl bg-[#f3e6dd]/60 space-y-1 border border-[#eee0d8]">
                <div className="flex items-center gap-1.5 text-[#4f6352]">
                  <span className="material-symbols-outlined text-[18px]">nature_people</span>
                  <span className="text-[11px] font-bold">Fair Wage Verified</span>
                </div>
                <p className="text-[11px] text-[#55433e] leading-relaxed">
                  100% of our feltcrafters in Patan receive dignified livable earnings, healthcare
                  access, and flexible mother-first work hours.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9 flex flex-col space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isFavorited = isInWishlist(product.id);
                return (
                  <article
                    key={product.id}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-[#eee0d8]"
                  >
                    {/* Image Area */}
                    <div
                      className="relative aspect-[4/5] bg-[#fff1e9] overflow-hidden cursor-pointer"
                      onClick={() => setActiveView('product-detail', { productId: product.id })}
                    >
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.images[0]}
                        alt={product.name}
                      />
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
                        {product.tag && (
                          <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#4f6352] text-[11px] font-semibold border border-[#eee0d8]">
                            {product.tag}
                          </span>
                        )}
                        {product.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f9ebe3]/90 backdrop-blur-xs text-[#55433e] text-[10px] font-medium border border-[#eee0d8]">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Wishlist button */}
                      <button
                        type="button"
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer border border-[#eee0d8] ${
                          isFavorited
                            ? 'bg-[#96432b] text-white'
                            : 'bg-white/90 hover:bg-white text-[#211a16]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                      </button>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                      <div
                        className="space-y-1 cursor-pointer"
                        onClick={() => setActiveView('product-detail', { productId: product.id })}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#55433e] font-medium">
                            {product.soleType || product.categoryLabel}
                          </span>
                          <div className="flex items-center gap-1 text-[#E09422]">
                            <span
                              className="material-symbols-outlined text-[14px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span className="text-xs font-bold text-[#211a16]">{product.rating}</span>
                            <span className="text-[#88726c] text-[11px]">
                              ({product.reviewsCount})
                            </span>
                          </div>
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#55433e] line-clamp-1">{product.description}</p>
                      </div>

                      <div className="pt-1 space-y-2 border-t border-[#eee0d8]/60">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-lg font-bold text-[#96432b]">
                            {formatPrice(product.price)}
                          </span>
                          {/* Color dots */}
                          <div className="flex items-center gap-1">
                            {product.colors.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-black/10"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#96432b] hover:bg-[#833822] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Pagination & Assurance Note */}
            <div className="pt-4 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous Page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-9 h-9 rounded-lg bg-[#f9ebe3] text-[#55433e] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === 1
                      ? 'bg-[#96432b] text-white shadow-xs'
                      : 'bg-[#f9ebe3] text-[#211a16] hover:bg-[#f3e6dd]'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === 2
                      ? 'bg-[#96432b] text-white shadow-xs'
                      : 'bg-[#f9ebe3] text-[#211a16] hover:bg-[#f3e6dd]'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === 3
                      ? 'bg-[#96432b] text-white shadow-xs'
                      : 'bg-[#f9ebe3] text-[#211a16] hover:bg-[#f3e6dd]'
                  }`}
                >
                  3
                </button>
                <button
                  type="button"
                  aria-label="Next Page"
                  disabled={currentPage === 3}
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="w-9 h-9 rounded-lg bg-[#f9ebe3] hover:bg-[#f3e6dd] text-[#211a16] flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>

              <p className="text-xs text-[#55433e]">
                Showing {filteredProducts.length} filtered goods ({PRODUCTS.length} catalog total)
              </p>

              {/* Artisan Assurance Banner */}
              <div className="w-full mt-2 p-4 bg-[#d2e9d2]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-2 text-center border border-[#d2e9d2]">
                <span className="material-symbols-outlined text-[#4f6352] text-[22px]">
                  workspace_premium
                </span>
                <p className="text-xs text-[#556957] font-medium leading-relaxed">
                  Every single purchase directly supports independent female felt artisans in Patan
                  &amp; Bhaktapur with fair living wages and traditional craft preservation.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        selectedSize={39}
        onSelectSize={() => setSizeGuideOpen(false)}
      />
    </div>
  );
};
