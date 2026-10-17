import React from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

export const HomeView: React.FC = () => {
  const { setActiveView, addToCart, formatPrice, toggleWishlist, isInWishlist } = useCart();

  const featured = PRODUCTS.slice(0, 4);

  const testimonials = [
    {
      quote:
        'Living in Lazimpat during winter mornings, our tiled floors used to be freezing. These slippers mold to your feet like a glove and stay warm without sweating.',
      author: 'Dr. Aarav Joshi',
      location: 'Lazimpat, Kathmandu',
      product: 'Patan Classic Felt Slipper in Terracotta',
      rating: 5,
    },
    {
      quote:
        'The pure felted trivet set sits on our dining table every day. The texture is breathtaking, and knowing it supported women artisans in Patan makes it even more meaningful.',
      author: 'Pravin & Sabina Shrestha',
      location: 'Lakeside, Pokhara',
      product: 'Himalayan Pebble Trivet',
      rating: 5,
    },
    {
      quote:
        'Shipped all the way to Berlin via DHL Express in 6 days. The craft quality surpasses European luxury house slippers at twice the price. Pure Himalayan soul.',
      author: 'Elena Meyer',
      location: 'Berlin, Germany',
      product: 'Himalayan Low-Back Mule',
      rating: 5,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pb-12 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 lg:pt-8">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f9ebe3] text-[#4f6352] text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs border border-[#eee0d8]">
                <span className="w-2 h-2 rounded-full bg-[#4f6352]"></span>
                <span>Handmade in the Patan Valley</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] lg:leading-[64px] text-[#211a16] font-bold tracking-tight mb-4">
                Warmth Crafted by <br />
                <span className="italic font-normal text-[#96432b]">Himalayan Hands.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#55433e] max-w-xl mb-8 leading-relaxed">
                Ethically handmade wool felt slippers, boots, and mindful living goods shaped with
                pure New Zealand wool and Kathmandu heritage craft. Made with care. Rooted in Nepal.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('shop-all', { category: 'footwear' })}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#96432b] text-white text-xs font-semibold hover:bg-[#833822] transition-all shadow-md active:translate-y-px text-center cursor-pointer"
                >
                  <span>Explore Footwear Collection</span>
                  <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('artisan-story')}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#f9ebe3] hover:bg-[#f3e6dd] text-[#211a16] text-xs font-semibold transition-all text-center cursor-pointer border border-[#eee0d8]"
                >
                  <span>Discover Our Artisan Collective</span>
                </button>
              </div>

              {/* Ambient Metric Snippet */}
              <div className="grid grid-cols-3 gap-6 pt-8 mt-6 w-full max-w-lg border-t border-[#eee0d8]">
                <div>
                  <p className="font-serif text-2xl font-bold text-[#96432b]">100%</p>
                  <p className="text-xs text-[#55433e]">Natural Highland Wool</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#211a16]">84+</p>
                  <p className="text-xs text-[#55433e]">Women Artisans</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#4f6352]">0</p>
                  <p className="text-xs text-[#55433e]">Glues or Synthetics</p>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#fff1e9] shadow-lg border border-[#eee0d8] group cursor-pointer"
                onClick={() =>
                  setActiveView('product-detail', { productId: 'patan-classic-slipper' })
                }
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXCijSXJ4dZqXV4lf1__kqupK_T3ueQnOCTQUFD1R72mStt3fefdamk2W1edudyFhglbTDfwiiN4MH68n_6cMRwci8o9By_b5KuslNjU7ITNOOX-aJ0NTX-KnlFeT5zNrc7hZtZLyzckqs3MsjAQ79LxtoxPMeoDyjz4oKhK8JXb8rQVW6_JCjrPgYFrvZSVeoeRpBG32hmEH-6O2UP_cAXEzMChx8KIkWTi0jK2FJ3WwphIRrRK7I"
                  alt="Molded terracotta wool slippers"
                />

                {/* Artisan Location Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xs flex items-center justify-between gap-3 border border-[#eee0d8]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#96432b] text-[24px]">
                      dry_cleaning
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#211a16]">100% Organic Wool</p>
                      <p className="text-[11px] text-[#55433e]">Lalitpur Heritage Workshop</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#d2e9d2] text-[#0d1f12] text-[10px] font-bold">
                    Batch #14
                  </span>
                </div>
              </div>

              {/* Decorative craft badge */}
              <div className="hidden sm:flex absolute -top-3 -right-3 bg-white px-3.5 py-2 rounded-xl shadow-md flex-col items-center border border-[#eee0d8]">
                <span className="font-serif italic text-base font-bold text-[#96432b]">
                  Seamless
                </span>
                <span className="text-[10px] text-[#55433e] uppercase tracking-wider font-semibold">
                  Hand-Wet Felted
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="w-full bg-[#fff1e9] py-8 border-y border-[#eee0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[#eee0d8]">
              <div className="w-10 h-10 rounded-full bg-[#f9ebe3] flex items-center justify-center text-[#96432b] shrink-0">
                <span className="material-symbols-outlined text-[20px]">pan_tool</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#211a16] truncate">Handmade in Nepal</h2>
                <p className="text-[11px] text-[#55433e] truncate">Kathmandu &amp; Patan craft</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[#eee0d8]">
              <div className="w-10 h-10 rounded-full bg-[#d2e9d2] flex items-center justify-center text-[#4f6352] shrink-0">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#211a16] truncate">Chemical-Free Felting</h2>
                <p className="text-[11px] text-[#55433e] truncate">Water, olive soap &amp; sun</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[#eee0d8]">
              <div className="w-10 h-10 rounded-full bg-[#f9ebe3] flex items-center justify-center text-[#96432b] shrink-0">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#211a16] truncate">Fair Wage Collective</h2>
                <p className="text-[11px] text-[#55433e] truncate">Women-led social craft</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[#eee0d8]">
              <div className="w-10 h-10 rounded-full bg-[#f3e6dd] flex items-center justify-center text-[#605c52] shrink-0">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#211a16] truncate">Pan-Nepal &amp; Global</h2>
                <p className="text-[11px] text-[#55433e] truncate">7 Provinces &amp; Worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase Bento Grid */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-2">
            <div>
              <span className="text-xs text-[#4f6352] uppercase tracking-widest font-bold block mb-1">
                Curation
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#211a16] font-bold">
                Crafted for Mindful Living
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#55433e] max-w-md">
              Explore our collections shaped by hand in small artisan batches using traditional wet
              compression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tile 1: Footwear */}
            <div
              onClick={() => setActiveView('shop-all', { category: 'footwear' })}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#eee0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#fff1e9] relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXCijSXJ4dZqXV4lf1__kqupK_T3ueQnOCTQUFD1R72mStt3fefdamk2W1edudyFhglbTDfwiiN4MH68n_6cMRwci8o9By_b5KuslNjU7ITNOOX-aJ0NTX-KnlFeT5zNrc7hZtZLyzckqs3MsjAQ79LxtoxPMeoDyjz4oKhK8JXb8rQVW6_JCjrPgYFrvZSVeoeRpBG32hmEH-6O2UP_cAXEzMChx8KIkWTi0jK2FJ3WwphIRrRK7I"
                  alt="Footwear"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[#211a16] text-[11px] font-bold border border-[#eee0d8]">
                  Signature Line
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Felt Footwear
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1">
                    Mule slippers, high-ankle indoor booties, barefoot organic comfort.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[#96432b] text-xs font-semibold gap-1">
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 2: Home Decor */}
            <div
              onClick={() => setActiveView('shop-all', { category: 'home-decor' })}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#eee0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#fff1e9] relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvPrWDp7hzNBHs7HF4YLtImZ0UBDWHJdKbIwHVQXaPV9Qzk8Vw1JfB71IkgbQ-1KormFw-bXqcG_sv74RKt3stIzD4l1oVDTEUhWdLqTHeGRj6MMoDeFcf2boUC5tjd1xnkb298btYxoF_XacgMyR8KO_gyooCrYiHR5T56jlnDW4eZxTIghhinC1GMINk8h8hncDHM0lTcgDOsJXEjtVsytBDMLrNtJ2LxLdEIwN3Jewd0DDXNpEj"
                  alt="Decor"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[#211a16] text-[11px] font-bold border border-[#eee0d8]">
                  Artisan Batch
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Wool Home Decor
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1">
                    Hand-rolled felt ball rugs, organic pebble trivets, sculptural coasters.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[#96432b] text-xs font-semibold gap-1">
                  <span>Explore Decor</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 3: Accessories */}
            <div
              onClick={() => setActiveView('shop-all', { category: 'accessories' })}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#eee0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#fff1e9] relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMHDcSy5ZygnE_yEwpE7VJG-hjrwgghoaq5eo-S3yL8lI7zdT_Ubnmn0d_vo69TZc6SYCbWdH8tkBF_ejw6Z0W3BEg0pfiHYXAiYG1GRhzJpccAkNnHZuJs7MYMpCtIeCSnnK1Gj7w7dHdUg_nPOOfvguagnPKPgD6HtvZWNA_qce-WsW4QviwanVy15ScWDqdsZvB3Am2NJwChLNID75VTYIe3rZlyq3uvoGwe4Qz5GGuGP1QzL_z"
                  alt="Accessories"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Felted Accessories
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1">
                    Laptop sleeves, sculpted catchall trays, ergonomic floor cushions.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[#96432b] text-xs font-semibold gap-1">
                  <span>Explore Everyday</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 4: Mindful Gifting */}
            <div
              onClick={() => setActiveView('shop-all', { category: 'gifting' })}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#eee0d8]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#fff1e9] relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMlmpERaOeO3xDLO7KyzrQhaDIDbX1glYwjxLwA8M_tBORLeqzgXMIlVKK_jjQsfyPvb7lDuA5pOy_4DWW05DTDj4YfE5c28PDN962DsD8tR8g6zmt49Dd5KFmOiYY8uOn_ZmJWk_vYA8-BYuDGOVRgcD5NmyAuQubzJcq2mjZFWn58eZi2K27jiAy_lWI1sPcH6JaG4FQSjT5Ven3D3de4nwVtmgYlSRwx-mm5KDk_ONOnud7Tun3"
                  alt="Gifting"
                />
                <div className="absolute top-3 left-3 bg-[#b55b41] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  Lokta Wrapped
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors">
                    Mindful Gifting
                  </h3>
                  <p className="text-xs text-[#55433e] mt-1">
                    Thoughtful gift sets bundled inside authentic textured Lokta craft boxes.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[#96432b] text-xs font-semibold gap-1">
                  <span>Curate a Gift</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artisan Batches */}
      <section className="w-full py-16 bg-[#fff1e9] border-y border-[#eee0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-[11px] text-[#96432b] uppercase tracking-widest font-bold block mb-1">
                Curated Selection
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#211a16] font-bold">
                Featured Artisan Batches
              </h2>
            </div>
            <button
              onClick={() => setActiveView('shop-all')}
              className="text-[#96432b] hover:text-[#833822] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Handcrafted Pieces</span>
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => {
              const isFavorited = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all border border-[#eee0d8]"
                >
                  <div
                    className="relative aspect-[4/5] bg-[#f9ebe3] overflow-hidden cursor-pointer"
                    onClick={() => setActiveView('product-detail', { productId: product.id })}
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={product.images[0]}
                      alt={product.name}
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-[#211a16] px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs border border-[#eee0d8]">
                      {product.tag || 'Artisan Batch'}
                    </span>
                    <button
                      type="button"
                      aria-label="Add to bag"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white text-[#211a16] hover:bg-[#96432b] hover:text-white transition-colors flex items-center justify-center shadow-md cursor-pointer border border-[#eee0d8]"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => setActiveView('product-detail', { productId: product.id })}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {product.colors.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        <span className="text-[10px] text-[#55433e] ml-1">
                          {product.colors.length} Shades
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-bold text-[#211a16] group-hover:text-[#96432b] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#55433e] line-clamp-1">{product.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#eee0d8]/60 flex items-center justify-between">
                      <span className="font-serif text-base font-bold text-[#96432b]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[11px] text-[#4f6352] font-semibold">In Stock</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artisan Heritage & Process Spotlight */}
      <section className="w-full py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f9ebe3] rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#eee0d8]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[#4f6352] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[18px]">spa</span>
                  <span className="uppercase tracking-wider">Slow Craft Philosophy</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#211a16] font-bold">
                  The Gentle Art of <br />
                  <span className="text-[#96432b] italic">Wet Felting.</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#55433e] leading-relaxed">
                  Every single pair of Nyanopan footwear begins not with synthetic machinery or
                  industrial glue, but with raw virgin fleece tufts layered gently across
                  hand-carved Sal-wood shoe molds.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#96432b] font-bold text-xs shrink-0 mt-0.5 shadow-xs border border-[#eee0d8]">
                      1
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[#211a16]">
                        Warm Mountain Water &amp; Olive Soap
                      </h3>
                      <p className="text-[11px] text-[#55433e]">
                        Gentle alkaline soap opens the microscopic scales of natural wool fibers
                        without weakening the core structure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#96432b] font-bold text-xs shrink-0 mt-0.5 shadow-xs border border-[#eee0d8]">
                      2
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[#211a16]">
                        Rhythmic Hand Agitation
                      </h3>
                      <p className="text-[11px] text-[#55433e]">
                        Artisans roll and knead the damp fibers for hours, causing them to lock into
                        a dense, seamless, indestructible weave.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#96432b] font-bold text-xs shrink-0 mt-0.5 shadow-xs border border-[#eee0d8]">
                      3
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[#211a16]">
                        Himalayan Sun Drying
                      </h3>
                      <p className="text-[11px] text-[#55433e]">
                        Footwear is shaped onto solid wood lasts and naturally cured beneath the
                        crisp Kathmandu valley breeze.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveView('artisan-story')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#96432b] font-bold hover:underline cursor-pointer"
                  >
                    <span>Meet Master Artisan Sunita Maharjan &amp; Her Collective</span>
                    <span className="material-symbols-outlined text-[18px]">east</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative w-full aspect-square sm:aspect-[5/4] rounded-2xl overflow-hidden shadow-md border border-[#eee0d8]">
                  <img
                    alt="Master artisan Sunita"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcs370zIHlgLyCh_rDswjadDHOQ6nTD2mplcRzgMgoIpmtaGKV-_soN2FcS_44oy7WMtW_X8EZWJmxbqjIa_njYqRzj21rl1zvHflIWTkS7ZF0aV6uJNnMCWUHckEVjln-4wtY6O06Y-flhRbAl7xvYvo-HvFvAnCvKM1DFpv75T7_VOSbBNgXsWCRCIAKoUaIkVdH85ID2Qz-yPe1Pd3PyV_QsEePUjUm9J04e_d7tJrJolSx3T3v"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xs border border-[#eee0d8]">
                    <p className="font-serif italic text-xs text-[#211a16] leading-relaxed">
                      “Felting teaches patience. The wool decides when it is ready; our hands simply
                      listen to the fiber.”
                    </p>
                    <p className="text-[11px] text-[#96432b] font-bold mt-1">
                      — Sunita Maharjan, Lead Felting Artisan (11 Years with Guild)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="w-full py-16 bg-[#fff1e9] border-t border-[#eee0d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs text-[#4f6352] uppercase tracking-widest font-bold block mb-1">
              Lived In &amp; Loved
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#211a16]">
              Stories from Cold Mornings
            </h2>
            <p className="text-xs text-[#55433e] mt-1">
              Real feedback from homes across Kathmandu, Pokhara, and conscious households worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-xs flex flex-col justify-between border border-[#eee0d8] space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#E09422]">
                    {[...Array(t.rating)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-serif italic text-xs text-[#211a16] leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#eee0d8]">
                  <p className="text-xs font-bold text-[#211a16]">{t.author}</p>
                  <p className="text-[11px] text-[#55433e]">{t.location}</p>
                  <p className="text-[10px] text-[#96432b] mt-0.5">{t.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
