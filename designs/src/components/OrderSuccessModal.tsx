import React from 'react';
import { OrderDetails } from '../types';
import { useCart } from '../context/CartContext';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails | null;
  orderNumber: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
  orderNumber,
}) => {
  const { setActiveView, formatPrice } = useCart();

  if (!isOpen || !orderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-[#2A231E]/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-[#fff8f5] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#eee0d8] space-y-6">
        {/* Success header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#d2e9d2] text-[#4f6352] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#4f6352] block">
            Dhanyabad! Order Placed Successfully
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#211a16]">
            Your Handcrafted Order is Confirmed
          </h3>
          <p className="text-xs text-[#55433e]">
            Order <strong className="text-[#96432b]">#{orderNumber}</strong> • Dispatched from Lalitpur Atelier
          </p>
        </div>

        {/* SMS Dispatch Simulation Notification */}
        <div className="p-4 bg-[#fff1e9] rounded-xl border border-[#eee0d8] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#96432b]">
            <span className="material-symbols-outlined text-[18px]">sms</span>
            <span>SMS Dispatch Notification Sent</span>
          </div>
          <p className="text-xs text-[#55433e] leading-relaxed">
            A confirmation SMS with live courier tracking has been dispatched to{' '}
            <strong className="text-[#211a16]">+977 {orderDetails.phone}</strong> and an itemized invoice to{' '}
            <strong className="text-[#211a16]">{orderDetails.email}</strong>.
          </p>
        </div>

        {/* Order Meta Snapshot */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-[#eee0d8]">
          <div>
            <span className="text-[11px] text-[#55433e] block">Recipient</span>
            <span className="font-semibold text-[#211a16]">{orderDetails.fullName}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#55433e] block">Payment Gateway</span>
            <span className="font-semibold text-[#96432b] capitalize">{orderDetails.paymentMethod}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-[#eee0d8]">
            <span className="text-[11px] text-[#55433e] block">Delivery Destination</span>
            <span className="text-[#211a16]">
              {orderDetails.street}, {orderDetails.ward}, {orderDetails.municipality}, {orderDetails.district}
            </span>
          </div>
          <div className="col-span-2 flex justify-between items-center pt-2 border-t border-[#eee0d8]">
            <span className="font-semibold text-[#211a16]">Total Amount Paid / Payable</span>
            <span className="font-serif font-bold text-base text-[#96432b]">
              {formatPrice(orderDetails.total)}
            </span>
          </div>
        </div>

        {/* Artisan Guarantee */}
        <div className="flex items-center gap-2 text-[11px] text-[#4f6352] justify-center">
          <span className="material-symbols-outlined text-[16px]">eco</span>
          <span>Packaged in biodegradable cornstarch mailer with Lokta string</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              setActiveView('shop-all');
            }}
            className="flex-1 py-3 px-4 bg-[#96432b] hover:bg-[#833822] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors text-center cursor-pointer"
          >
            Explore More Handcrafted Goods
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-[#f9ebe3] hover:bg-[#f3e6dd] text-[#211a16] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
