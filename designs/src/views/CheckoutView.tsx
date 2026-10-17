import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { OrderDetails } from '../types';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

export const CheckoutView: React.FC = () => {
  const { cart, subtotal, giftNoteEnabled, formatPrice, clearCart, setActiveView } = useCart();

  // Contact form state
  const [fullName, setFullName] = useState('Pooja Shrestha');
  const [mobileNumber, setMobileNumber] = useState('9841234567');
  const [emailAddress, setEmailAddress] = useState('pooja.shrestha@craftnepal.org');

  // Address form state
  const [province, setProvince] = useState('bagmati');
  const [district, setDistrict] = useState('kathmandu');
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan City');
  const [ward, setWard] = useState('Ward No. 03');
  const [street, setStreet] = useState('Lazimpat, Near Hotel Shanker, Lane 2');
  const [instructions, setInstructions] = useState(
    'Yellow gate with wooden bell, please ring or call before arriving'
  );

  // Shipping & Payment selection
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'outside'>('standard');
  const [paymentChannel, setPaymentChannel] = useState<'esewa' | 'khalti' | 'fonepay' | 'cod' | 'card'>('esewa');

  // Order submission modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderDetails | null>(null);
  const [orderNumber, setOrderNumber] = useState('NYN-40892');

  // Shipping cost
  const shippingCost = shippingMethod === 'standard' ? 0 : shippingMethod === 'express' ? 150 : 250;
  const giftNoteCost = giftNoteEnabled ? 150 : 0;
  const baseSubtotal = subtotal > 0 ? subtotal : 6250;
  const grandTotal = baseSubtotal + giftNoteCost + shippingCost;

  const handlePlaceOrder = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderNumber = `NYN-${randomNum}`;
    setOrderNumber(newOrderNumber);

    const orderData: OrderDetails = {
      fullName,
      phone: mobileNumber,
      email: emailAddress,
      province,
      district,
      municipality,
      ward,
      street,
      instructions,
      shippingMethod,
      shippingCost,
      paymentMethod: paymentChannel,
      giftNoteEnabled,
      giftMessage: '',
      subtotal: baseSubtotal,
      giftNoteCost,
      discount: 0,
      total: grandTotal,
    };

    setSubmittedOrder(orderData);
    setSuccessModalOpen(true);
    clearCart();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Minimal Editorial Progress & Trust Bar */}
      <header className="w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#eee0d8]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#d2e9d2] text-[#0d1f12] text-[11px] font-bold">
              ✓
            </span>
            <span className="text-xs font-semibold text-[#4f6352]">Verified Artisan Origin</span>
            <span className="text-[#dbc1ba]">•</span>
            <span className="text-xs text-[#55433e]">Patan Atelier</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#211a16] font-bold tracking-tight">
            Express Checkout
          </h1>
        </div>

        {/* Stepper & Security Seal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <nav aria-label="Checkout Progress" className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#96432b] font-semibold">
              <span className="w-6 h-6 rounded-full bg-[#96432b] text-white flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              <span>Details</span>
            </div>
            <span className="w-6 h-[1px] bg-[#dbc1ba]"></span>
            <div className="flex items-center gap-2 text-[#55433e]">
              <span className="w-6 h-6 rounded-full bg-[#f3e6dd] text-[#55433e] flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span>Delivery</span>
            </div>
            <span className="w-6 h-[1px] bg-[#dbc1ba]"></span>
            <div className="flex items-center gap-2 text-[#55433e]">
              <span className="w-6 h-6 rounded-full bg-[#f3e6dd] text-[#55433e] flex items-center justify-center text-[11px] font-bold">
                3
              </span>
              <span>Payment</span>
            </div>
          </nav>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f9ebe3] text-[#55433e] border border-[#eee0d8]">
            <span className="material-symbols-outlined text-[#4f6352] text-[18px]">lock</span>
            <span className="text-[11px] tracking-wide font-medium">
              256-bit Secure • 100% Nepali Handcrafted
            </span>
          </div>
        </div>
      </header>

      {/* Two Column Layout: Left Form (60%) + Right Summary (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT FORM COLUMN */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Section 1: Contact Information */}
          <section className="bg-[#fff1e9] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#eee0d8]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#eee0d8] flex items-center justify-center text-[#96432b] text-xs font-bold">
                  01
                </span>
                <h2 className="font-serif text-xl font-bold text-[#211a16]">
                  Contact Information
                </h2>
              </div>
              <span className="text-xs text-[#55433e]">Guest or Account</span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pooja Shrestha"
                  className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-sm border border-[#eee0d8] focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[#211a16]" htmlFor="mobile-number">
                    Mobile Number
                  </label>
                  <span className="text-[11px] text-[#96432b] flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                    Courier dispatch SMS alerts
                  </span>
                </div>
                <div className="flex rounded-xl shadow-xs overflow-hidden bg-white border border-[#eee0d8]">
                  <span className="inline-flex items-center px-4 bg-[#f3e6dd] text-[#55433e] text-xs font-bold border-r border-[#eee0d8]">
                    🇳🇵 +977
                  </span>
                  <input
                    id="mobile-number"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full h-12 px-4 bg-white text-[#211a16] text-sm focus:outline-none focus:ring-1 focus:ring-[#96432b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="email-address">
                  Email Address
                </label>
                <input
                  id="email-address"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="For PDF receipt and live tracking"
                  className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-sm border border-[#eee0d8] focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Nepal Delivery Address */}
          <section className="bg-[#fff1e9] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#eee0d8]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#eee0d8] flex items-center justify-center text-[#96432b] text-xs font-bold">
                  02
                </span>
                <h2 className="font-serif text-xl font-bold text-[#211a16]">
                  Nepal Delivery Address
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#4f6352] bg-[#d2e9d2]/60 px-2.5 py-1 rounded-full border border-[#d2e9d2]">
                Domestic Logistics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Province Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="province">
                  Province
                </label>
                <div className="relative">
                  <select
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs cursor-pointer pr-10 border border-[#eee0d8]"
                  >
                    <option value="bagmati">Bagmati Province (बागमती)</option>
                    <option value="koshi">Koshi Province</option>
                    <option value="madhesh">Madhesh Province</option>
                    <option value="gandaki">Gandaki Province</option>
                    <option value="lumbini">Lumbini Province</option>
                    <option value="karnali">Karnali Province</option>
                    <option value="sudurpashchim">Sudurpashchim Province</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#55433e]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* District Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="district">
                  District
                </label>
                <div className="relative">
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs cursor-pointer pr-10 border border-[#eee0d8]"
                  >
                    <option value="kathmandu">Kathmandu (काठमाडौँ)</option>
                    <option value="lalitpur">Lalitpur (पाटन / ललितपुर)</option>
                    <option value="bhaktapur">Bhaktapur (भक्तपुर)</option>
                    <option value="kaski">Kaski (Pokhara)</option>
                    <option value="chitwan">Chitwan</option>
                    <option value="kavre">Kavrepalanchok</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#55433e]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Municipality */}
              <div>
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="municipality">
                  Municipality / Metropolitan
                </label>
                <input
                  id="municipality"
                  type="text"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  placeholder="e.g. Lalitpur Metropolitan"
                  className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-xs focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs border border-[#eee0d8]"
                />
              </div>

              {/* Ward Number */}
              <div>
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="ward">
                  Ward Number
                </label>
                <input
                  id="ward"
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Ward No. 04"
                  className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-xs focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs border border-[#eee0d8]"
                />
              </div>

              {/* Street / Tole */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="street">
                  Street Address / Tole / Neighborhood
                </label>
                <input
                  id="street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House name/number, Chowk or Tole"
                  className="w-full h-12 px-4 rounded-xl bg-white text-[#211a16] text-xs focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs border border-[#eee0d8]"
                />
              </div>

              {/* Landmark & Courier Note */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#211a16] mb-2" htmlFor="instructions">
                  Landmark &amp; Courier Note
                </label>
                <div className="relative">
                  <input
                    id="instructions"
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Distinct building, color of gate, or calling preferences"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white text-[#211a16] text-xs focus:outline-none focus:ring-1 focus:ring-[#96432b] shadow-xs border border-[#eee0d8]"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#88726c] text-[20px]">
                    near_me
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Delivery Speed */}
          <section className="bg-[#fff1e9] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#eee0d8]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#eee0d8] flex items-center justify-center text-[#96432b] text-xs font-bold">
                03
              </span>
              <h2 className="font-serif text-xl font-bold text-[#211a16]">
                Dispatch &amp; Delivery Speed
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {/* Standard Valley */}
              <label
                className={`relative flex items-center justify-between p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  shippingMethod === 'standard'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setShippingMethod('standard')}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping_method"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="w-4 h-4 accent-[#96432b] cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#211a16]">Kathmandu Valley Standard</p>
                    <p className="text-[11px] text-[#55433e]">Eco-courier dispatch within 1-2 business days</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#4f6352] uppercase tracking-wider">Free</span>
                </div>
              </label>

              {/* Express Same-Day */}
              <label
                className={`relative flex items-center justify-between p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  shippingMethod === 'express'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setShippingMethod('express')}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping_method"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="w-4 h-4 accent-[#96432b] cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#211a16] flex items-center gap-2">
                      <span>Express Same-Day Valley Dispatch</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdbd1] text-[#3b0900] uppercase tracking-wider">
                        Urgent
                      </span>
                    </p>
                    <p className="text-[11px] text-[#55433e]">Order before 2 PM, delivered by 7 PM today</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#211a16]">NPR 150</span>
                </div>
              </label>

              {/* Outside Valley */}
              <label
                className={`relative flex items-center justify-between p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  shippingMethod === 'outside'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setShippingMethod('outside')}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping_method"
                    checked={shippingMethod === 'outside'}
                    onChange={() => setShippingMethod('outside')}
                    className="w-4 h-4 accent-[#96432b] cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#211a16]">Outside Valley Inter-City Courier</p>
                    <p className="text-[11px] text-[#55433e]">
                      Air &amp; surface logistics to Pokhara, Chitwan, Butwal (2-4 days)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#211a16]">NPR 250</span>
                </div>
              </label>
            </div>
          </section>

          {/* Section 4: Payment Method Selection */}
          <section className="bg-[#fff1e9] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#eee0d8]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#eee0d8] flex items-center justify-center text-[#96432b] text-xs font-bold">
                  04
                </span>
                <h2 className="font-serif text-xl font-bold text-[#211a16]">Payment Method</h2>
              </div>
              <span className="text-xs text-[#55433e]">Instant &amp; COD</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* eSewa */}
              <label
                className={`flex flex-col p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  paymentChannel === 'esewa'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setPaymentChannel('esewa')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentChannel === 'esewa'}
                      onChange={() => setPaymentChannel('esewa')}
                      className="w-4 h-4 accent-[#96432b] cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#60BB46] flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-xs">
                      eS
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#211a16] block">
                        eSewa Mobile Wallet
                      </span>
                      <span className="text-[11px] text-[#55433e] block">
                        Instant direct checkout via eSewa Portal / App
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#60BB46]/10 text-[#60BB46] text-[10px] font-bold hidden sm:inline">
                    Instant
                  </span>
                </div>
              </label>

              {/* Khalti */}
              <label
                className={`flex flex-col p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  paymentChannel === 'khalti'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setPaymentChannel('khalti')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentChannel === 'khalti'}
                      onChange={() => setPaymentChannel('khalti')}
                      className="w-4 h-4 accent-[#96432b] cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#5D2E8E] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      K
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#211a16] block">
                        Khalti Digital Wallet
                      </span>
                      <span className="text-[11px] text-[#55433e] block">
                        Pay with Khalti balance or linked cooperative accounts
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#5D2E8E]/10 text-[#5D2E8E] text-[10px] font-bold hidden sm:inline">
                    Seamless
                  </span>
                </div>
              </label>

              {/* Fonepay */}
              <label
                className={`flex flex-col p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  paymentChannel === 'fonepay'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setPaymentChannel('fonepay')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentChannel === 'fonepay'}
                      onChange={() => setPaymentChannel('fonepay')}
                      className="w-4 h-4 accent-[#96432b] cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#D92525] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      FP
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#211a16] block">
                        Fonepay Interbank QR
                      </span>
                      <span className="text-[11px] text-[#55433e] block">
                        Scan QR code using any Nepali mobile banking app (Global, Nabil, NIC Asia,
                        etc.)
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#88726c] text-[22px]">
                    qr_code_2
                  </span>
                </div>
              </label>

              {/* COD */}
              <label
                className={`flex flex-col p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  paymentChannel === 'cod'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setPaymentChannel('cod')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentChannel === 'cod'}
                      onChange={() => setPaymentChannel('cod')}
                      className="w-4 h-4 accent-[#96432b] cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#4f6352] flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#211a16] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-[#55433e] block">
                        Pay cash to courier upon inspecting handcrafted package
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#f9ebe3] text-[#55433e] text-[10px] font-semibold">
                    No fee
                  </span>
                </div>
              </label>

              {/* Card */}
              <label
                className={`flex flex-col p-4 rounded-2xl bg-white cursor-pointer shadow-xs transition-all border ${
                  paymentChannel === 'card'
                    ? 'ring-2 ring-[#96432b] bg-[#f9ebe3]/50 border-transparent'
                    : 'border-[#eee0d8] hover:bg-[#fff8f5]'
                }`}
                onClick={() => setPaymentChannel('card')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentChannel === 'card'}
                      onChange={() => setPaymentChannel('card')}
                      className="w-4 h-4 accent-[#96432b] cursor-pointer"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#362F2A] flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#211a16] block">
                        Debit / Credit Card (Visa / Mastercard / SCT)
                      </span>
                      <span className="text-[11px] text-[#55433e] block">
                        Processed via Nepal Payment Solutions gateway
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* RIGHT SUMMARY COLUMN (approx 40%) - Sticky on Desktop */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-[#fff1e9] rounded-2xl p-6 sm:p-8 shadow-md border border-[#eee0d8]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#eee0d8]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#211a16]">Order Review</h3>
                <p className="text-xs text-[#55433e]">
                  Handcrafted in Nepal ({cart.length > 0 ? cart.length : 3} items)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#d2e9d2] text-[#0d1f12] text-[11px] font-bold border border-[#d2e9d2]">
                Ready to Dispatch
              </span>
            </div>

            {/* Order Items List */}
            <div className="space-y-4 mb-5">
              {/* If cart has items, render them; otherwise fallback to default mockup review items */}
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3.5 items-center">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f9ebe3] shrink-0 shadow-xs border border-[#eee0d8]">
                      <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                      <span className="absolute top-1 left-1 px-1.5 rounded bg-white/90 text-[#211a16] text-[10px] font-bold">
                        {item.quantity}x
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#211a16] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#55433e]">
                        {item.selectedSize ? `Size ${item.selectedSize} • ` : ''}
                        {item.selectedColor}
                      </p>
                      <p className="text-[11px] text-[#4f6352] font-semibold">{item.soleType}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xs font-bold text-[#211a16]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Item 1: Slipper */}
                  <div className="flex gap-3.5 items-center">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f9ebe3] shrink-0 shadow-xs border border-[#eee0d8]">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTxXC17Ck1QPlq1S6cjPmWiYKPLiRGKHL_PdIsVwyhYXIdZy9_0cTb3r6m2tF2_RxqBami8D67pIH--QfTeWhJEbBSEYfkqJFJmdz-zqzHEnAZTdzF-f2LtuRyqOlNv-q56tOe5FwIWxdQIAFXcGzoLEOoB42VCmGBBp8gW8N2JhmMw3m_TwEhY8dNcmP2knOkXp98XS8KasUjYoqzOlX9Q2Ved-THM3DPlzGHbvkCO_313-J4PY_A"
                        alt="Slipper"
                      />
                      <span className="absolute top-1 left-1 px-1 rounded bg-white/90 text-[#211a16] text-[10px] font-bold">
                        1x
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#211a16] truncate">
                        Patan Classic Felt Slipper
                      </h4>
                      <p className="text-[11px] text-[#55433e]">Size 39 • Terracotta Brown</p>
                      <p className="text-[11px] text-[#4f6352] font-semibold">100% Himalayan Wool</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xs font-bold text-[#211a16]">NPR 3,850</span>
                    </div>
                  </div>

                  {/* Item 2: Trivet Set */}
                  <div className="flex gap-3.5 items-center">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f9ebe3] shrink-0 shadow-xs border border-[#eee0d8]">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfP8yG92_6sEoZiOUbpBF04iJWEf2yJVxwrJVzMjiJ86x9ZsLLNo1RFG32Cyq_tsqVewG3bjudzy3_fK2uYgmB8LBfXhueyzdw67R-3WyZTT-16LBiWgi0_A16J4MlGxbVpYMu8hgMRgkfopI4bh9kw-CXWJoWpEi-InoBlpsinv4i57oSp5EGXIqbh7z9bQ0zdnopMTClWOMIjBmMaoVswiY3MSh_zhM_2F2gwSnPf_PrKWQl98AA"
                        alt="Trivet Set"
                      />
                      <span className="absolute top-1 left-1 px-1 rounded bg-white/90 text-[#211a16] text-[10px] font-bold">
                        2x
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#211a16] truncate">
                        Felt Ball Trivet Set
                      </h4>
                      <p className="text-[11px] text-[#55433e]">Trio Pack • Earth &amp; Ochre</p>
                      <p className="text-[11px] text-[#4f6352] font-semibold">Natural dyed wool</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xs font-bold text-[#211a16]">NPR 2,400</span>
                    </div>
                  </div>
                </>
              )}

              {/* Item 3: Lokta Card */}
              {giftNoteEnabled && (
                <div className="flex gap-3.5 items-center">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f9ebe3] shrink-0 shadow-xs border border-[#eee0d8]">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMlmpERaOeO3xDLO7KyzrQhaDIDbX1glYwjxLwA8M_tBORLeqzgXMIlVKK_jjQsfyPvb7lDuA5pOy_4DWW05DTDj4YfE5c28PDN962DsD8tR8g6zmt49Dd5KFmOiYY8uOn_ZmJWk_vYA8-BYuDGOVRgcD5NmyAuQubzJcq2mjZFWn58eZi2K27jiAy_lWI1sPcH6JaG4FQSjT5Ven3D3de4nwVtmgYlSRwx-mm5KDk_ONOnud7Tun3"
                      alt="Lokta Note"
                    />
                    <span className="absolute top-1 left-1 px-1 rounded bg-white/90 text-[#211a16] text-[10px] font-bold">
                      1x
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#211a16] truncate">
                      Handwritten Lokta Gift Note
                    </h4>
                    <p className="text-[11px] text-[#55433e]">Daphne Papyracea Bush Paper</p>
                    <p className="text-[11px] text-[#4f6352] font-semibold">
                      Biodegradable packaging
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-xs font-bold text-[#211a16]">NPR 150</span>
                  </div>
                </div>
              )}
            </div>

            {/* Artisan Story Micro-Card */}
            <div className="p-3.5 mb-5 rounded-2xl bg-[#f9ebe3] flex items-center gap-3 border border-[#eee0d8]">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#f3e6dd] border border-[#eee0d8]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcs370zIHlgLyCh_rDswjadDHOQ6nTD2mplcRzgMgoIpmtaGKV-_soN2FcS_44oy7WMtW_X8EZWJmxbqjIa_njYqRzj21rl1zvHflIWTkS7ZF0aV6uJNnMCWUHckEVjln-4wtY6O06Y-flhRbAl7xvYvo-HvFvAnCvKM1DFpv75T7_VOSbBNgXsWCRCIAKoUaIkVdH85ID2Qz-yPe1Pd3PyV_QsEePUjUm9J04e_d7tJrJolSx3T3v"
                  alt="Laxmi"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#211a16] font-bold">Crafted by Laxmi &amp; Collective</p>
                <p className="text-[11px] text-[#55433e] truncate">
                  Fair-trade certified artisan group in Patan, Ward 7
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 py-4 border-t border-b border-[#eee0d8] text-xs text-[#55433e]">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#211a16]">{formatPrice(baseSubtotal)}</span>
              </div>
              {giftNoteEnabled && (
                <div className="flex justify-between items-center">
                  <span>Lokta Gift Packaging &amp; Seal</span>
                  <span className="font-semibold text-[#211a16]">{formatPrice(150)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>Valley Delivery</span>
                  {shippingCost === 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#d2e9d2] text-[#0d1f12] text-[10px] font-bold">
                      KTM PROMO
                    </span>
                  )}
                </div>
                <span className={`font-semibold ${shippingCost === 0 ? 'text-[#4f6352]' : 'text-[#211a16]'}`}>
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 text-sm">
                <span className="font-serif font-bold text-[#211a16] text-base">Total Payable</span>
                <span className="font-serif font-bold text-2xl text-[#96432b]">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Big Action CTA Button */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full py-4 px-6 rounded-xl bg-[#96432b] hover:bg-[#833822] text-white text-sm font-semibold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>Place Order &amp; Pay {formatPrice(grandTotal)}</span>
              </button>

              <p className="text-[11px] leading-relaxed text-[#55433e] text-center">
                By confirming, you agree to Nyanopan terms. You will receive an immediate SMS dispatch
                dispatch receipt on <strong className="text-[#211a16] font-semibold">+977 {mobileNumber}</strong>.
              </p>

              <div className="flex items-center justify-center gap-6 pt-2 text-[#88726c]">
                <div className="flex items-center gap-1 text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  14-Day Free Exchange
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[14px]">eco</span>
                  Zero-Plastic Pack
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <OrderSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        orderDetails={submittedOrder}
        orderNumber={orderNumber}
      />
    </div>
  );
};
