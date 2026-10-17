import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalQuantity,
    freeShippingThreshold,
    isFreeShipping,
    amountNeededForFreeShipping,
    shippingPercentage,
    giftNoteEnabled,
    setGiftNoteEnabled,
    giftMessage,
    setGiftMessage,
    discountAmount,
    applyPromoCode,
    promoCode,
    setPromoCode,
    setActiveView,
    formatPrice,
    addToCart,
    toggleWishlist,
  } = useCart();

  const [inputVoucher, setInputVoucher] = useState(promoCode || '');
  const [voucherFeedback, setVoucherFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const deliveryCost = isFreeShipping ? 0 : 150;
  const giftNoteCost = giftNoteEnabled ? 150 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryCost + giftNoteCost - discountAmount);

  const handleApplyVoucher = () => {
    if (!inputVoucher.trim()) return;
    const res = applyPromoCode(inputVoucher);
    setVoucherFeedback(res);
  };

  const frequentlyPaired = [
    {
      id: 'wool-dryer-balls',
      name: 'Organic Wool Laundry Balls (Set of 4)',
      category: '100% Organic',
      desc: 'Eliminates synthetic sheets',
      price: 850,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDvNIK-FgRR19jlF6P4l-SsWJ2-ZkqKk8_QklGjR0uxQOmqPZVCfI3PA26xeDc4Q33T4WHnVjOcxSZjMmwBrbaxCYvYVDbmtHngcvR6b0ktOAmYJOie4LSUzVXbCL-dxnE7c04ar4p__lPxzvckShQkIRZZzvD2gTL0HYniAfS4XOzPKh1QIF7vq1PoOy4uA5oot83SoP-rFqfc_EeAaIX-9JE-uHuROsqoBNPtI9P3De1sade9N8Wq',
    },
    {
      id: 'patan-rainbow-felt-coasters',
      name: 'Patan Rainbow Felt Coasters (Pack of 4)',
      category: 'Hand-dyed',
      desc: 'Heat-absorbent desk companions',
      price: 650,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBXOSa3kzQYnCu49xKHzRPBRQa-xGhwrManZRGI_NDiY40PqO0bjSWOJ_LyMWBPgAxMW4ZE0lozdLvU4O8GWiANcgicJqJhSF89xQS1SHLy8zHmfSsHXXXcfNdYTbtFv1dFyTjzXff9PDk8nOkp7dvWxX3UvswRWtem9piK5I7q225S5Dr_KEvg5tVI2iYt8T5Omt5AwnG2gTAczCpb5B9_EnVXKVpEPTcnWw0202_qlfHiKFy0UAnk',
    },
    {
      id: 'artisan-suede-wool-comb',
      name: 'Artisan Suede & Wool Fluff Comb',
      category: 'Care Essential',
      desc: 'Keeps felt footwear pristine',
      price: 450,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBkYwDmHNEndBfPtL5gDugaE32HQv96bXFdXtDFyzvx2SPb8qQ4k-u594nMz4KX9dMFqiGUalU25Bs0uYgB8d-PbPqYtNNvmKLJZoDOnioBO7jbkBKrX6VEDVNP8wAaE3cESEgT2BqPo2xINK8QVhnTbjyDyck54bSRoqpCsKZpNJ_X9btfyIsoBv_0kLtbguK4oL6TCgWPVznU7cPGSIh5HUP-FJs0f5rB0ossy0comIiG86sKhyIY',
    },
    {
      id: 'needle-felted-mountain-succulent',
      name: 'Needle-Felted Mountain Succulent',
      category: 'Bespoke',
      desc: 'Never needs water or sunlight',
      price: 700,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTA7uqlieSgwoFBct59fDVs3MOo0pVGL8N_4hfl-oMSrznEsDbdYq_ELSUejSqQjQ9bhInealH6AldRlSJjSC6AKeY2_hmb83w8IuM4UtmKffyXGj8mIPtNykQW3-bt9yJc0q-2DfMjZ27LgORkOFTIdB5h7SBUiHyzRQkT-sffdM7V9XTSXGgz2TMiuoClNgoNQJt-GXunEwWZWB6sdqn3PShcFqBAByo78MylIyZzY_OKXwSXCbu',
    },
  ];

  return (
    <div className="w-full">
      {/* Cart Hero & Incentive Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 pt-4">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[#55433e] text-xs mb-3">
          <button onClick={() => setActiveView('home')} className="hover:text-[#96432b] cursor-pointer">
            Home
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#211a16] font-semibold">Shopping Bag</span>
        </nav>

        {/* Page Title & Micro Status */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-4">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-3xl md:text-4xl text-[#211a16] font-bold">
              Your Handcrafted Bag
            </h1>
            <span className="text-xs text-[#4f6352] font-semibold bg-[#d2e9d2]/60 px-2.5 py-0.5 rounded-full">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-[#55433e] italic">
            Direct artisan workshop consignment · Kathmandu Valley
          </p>
        </div>

        {/* Free Delivery Incentive Progress Bar Card */}
        <div className="w-full bg-[#f9ebe3] rounded-2xl p-4 shadow-xs border border-[#eee0d8]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#96432b] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
              <p className="text-xs md:text-sm text-[#211a16] font-medium">
                {isFreeShipping ? (
                  <span className="font-bold text-[#4f6352]">
                    🎉 You have unlocked Free Delivery inside Kathmandu Ring Road!
                  </span>
                ) : (
                  <>
                    You are{' '}
                    <span className="font-bold text-[#96432b]">
                      {formatPrice(amountNeededForFreeShipping)}
                    </span>{' '}
                    away from Free Delivery inside Kathmandu Ring Road!
                  </>
                )}
              </p>
            </div>
            <span className="text-xs text-[#55433e] font-medium">
              {shippingPercentage}% of {formatPrice(freeShippingThreshold)} threshold
            </span>
          </div>
          <div className="w-full h-2 bg-[#eee0d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#96432b] rounded-full transition-all duration-700"
              style={{ width: `${shippingPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Cart Content Two-Column Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items & Artisan Gifting (65% -> col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-[#eee0d8]">
                <div className="w-16 h-16 bg-[#fff1e9] text-[#96432b] rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#211a16]">
                  Your Handcrafted Bag is Empty
                </h3>
                <p className="text-xs text-[#55433e] max-w-md mx-auto">
                  Browse our handcrafted pure wool footwear, organic felt ball trivets, and mindful
                  home goods directly from master artisans in Patan.
                </p>
                <button
                  onClick={() => setActiveView('shop-all')}
                  className="px-6 py-3 bg-[#96432b] hover:bg-[#833822] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Explore Felt Collections
                </button>
              </div>
            ) : (
              /* Cart Items List Container */
              <div className="bg-[#fff1e9] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 border border-[#eee0d8]">
                <div className="hidden sm:grid grid-cols-12 text-[#55433e] text-[11px] pb-1 uppercase tracking-wider font-semibold">
                  <span className="col-span-6">Handcrafted Piece</span>
                  <span className="col-span-2 text-center">Unit Price</span>
                  <span className="col-span-2 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Subtotal</span>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-start sm:items-center bg-white rounded-2xl p-4 shadow-xs transition-transform hover:-translate-y-0.5 border border-[#eee0d8]"
                  >
                    {/* Thumbnail & Meta */}
                    <div className="sm:col-span-6 flex gap-4 items-start w-full">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-[#f9ebe3] rounded-xl overflow-hidden relative border border-[#eee0d8]">
                        <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                        <span className="absolute top-1 left-1 bg-white/90 backdrop-blur-xs text-[#4f6352] text-[10px] px-1.5 py-0.5 rounded font-semibold border border-[#eee0d8]">
                          {item.originLocation}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                        <div>
                          <span className="text-[10px] text-[#96432b] uppercase tracking-wider font-bold">
                            {item.categoryLabel}
                          </span>
                          <h3
                            className="font-serif text-base font-bold text-[#211a16] leading-tight cursor-pointer hover:text-[#96432b]"
                            onClick={() =>
                              setActiveView('product-detail', { productId: item.productId })
                            }
                          >
                            {item.name}
                          </h3>
                          <div className="mt-1 space-y-0.5 text-xs text-[#55433e]">
                            <p>
                              <span className="text-[#211a16] font-medium">Shade:</span>{' '}
                              {item.selectedColor}
                            </p>
                            {item.selectedSize && (
                              <p>
                                <span className="text-[#211a16] font-medium">Fit:</span> EU{' '}
                                {item.selectedSize} (Standard)
                              </p>
                            )}
                            <p>
                              <span className="text-[#211a16] font-medium">Base:</span>{' '}
                              {item.soleType}
                            </p>
                          </div>
                        </div>

                        {/* Action links */}
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.productId)}
                            className="text-[#55433e] hover:text-[#96432b] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">bookmark</span>{' '}
                            Save for Later
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#ba1a1a] hover:text-red-800 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>{' '}
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-left sm:text-center text-xs font-semibold text-[#211a16]">
                      <span className="sm:hidden text-[#55433e] font-normal">Price: </span>
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                      <div className="flex items-center bg-[#f9ebe3] rounded-lg p-0.5 border border-[#eee0d8]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#55433e] hover:text-[#211a16] hover:bg-white rounded transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#211a16]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#55433e] hover:text-[#211a16] hover:bg-white rounded transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="sm:col-span-2 text-left sm:text-right font-serif text-sm font-bold text-[#96432b]">
                      <span className="sm:hidden text-[#55433e] font-normal text-xs">
                        Line Total:{' '}
                      </span>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Artisan Gifting Experience Section */}
            <div className="bg-[#fff1e9] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 border border-[#eee0d8]">
              <div className="flex items-center gap-2 text-[#96432b]">
                <span className="material-symbols-outlined text-[24px]">
                  featured_seasonal_and_gifts
                </span>
                <h2 className="font-serif text-lg font-bold text-[#211a16]">
                  Artisan Gifting &amp; Packaging
                </h2>
              </div>

              {/* Gifting Options Container */}
              <div className="bg-white rounded-2xl p-4 space-y-4 shadow-xs border border-[#eee0d8]">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={giftNoteEnabled}
                      onChange={(e) => setGiftNoteEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-[#f9ebe3] peer-checked:bg-[#96432b] rounded transition-colors flex items-center justify-center border border-[#88726c]/40">
                      <span className="material-symbols-outlined text-white text-[16px] scale-0 peer-checked:scale-100 transition-transform">
                        check
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs sm:text-sm text-[#211a16] font-semibold">
                        Handwritten Note on Nepali Lokta Paper
                      </span>
                      <span className="text-xs text-[#96432b] font-bold">+ NPR 150</span>
                    </div>
                    <p className="text-xs text-[#55433e] mt-0.5 leading-relaxed">
                      Artisanal Daphne bark paper crafted by forest cooperatives in Baglung,
                      hand-inscribed by our Kathmandu calligrapher.
                    </p>
                  </div>
                </label>

                {/* Gift Message Box */}
                {giftNoteEnabled && (
                  <div className="pt-1 pl-8 space-y-1.5 animate-fadeIn">
                    <label
                      htmlFor="gift-message"
                      className="block text-xs font-semibold text-[#211a16]"
                    >
                      Gift Inscription (Up to 240 Characters)
                    </label>
                    <textarea
                      id="gift-message"
                      rows={3}
                      value={giftMessage}
                      maxLength={240}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="To a warm home in Pokhara, sending cozy footsteps and warm blessings..."
                      className="w-full bg-[#fff8f5] text-[#211a16] text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#96432b] border border-[#eee0d8] resize-none"
                    />
                    <div className="flex justify-between items-center text-[11px] text-[#55433e]">
                      <span>Calligraphy language: Nepali or English</span>
                      <span>{giftMessage.length} / 240</span>
                    </div>
                  </div>
                )}

                {/* Eco Guarantee Banner */}
                <div className="flex items-center gap-3 p-3 bg-[#d2e9d2]/40 rounded-xl text-[#4f6352] border border-[#d2e9d2]">
                  <span className="material-symbols-outlined text-[20px] shrink-0">eco</span>
                  <p className="text-xs text-[#556957]">
                    <strong className="font-semibold">Zero-Plastic Promise:</strong> Wrapped in
                    unbleached cotton muslin and sun-dried Lokta twine with biodegradable cornstarch
                    parcel mailers.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <button
                onClick={() => setActiveView('shop-all')}
                className="flex items-center gap-2 text-[#55433e] hover:text-[#96432b] text-xs font-semibold transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                Continue Browsing Collections
              </button>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#55433e] hover:text-[#ba1a1a] underline underline-offset-4 cursor-pointer"
                >
                  Clear entire bag
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (35% -> col-span-4) Sticky */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <div className="bg-[#f9ebe3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 border border-[#eee0d8]">
              <div className="flex items-center justify-between pb-1 border-b border-[#eee0d8]">
                <h2 className="font-serif text-xl font-bold text-[#211a16]">Order Summary</h2>
                <span className="text-[11px] text-[#4f6352] bg-white px-2.5 py-0.5 rounded-full font-bold border border-[#eee0d8]">
                  Secure
                </span>
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs text-[#55433e]">
                <div className="flex justify-between items-center">
                  <span>Items Subtotal ({totalQuantity} units)</span>
                  <span className="text-[#211a16] font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span>Kathmandu Delivery</span>
                    <p className="text-[10px] text-[#4f6352]">
                      {isFreeShipping ? 'Inside Ring Road (Free Promo)' : 'Standard Valley Courier'}
                    </p>
                  </div>
                  <span
                    className={`font-semibold ${
                      isFreeShipping ? 'text-[#4f6352]' : 'text-[#211a16]'
                    }`}
                  >
                    {isFreeShipping ? 'Free' : formatPrice(150)}
                  </span>
                </div>
                {giftNoteEnabled && (
                  <div className="flex justify-between items-center">
                    <span>Lokta Gift Note</span>
                    <span className="text-[#211a16] font-semibold">{formatPrice(150)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#96432b] font-medium">
                    <span>Artisan Support Credit</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Input Group */}
              <div className="pt-2 border-t border-[#eee0d8]">
                <label htmlFor="promo-input" className="block text-[11px] text-[#55433e] font-medium mb-1">
                  Promotional Voucher or Gift Card
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-input"
                    type="text"
                    value={inputVoucher}
                    onChange={(e) => setInputVoucher(e.target.value)}
                    placeholder="e.g. HIMALAYANWINTER"
                    className="flex-1 min-w-0 bg-white text-[#211a16] uppercase tracking-wider text-xs px-3 py-2.5 rounded-xl border border-[#eee0d8] focus:outline-none focus:ring-1 focus:ring-[#96432b]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="bg-[#eee0d8] hover:bg-[#e5d7cf] text-[#211a16] text-xs px-4 py-2.5 rounded-xl transition-colors font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {voucherFeedback && (
                  <p
                    className={`text-[11px] mt-1 ${
                      voucherFeedback.success ? 'text-[#4f6352] font-semibold' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {voucherFeedback.message}
                  </p>
                )}
              </div>

              {/* Order Total High-Impact Card */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eee0d8]">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-serif text-lg font-bold text-[#211a16]">Estimated Total</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-[#96432b] font-bold leading-none">
                      {formatPrice(grandTotal)}
                    </span>
                    <span className="block text-[11px] text-[#55433e] mt-1">Includes 13% Nepal VAT</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#55433e] mt-2">
                  Free delivery threshold triggers once cart items reach NPR 2,500 after credits.
                </p>
              </div>

              {/* Checkout Primary CTA */}
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setActiveView('checkout')}
                className="w-full bg-[#96432b] hover:bg-[#833822] disabled:opacity-50 text-white text-xs font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group active:translate-y-0.5 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  east
                </span>
              </button>

              {/* Nepal Payment Gateways Badge Row */}
              <div className="pt-2 text-center space-y-2 border-t border-[#eee0d8]">
                <p className="text-[10px] text-[#55433e] uppercase tracking-wider font-semibold">
                  Accepted Nepal &amp; International Payments
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-[#4f6352] shadow-xs border border-[#eee0d8]">
                    eSewa
                  </span>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-[#96432b] shadow-xs border border-[#eee0d8]">
                    Khalti
                  </span>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-[#211a16] shadow-xs border border-[#eee0d8]">
                    Fonepay QR
                  </span>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-semibold text-[#55433e] shadow-xs border border-[#eee0d8]">
                    COD
                  </span>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-medium text-[#55433e] shadow-xs border border-[#eee0d8]">
                    Visa · Master
                  </span>
                </div>
              </div>

              {/* Fair-Wage Impact Guarantee */}
              <div className="bg-white/80 rounded-xl p-3 flex items-start gap-2.5 text-[#211a16] border border-[#eee0d8]">
                <span
                  className="material-symbols-outlined text-[#4f6352] text-[20px] shrink-0 mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  volunteer_activism
                </span>
                <p className="text-xs text-[#55433e] leading-snug">
                  <strong className="text-[#211a16] font-semibold">Empowerment Impact:</strong> Every
                  order funds steady, dignified craft livelihoods for our 42 women artisans in Patan
                  and Bhaktapur.
                </p>
              </div>
            </div>

            {/* Trust Badges Under Summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#fff1e9] p-3 rounded-xl flex items-center gap-2 border border-[#eee0d8]">
                <span className="material-symbols-outlined text-[#4f6352] text-[20px]">
                  verified_user
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-[#211a16]">7-Day Fit Guarantee</p>
                  <p className="text-[10px] text-[#55433e]">Free size exchange</p>
                </div>
              </div>
              <div className="bg-[#fff1e9] p-3 rounded-xl flex items-center gap-2 border border-[#eee0d8]">
                <span className="material-symbols-outlined text-[#4f6352] text-[20px]">
                  local_shipping
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-[#211a16]">7 Provinces Delivery</p>
                  <p className="text-[10px] text-[#55433e]">Reliable tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Paired Artisan Add-ons Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#eee0d8]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-1 mb-6">
          <div>
            <span className="text-[11px] text-[#96432b] font-bold uppercase tracking-wider">
              Mindful Living Additions
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#211a16]">
              Frequently Paired with Your Selection
            </h2>
          </div>
          <p className="text-xs text-[#55433e]">
            Add these to qualify for instantaneous Free Kathmandu Ring Road delivery
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {frequentlyPaired.map((item) => {
            const productMatch = PRODUCTS.find((p) => p.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-[#fff1e9] rounded-2xl p-3 flex flex-col justify-between group shadow-xs hover:shadow-md transition-shadow border border-[#eee0d8]"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f9ebe3] relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt={item.name}
                  />
                  <span className="absolute top-2 left-2 bg-white/95 text-[#211a16] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#eee0d8]">
                    {item.category}
                  </span>
                </div>
                <div className="mt-3 flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#211a16] line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#55433e] line-clamp-1">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#eee0d8]/60">
                    <span className="text-xs font-bold text-[#211a16]">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (productMatch) addToCart(productMatch);
                      }}
                      className="bg-white hover:bg-[#96432b] hover:text-white text-[#96432b] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer border border-[#eee0d8]"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
