import React from 'react';
import { useCart } from '../context/CartContext';

export const ArtisanStoryView: React.FC = () => {
  const { setActiveView } = useCart();

  const stages = [
    {
      num: '01',
      title: 'Hand-Teasing & Sorting',
      desc: 'Raw New Zealand and high-mountain fleece is sorted by staple length and color shade. Synthetic fibers are strictly excluded.',
    },
    {
      num: '02',
      title: 'Carding Fleece Clouds',
      desc: 'Wooden hand carders align the crimped wool fibers into delicate gossamer clouds ready for multidirectional layering.',
    },
    {
      num: '03',
      title: 'Cross-Lamination on Sal-Wood Molds',
      desc: 'Seven to nine crisscrossed layers are sculpted around hand-carved solid Sal-wood shoe foot forms without seams or cuts.',
    },
    {
      num: '04',
      title: 'Himalayan Spring Water & Olive Soap',
      desc: 'Warm alkaline mountain water combined with pure natural olive oil soap gently activates the wool cuticles and opens fiber scales.',
    },
    {
      num: '05',
      title: 'Rhythmic Hand Felting & Fulling',
      desc: 'Over four hours of sustained rhythmic rolling, kneading, and hand compression shrink and interlock the fleece by 40%.',
    },
    {
      num: '06',
      title: 'Himalayan Sun Curing on Terraces',
      desc: 'Footwear is dried slowly under crisp Patan sunshine for two full days, allowing natural sheep lanolin to set into the dense felt.',
    },
    {
      num: '07',
      title: 'Artisan Buffalo Suede Hand-Stitching',
      desc: 'Vegetable-tanned buffalo split suede soles are hand-punched and stitched with waxed natural linen twine for silent indoor steps.',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d2e9d2]/60 text-[#4f6352] text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#4f6352]"></span>
          <span>Lagankhel, Patan Workshop Guild #408</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#211a16] font-bold tracking-tight">
          Crafting Dignity with Every Stitch.
        </h1>
        <p className="text-sm sm:text-base text-[#55433e] leading-relaxed">
          Nyanopan was founded in the historic Kathmandu Valley with a single promise: celebrate
          indigenous Newar and Tamang wet-felting traditions while providing safe, dignified,
          fair-wage livelihoods for independent female artisans.
        </p>
      </div>

      {/* Meet Lead Artisan Sunita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#fff1e9] rounded-3xl p-6 sm:p-10 border border-[#eee0d8] mb-16">
        <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-square shadow-md border border-[#eee0d8]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcs370zIHlgLyCh_rDswjadDHOQ6nTD2mplcRzgMgoIpmtaGKV-_soN2FcS_44oy7WMtW_X8EZWJmxbqjIa_njYqRzj21rl1zvHflIWTkS7ZF0aV6uJNnMCWUHckEVjln-4wtY6O06Y-flhRbAl7xvYvo-HvFvAnCvKM1DFpv75T7_VOSbBNgXsWCRCIAKoUaIkVdH85ID2Qz-yPe1Pd3PyV_QsEePUjUm9J04e_d7tJrJolSx3T3v"
            alt="Master Artisan Sunita Maharjan"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#96432b] font-bold">
            Lead Master Feltmaker
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#211a16]">Sunita Maharjan</h2>
          <p className="text-xs sm:text-sm text-[#55433e] leading-relaxed">
            Sunita has led our Patan artisan guild for over eleven years. Born and raised in
            historic Lagankhel, she learned wet-felting from her grandmother and refined modern
            seamless anatomical lasting techniques that provide ergonomic arch contouring.
          </p>
          <p className="text-xs sm:text-sm text-[#55433e] leading-relaxed">
            Today, Sunita mentors 18 women artisans, overseeing fair compensation, health insurance
            funds, and flexible working hours tailored around family and children’s schooling.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#4f6352]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">verified</span> Fair Trade Nepal
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">favorite</span> 100% Women-Led
            </span>
          </div>
        </div>
      </div>

      {/* The 7 Stages of Wet Felting */}
      <div className="space-y-8 mb-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs text-[#96432b] font-bold uppercase tracking-wider">
            Ancestral Methodology
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#211a16]">
            The 7 Stages of Wet Felting
          </h2>
          <p className="text-xs text-[#55433e]">
            No plastic molds, no synthetic glues, no toxic fumes. Just hands, wool, and patience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.num}
              className="bg-white p-6 rounded-2xl border border-[#eee0d8] shadow-xs space-y-3"
            >
              <span className="font-serif text-2xl font-bold text-[#96432b]">{stage.num}</span>
              <h3 className="font-serif text-base font-bold text-[#211a16]">{stage.title}</h3>
              <p className="text-xs text-[#55433e] leading-relaxed">{stage.desc}</p>
            </div>
          ))}

          {/* Callout Card */}
          <div className="bg-[#f9ebe3] p-6 rounded-2xl border border-[#eee0d8] flex flex-col justify-between">
            <div className="space-y-2">
              <span className="material-symbols-outlined text-[#4f6352] text-3xl">nest_eco_leaf</span>
              <h3 className="font-serif text-base font-bold text-[#211a16]">
                Biodegradable &amp; Circular
              </h3>
              <p className="text-xs text-[#55433e] leading-relaxed">
                At the end of its multi-year lifespan, pure un-dyed wool naturally composts into the
                soil within months, returning organic nitrogen to the earth.
              </p>
            </div>
            <button
              onClick={() => setActiveView('shop-all')}
              className="mt-4 px-4 py-2.5 bg-[#96432b] text-white text-xs font-semibold rounded-xl hover:bg-[#833822] transition-colors cursor-pointer"
            >
              Support the Guild
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
