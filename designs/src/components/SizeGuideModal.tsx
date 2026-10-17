import React from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: number;
  onSelectSize: (size: number) => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  selectedSize,
  onSelectSize,
}) => {
  if (!isOpen) return null;

  const rows = [
    { eu: 36, cm: '22.8 cm', uk: '3.5', usM: '4.5', usW: '6.0' },
    { eu: 37, cm: '23.5 cm', uk: '4.0', usM: '5.0', usW: '6.5' },
    { eu: 38, cm: '24.1 cm', uk: '5.0', usM: '6.0', usW: '7.5' },
    { eu: 39, cm: '24.8 cm', uk: '5.5', usM: '6.5', usW: '8.0' },
    { eu: 40, cm: '25.5 cm', uk: '6.5', usM: '7.5', usW: '9.0' },
    { eu: 41, cm: '26.1 cm', uk: '7.5', usM: '8.5', usW: '10.0' },
    { eu: 42, cm: '26.8 cm', uk: '8.0', usM: '9.0', usW: '10.5' },
    { eu: 43, cm: '27.5 cm', uk: '9.0', usM: '10.0', usW: '11.5' },
    { eu: 44, cm: '28.2 cm', uk: '10.0', usM: '11.0', usW: '12.5' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2A231E]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#fff8f5] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-5 border border-[#eee0d8]">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#96432b] font-bold block mb-1">
              Artisan Craft Sizing
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#211a16]">
              Nepal &amp; International Size Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#f9ebe3] text-[#55433e] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Instructions Step */}
        <div className="p-4 bg-[#fff1e9] rounded-xl space-y-2 border border-[#eee0d8]/80">
          <h4 className="text-xs font-semibold text-[#211a16] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#96432b]">straighten</span>
            <span>How to measure your foot in 3 simple steps:</span>
          </h4>
          <ol className="list-decimal pl-5 text-xs text-[#55433e] space-y-1 leading-relaxed">
            <li>Stand barefoot on a piece of paper placed against a flat wall.</li>
            <li>Mark the tip of your longest toe and back of your heel with a pencil.</li>
            <li>Measure the distance in centimeters (cm) and refer to our table below.</li>
          </ol>
        </div>

        {/* Conversion Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9ebe3] text-[#211a16] font-semibold">
                <th className="p-2.5 rounded-l-lg">EU Size</th>
                <th className="p-2.5">Foot Length (cm)</th>
                <th className="p-2.5">UK / Nepal Unisex</th>
                <th className="p-2.5">US Men</th>
                <th className="p-2.5 rounded-r-lg">US Women</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee0d8]">
              {rows.map((row) => {
                const isSelected = selectedSize === row.eu;
                return (
                  <tr
                    key={row.eu}
                    onClick={() => onSelectSize(row.eu)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#f3e6dd] font-semibold text-[#96432b]'
                        : 'hover:bg-[#fff1e9] text-[#55433e]'
                    }`}
                  >
                    <td className="p-2.5 font-bold text-[#96432b] flex items-center gap-1">
                      <span>{row.eu}</span>
                      {isSelected && <span className="text-[10px] text-[#4f6352]">(Selected)</span>}
                    </td>
                    <td className="p-2.5">{row.cm}</td>
                    <td className="p-2.5">{row.uk}</td>
                    <td className="p-2.5">{row.usM}</td>
                    <td className="p-2.5">{row.usW}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-[#55433e]">
            Selected Size: <span className="font-bold text-[#96432b]">EU {selectedSize}</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#96432b] hover:bg-[#833822] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Got It, Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
