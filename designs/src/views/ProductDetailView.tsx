import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { Craft360Modal } from '../components/Craft360Modal';

interface ProductDetailViewProps {
  productId?: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const {
    addToCart,
    setActiveView,
    formatPrice,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const product = PRODUCTS.find((p) => p.id === (productId || 'patan-classic-slipper')) || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Terracotta Clay');
  const [selectedSize, setSelectedSize] = useState<number>(39);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [craft360Open, setCraft360Open] = useState(false);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    story: true,
    wool: true,
    shipping: false,
    care: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const thumbnailLabels = ['3/4 Angle', 'Interior', 'Suede Sole', 'In Living'];

  const handleInstantPay = () => {
    addToCart(product, { color: selectedColor, size: selectedSize, quantity });
    setActiveView('checkout');
  };

  const handleAddCrossSell = (crossSellId: string) => {
    const item = PRODUCTS.find((p) => p.id === crossSellId);
    if (item) {
      addToCart(item);
    }
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="w-full">
      {/* Micro Breadcrumb & Artisan Badge Bar */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[#55433e] text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
            <button onClick={() => setActiveView('home')} className="hover:text-[#96432b] cursor-pointer">
              Home
            </button>
            <span className="text-[#dbc1ba]">/</span>
            <button onClick={() => setActiveView('shop-all')} className="hover:text-[#96432b] cursor-pointer">
              Shop
            </button>
            <span className="text-[#dbc1ba]">/</span>
            <button
              onClick={() => setActiveView('shop-all', { category: 'footwear' })}
              className="hover:text-[#96432b] cursor-pointer"
            >
              Felt Footwear
            </button>
            <span className="text-[#dbc1ba]">/</span>
            <span className="text-[#211a16] font-semibold">{product.name}</span>
          </nav>
          <div className="flex items-center gap-1.5 bg-[#f9ebe3] px-3 py-1 rounded-full text-[#4f6352] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Registered Fair Trade Craft • Lalitpur Guild #408</span>
          </div>
        </div>
      </section>

      {/* Two-Column Product Presentation */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Gallery (60% Desktop: col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#fff1e9] shadow-xs group border border-[#eee0d8]">
              <img
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
                src={product.images[activeImageIndex % product.images.length]}
              />

              {/* Origin Pill Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                <span className="bg-[#fff8f5]/95 backdrop-blur-md text-[#211a16] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-[#eee0d8]">
                  <span className="w-2 h-2 rounded-full bg-[#4f6352] inline-block"></span>
                  Batch #14 • Hand-felted in Lalitpur
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-[#55433e] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full w-fit border border-[#eee0d8]">
                  100% Zero Synthetics
                </span>
              </div>

              {/* Quick Action Buttons on Stage */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCraft360Open(true)}
                  className="flex items-center gap-1.5 bg-[#fff8f5]/90 hover:bg-[#fff8f5] text-[#211a16] backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer border border-[#eee0d8]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#96432b]">rotate_right</span>
                  <span className="hidden sm:inline">360° Artisan Craft View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCraft360Open(true)}
                  aria-label="Enlarge image"
                  className="p-2 bg-[#fff8f5]/90 hover:bg-[#fff8f5] text-[#211a16] backdrop-blur-md rounded-full shadow-md transition-all cursor-pointer border border-[#eee0d8]"
                >
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Add to wishlist"
                  className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer border border-[#eee0d8] ${
                    isFavorited
                      ? 'bg-[#96432b] text-white'
                      : 'bg-[#fff8f5]/90 hover:bg-[#fff8f5] text-[#211a16]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
              </div>
            </div>

            {/* 4 Perspectives Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images.map((imgUrl, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-[#fff1e9] shadow-xs transition-all cursor-pointer border ${
                      isActive
                        ? 'ring-2 ring-[#96432b] border-transparent opacity-100 scale-98'
                        : 'border-[#eee0d8] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      alt={thumbnailLabels[idx] || `Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      src={imgUrl}
                    />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold text-[#211a16] bg-[#fff8f5]/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">
                      {thumbnailLabels[idx] || `Angle ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Artisan Studio Guarantee Banner */}
            <div className="mt-2 p-4 rounded-2xl bg-[#f9ebe3] flex items-start gap-4 border border-[#eee0d8]">
              <div className="w-10 h-10 rounded-full bg-[#d2e9d2] text-[#556957] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">nest_eco_leaf</span>
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-semibold text-[#211a16]">
                  100% Himalayan Soap &amp; Warm Water Felting
                </h2>
                <p className="text-xs text-[#55433e] leading-relaxed">
                  Every single pair is hand-molded around seamless wooden lasts by master artisans in
                  Patan. No harsh chemicals, synthetics, or mass-production machines.
                </p>
              </div>
            </div>
          </div>

          {/* Right Purchase Panel (40% Desktop: col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:pl-2">
            {/* Headers */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest text-[#96432b] font-bold">
                  Handmade Felt Footwear
                </span>
                <span className="text-[#dbc1ba]">•</span>
                <span className="text-[11px] uppercase tracking-widest text-[#55433e] font-medium">
                  Patan Workshop
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#211a16] tracking-tight leading-tight font-bold">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-serif text-[#96432b]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-[#55433e]">Tax inclusive</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f6352]"></span>
                <div className="flex items-center gap-1 text-[#4f6352] text-xs font-medium">
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  <span>In Stock (4 pairs left in size 39)</span>
                </div>
              </div>
            </div>

            {/* Craft Summary */}
            <p className="text-sm text-[#55433e] leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <div className="h-px w-full bg-[#eee0d8]"></div>

            {/* Color Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#211a16] font-semibold">
                  Color: <span className="font-normal text-[#55433e]">{selectedColor}</span>
                </span>
                <span className="text-[#55433e] text-[11px]">Natural plant &amp; mineral dyes</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'ring-2 ring-[#96432b] ring-offset-2 ring-offset-[#fff8f5] scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          isSelected ? 'text-white' : 'text-transparent'
                        }`}
                      >
                        check
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#211a16] font-semibold">Select Size (EU Unisex)</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[#96432b] hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  <span>Nepal &amp; International Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                {(product.sizes || [36, 37, 38, 39, 40, 41, 42, 43, 44]).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#96432b] text-white shadow-xs'
                          : 'bg-[#f9ebe3] text-[#211a16] hover:bg-[#f3e6dd]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#55433e] pt-1">
                Fit advice: True to size. Wool felt molds organically to the shape of your feet
                within 4–6 days of wear.
              </p>
            </div>

            {/* Quantity & Small Batch Row */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center bg-[#f9ebe3] rounded-lg p-1 border border-[#eee0d8]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded flex items-center justify-center hover:bg-white text-[#211a16] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-10 text-center text-xs font-bold text-[#211a16]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded flex items-center justify-center hover:bg-white text-[#211a16] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[#605c52] text-xs font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#96432b]">
                  hourglass_top
                </span>
                <span>Small-batch artisanal production</span>
              </div>
            </div>

            {/* Primary Purchase CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  addToCart(product, { color: selectedColor, size: selectedSize, quantity })
                }
                className="w-full bg-[#96432b] hover:bg-[#833822] active:translate-y-0.5 text-white text-sm font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>Add to Bag</span>
                </span>
                <span className="font-serif font-bold tracking-wide">
                  {formatPrice(product.price * quantity)}
                </span>
              </button>

              <button
                type="button"
                onClick={handleInstantPay}
                className="w-full bg-[#f3e6dd] hover:bg-[#eee0d8] text-[#211a16] text-xs font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#eee0d8]"
              >
                <span className="material-symbols-outlined text-[#4f6352] text-[18px]">bolt</span>
                <span>Instant Pay via eSewa / Fonepay</span>
              </button>
            </div>

            {/* Nepal Logistics & Reassurance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-[#fff1e9] flex flex-col gap-1 text-center items-center border border-[#eee0d8]">
                <span className="material-symbols-outlined text-[#4f6352] text-[20px]">
                  local_shipping
                </span>
                <span className="text-xs font-semibold text-[#211a16]">Free Inside Ring Road</span>
                <span className="text-[10px] text-[#55433e] leading-tight">
                  Same or next day delivery
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#fff1e9] flex flex-col gap-1 text-center items-center border border-[#eee0d8]">
                <span className="material-symbols-outlined text-[#4f6352] text-[20px]">
                  rocket_launch
                </span>
                <span className="text-xs font-semibold text-[#211a16]">Pan-Nepal 2–4 Days</span>
                <span className="text-[10px] text-[#55433e] leading-tight">
                  Courier to all 7 provinces
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#fff1e9] flex flex-col gap-1 text-center items-center border border-[#eee0d8]">
                <span className="material-symbols-outlined text-[#4f6352] text-[20px]">
                  published_with_changes
                </span>
                <span className="text-xs font-semibold text-[#211a16]">14-Day Size Exchange</span>
                <span className="text-[10px] text-[#55433e] leading-tight">
                  Hassle-free doorstep swap
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Craft & Logistics Accordions */}
      <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14">
        <div className="space-y-3">
          {/* Accordion 1: Artisan Story */}
          <div className="bg-[#fff1e9] rounded-2xl overflow-hidden shadow-xs border border-[#eee0d8]">
            <button
              type="button"
              onClick={() => toggleAccordion('story')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#f9ebe3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#96432b] text-[22px]">palette</span>
                <span className="font-serif text-lg font-bold text-[#211a16]">
                  Artisan Story &amp; Heritage
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-[#55433e] transition-transform duration-300 ${
                  openAccordions.story ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openAccordions.story && (
              <div className="px-5 pb-6 pt-1 text-[#55433e] text-xs space-y-4 border-t border-[#eee0d8]/60">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-1 rounded-xl overflow-hidden bg-[#f9ebe3] aspect-square shadow-sm">
                    <img
                      alt="Artisan Sunita at work in Lalitpur"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcs370zIHlgLyCh_rDswjadDHOQ6nTD2mplcRzgMgoIpmtaGKV-_soN2FcS_44oy7WMtW_X8EZWJmxbqjIa_njYqRzj21rl1zvHflIWTkS7ZF0aV6uJNnMCWUHckEVjln-4wtY6O06Y-flhRbAl7xvYvo-HvFvAnCvKM1DFpv75T7_VOSbBNgXsWCRCIAKoUaIkVdH85ID2Qz-yPe1Pd3PyV_QsEePUjUm9J04e_d7tJrJolSx3T3v"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2 leading-relaxed">
                    <p>
                      Handcrafted by master feltmaker <strong>Sunita Maharjan</strong> and her
                      collective of 18 women artisans in Lagankhel, Patan. For over a decade,
                      Nyanopan has supported living wages, independent pensions, and safe craft
                      working conditions for indigenous Newar and Tamang artisans.
                    </p>
                    <p>
                      Each slipper undergoes 14 individual stages: hand-teasing raw fleece, carding,
                      repetitive kneading with mild soap and warm water, molding over hand-carved
                      Sal-wood foot forms, and meticulous sun-curing on Patan terraces before the
                      buffalo suede sole is hand-stitched with waxed organic twine.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Pure Wool Benefits */}
          <div className="bg-[#fff1e9] rounded-2xl overflow-hidden shadow-xs border border-[#eee0d8]">
            <button
              type="button"
              onClick={() => toggleAccordion('wool')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#f9ebe3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#96432b] text-[22px]">
                  thermostat
                </span>
                <span className="font-serif text-lg font-bold text-[#211a16]">
                  Materials &amp; Pure Wool Benefits
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-[#55433e] transition-transform duration-300 ${
                  openAccordions.wool ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openAccordions.wool && (
              <div className="px-5 pb-6 pt-1 text-[#55433e] text-xs space-y-4 border-t border-[#eee0d8]/60">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-white rounded-xl space-y-1 border border-[#eee0d8]">
                    <div className="text-[#4f6352] text-xs font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">air</span>
                      <span>Active Thermoregulation</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#55433e]">
                      Keeps your feet toasty warm during cold Himalayan winters while releasing excess
                      humidity in warmer seasons.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl space-y-1 border border-[#eee0d8]">
                    <div className="text-[#4f6352] text-xs font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">water_drop</span>
                      <span>Natural Lanolin Shield</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#55433e]">
                      Natural sheep lanolin repels dirt, stains, and odor-causing bacteria naturally
                      without chemical treatments.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl space-y-1 border border-[#eee0d8]">
                    <div className="text-[#4f6352] text-xs font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">nature</span>
                      <span>Biodegradable &amp; Non-Toxic</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#55433e]">
                      Ethically raised New Zealand crossbred wool, vegetable-tanned buffalo suede, and
                      non-toxic AZO-free mineral dyes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Delivery Across Nepal & Global */}
          <div className="bg-[#fff1e9] rounded-2xl overflow-hidden shadow-xs border border-[#eee0d8]">
            <button
              type="button"
              onClick={() => toggleAccordion('shipping')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#f9ebe3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#96432b] text-[22px]">map</span>
                <span className="font-serif text-lg font-bold text-[#211a16]">
                  Delivery Across Nepal &amp; Global Rates
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-[#55433e] transition-transform duration-300 ${
                  openAccordions.shipping ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openAccordions.shipping && (
              <div className="px-5 pb-6 pt-1 text-[#55433e] text-xs space-y-3 border-t border-[#eee0d8]/60">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f9ebe3] font-semibold text-[#211a16]">
                        <th className="p-2.5 rounded-l-lg">Destination / Region</th>
                        <th className="p-2.5">Estimated Time</th>
                        <th className="p-2.5">Standard Rate</th>
                        <th className="p-2.5 rounded-r-lg">Free Shipping Threshold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee0d8]">
                      <tr>
                        <td className="p-2.5 font-medium text-[#211a16]">
                          Kathmandu Valley (Inside Ring Road)
                        </td>
                        <td className="p-2.5">Same Day / 24 hrs</td>
                        <td className="p-2.5">NPR 150</td>
                        <td className="p-2.5 text-[#4f6352] font-semibold">Free on NPR 2,500+</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#211a16]">
                          Kathmandu Valley Suburbs (Bhaktapur, Kirtipur, Budhanilkantha)
                        </td>
                        <td className="p-2.5">24–48 hrs</td>
                        <td className="p-2.5">NPR 200</td>
                        <td className="p-2.5 text-[#4f6352] font-semibold">Free on NPR 3,500+</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#211a16]">
                          Major Cities (Pokhara, Biratnagar, Chitwan, Butwal, Dharan)
                        </td>
                        <td className="p-2.5">2–3 Days</td>
                        <td className="p-2.5">NPR 250</td>
                        <td className="p-2.5 text-[#4f6352] font-semibold">Free on NPR 5,000+</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#211a16]">
                          Remote &amp; Mountain Districts across 7 Provinces
                        </td>
                        <td className="p-2.5">4–6 Days</td>
                        <td className="p-2.5">NPR 350</td>
                        <td className="p-2.5 text-[#55433e]">Calculated at checkout</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#211a16]">
                          Worldwide Artisan Courier (DHL Express)
                        </td>
                        <td className="p-2.5">5–8 Days</td>
                        <td className="p-2.5">USD $24 (~NPR 3,200)</td>
                        <td className="p-2.5 text-[#4f6352] font-semibold">Free on USD $150+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 4: Care Guide */}
          <div className="bg-[#fff1e9] rounded-2xl overflow-hidden shadow-xs border border-[#eee0d8]">
            <button
              type="button"
              onClick={() => toggleAccordion('care')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#f9ebe3] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#96432b] text-[22px]">
                  dry_cleaning
                </span>
                <span className="font-serif text-lg font-bold text-[#211a16]">
                  Care &amp; Cleaning Guide
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-[#55433e] transition-transform duration-300 ${
                  openAccordions.care ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openAccordions.care && (
              <div className="px-5 pb-6 pt-1 text-[#55433e] text-xs space-y-2 border-t border-[#eee0d8]/60">
                <ul className="space-y-1.5 list-disc pl-5 leading-relaxed">
                  <li>
                    <strong>Daily Care:</strong> Wool repels dust naturally. Gently vacuum or shake
                    outside to refresh fleece fibers.
                  </li>
                  <li>
                    <strong>Spot Cleaning:</strong> Dab gently with a damp cotton cloth and mild,
                    pH-neutral wool wash. Never scrub vigorously.
                  </li>
                  <li>
                    <strong>Hand Washing (if required):</strong> Soak in lukewarm water with wool
                    detergent for 10 minutes. Rinse gently, reshape over your foot or a towel roll,
                    and air-dry flat away from direct radiators.
                  </li>
                  <li>
                    <strong>Suede Sole Maintenance:</strong> Use a dry soft-bristle brush to revive
                    suede nap and brush off dried dust.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curated Cross-Sell: "Pairs Well With" */}
      <section className="w-full bg-[#fff1e9] py-14 border-t border-[#eee0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#96432b] font-bold">
                Artisan Cohesion
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#211a16] mt-1">
                Pairs Well With
              </h2>
            </div>
            <button
              onClick={() => setActiveView('shop-all', { category: 'accessories' })}
              className="text-[#96432b] hover:text-[#833822] text-xs font-semibold flex items-center gap-1 group cursor-pointer"
            >
              <span>Explore All Living Accessories</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cross-sell 1: Coasters */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col group border border-[#eee0d8]">
              <div className="relative aspect-square overflow-hidden bg-[#f9ebe3]">
                <img
                  alt="Felt Ball Coasters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXOSa3kzQYnCu49xKHzRPBRQa-xGhwrManZRGI_NDiY40PqO0bjSWOJ_LyMWBPgAxMW4ZE0lozdLvU4O8GWiANcgicJqJhSF89xQS1SHLy8zHmfSsHXXXcfNdYTbtFv1dFyTjzXff9PDk8nOkp7dvWxX3UvswRWtem9piK5I7q225S5Dr_KEvg5tVI2iYt8T5Omt5AwnG2gTAczCpb5B9_EnVXKVpEPTcnWw0202_qlfHiKFy0UAnk"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#4f6352] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#eee0d8]">
                  Hand-rolled Balls
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Felt Ball Coasters (Set of 4)
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1 line-clamp-2">
                    Vibrant, heat-resistant table protectors hand-sewn from individual New Zealand
                    wool spheres.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#96432b]">
                    {formatPrice(1200)}
                  </span>
                  <button
                    onClick={() => handleAddCrossSell('felt-ball-coasters')}
                    className="px-3 py-1.5 bg-[#f9ebe3] hover:bg-[#96432b] hover:text-white text-[#211a16] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cross-sell 2: Wool Dryer Balls */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col group border border-[#eee0d8]">
              <div className="relative aspect-square overflow-hidden bg-[#f9ebe3]">
                <img
                  alt="Wool Dryer Balls Set of 4"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvNIK-FgRR19jlF6P4l-SsWJ2-ZkqKk8_QklGjR0uxQOmqPZVCfI3PA26xeDc4Q33T4WHnVjOcxSZjMmwBrbaxCYvYVDbmtHngcvR6b0ktOAmYJOie4LSUzVXbCL-dxnE7c04ar4p__lPxzvckShQkIRZZzvD2gTL0HYniAfS4XOzPKh1QIF7vq1PoOy4uA5oot83SoP-rFqfc_EeAaIX-9JE-uHuROsqoBNPtI9P3De1sade9N8Wq"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#4f6352] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#eee0d8]">
                  Eco Laundry
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Wool Dryer Balls (Set of 4)
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1 line-clamp-2">
                    Naturally soften laundry and reduce drying cycle time by 25%. Completely unscented
                    and reusable for 1,000+ loads.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#96432b]">
                    {formatPrice(850)}
                  </span>
                  <button
                    onClick={() => handleAddCrossSell('wool-dryer-balls')}
                    className="px-3 py-1.5 bg-[#f9ebe3] hover:bg-[#96432b] hover:text-white text-[#211a16] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cross-sell 3: Felt Insole Liners */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col group border border-[#eee0d8]">
              <div className="relative aspect-square overflow-hidden bg-[#f9ebe3]">
                <img
                  alt="Felt Insole Replacement Liners"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTxXC17Ck1QPlq1S6cjPmWiYKPLiRGKHL_PdIsVwyhYXIdZy9_0cTb3r6m2tF2_RxqBami8D67pIH--QfTeWhJEbBSEYfkqJFJmdz-zqzHEnAZTdzF-f2LtuRyqOlNv-q56tOe5FwIWxdQIAFXcGzoLEOoB42VCmGBBp8gW8N2JhmMw3m_TwEhY8dNcmP2knOkXp98XS8KasUjYoqzOlX9Q2Ved-THM3DPlzGHbvkCO_313-J4PY_A"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#4f6352] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#eee0d8]">
                  Footwear Care
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Felt Insole Replacement Liners
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1 line-clamp-2">
                    Dense 5mm pure wool cushioning liners designed to slide into your Patan slippers
                    for enhanced cloud-like arch support.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#96432b]">
                    {formatPrice(650)}
                  </span>
                  <button
                    onClick={() => handleAddCrossSell('felt-insole-replacement-liners')}
                    className="px-3 py-1.5 bg-[#f9ebe3] hover:bg-[#96432b] hover:text-white text-[#211a16] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={(size) => {
          setSelectedSize(size);
          setSizeGuideOpen(false);
        }}
      />

      <Craft360Modal
        isOpen={craft360Open}
        onClose={() => setCraft360Open(false)}
        product={product}
      />
    </div>
  );
};
