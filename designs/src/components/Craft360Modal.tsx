import React, { useState } from 'react';
import { Product } from '../types';

interface Craft360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const Craft360Modal: React.FC<Craft360ModalProps> = ({ isOpen, onClose, product }) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  if (!isOpen) return null;

  const angles = [
    { label: '3/4 Studio Perspective', desc: 'Hand-shaped contoured curve & seamless wool form' },
    { label: 'Interior Fleece & Arch Bed', desc: 'Seamless plush natural fleece lining and organic footbed shape' },
    { label: 'Suede Sole & Waxed Stitch', desc: 'Artisanal buffalo split sole hand-stitched with waxed linen twine' },
    { label: 'Living Room Lifestyle', desc: 'Quiet footsteps on hardwood and woven Himalayan dhurries' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-[#2A231E]/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-[#fff8f5] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#eee0d8] overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#eee0d8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#96432b]">rotate_right</span>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#211a16]">
                360° Artisan Craft Inspection
              </h3>
              <p className="text-xs text-[#55433e]">
                {product.name} • {product.artisanGroup}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#f9ebe3] text-[#55433e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Big Preview Area */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#fff1e9] mt-4 shadow-inner">
          <img
            src={product.images[activeAngleIndex % product.images.length]}
            alt={angles[activeAngleIndex].label}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-3 left-3 bg-[#fff8f5]/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xs">
            <p className="text-xs font-bold text-[#211a16]">{angles[activeAngleIndex].label}</p>
            <p className="text-[11px] text-[#55433e]">{angles[activeAngleIndex].desc}</p>
          </div>
        </div>

        {/* Rotate / Angle selector strip */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {angles.map((angle, idx) => (
            <button
              key={angle.label}
              onClick={() => setActiveAngleIndex(idx)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                activeAngleIndex === idx
                  ? 'border-[#96432b] bg-[#f9ebe3] ring-1 ring-[#96432b]'
                  : 'border-[#eee0d8] bg-white hover:bg-[#fff1e9]'
              }`}
            >
              <p className="text-[11px] font-bold text-[#211a16] truncate">0{idx + 1}. Perspective</p>
              <p className="text-[10px] text-[#55433e] truncate">{angle.label}</p>
            </button>
          ))}
        </div>

        {/* Handcrafted Verification Bar */}
        <div className="mt-4 p-3 bg-[#d2e9d2]/40 rounded-xl flex items-center justify-between text-xs text-[#4f6352]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            100% Zero Synthetics or Adhesives • Wet Felting Verified
          </span>
          <span className="text-[11px]">Kathmandu Valley Guild</span>
        </div>
      </div>
    </div>
  );
};
