'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product, fetchProducts } from '@/lib/sheets';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredBags = products.filter(p => p.featured && p.category.toLowerCase() === 'bags').slice(0, 4);
  const featuredShoes = products.filter(p => p.featured && p.category.toLowerCase() === 'shoes').slice(0, 4);
  const featuredJackets = products.filter(p => p.featured && p.category.toLowerCase() === 'jackets').slice(0, 4);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row w-full h-[85vh] md:h-[95vh]">
        <div className="relative w-full md:w-1/2 h-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1400&auto=format&fit=crop"
            alt="Luxury Bag"
            fill
            className="object-cover transition-transform duration-[20s] ease-in-out hover:scale-110"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative w-full md:w-1/2 h-full overflow-hidden hidden md:block">
          <Image
            src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1400&auto=format&fit=crop"
            alt="Fashion Editorial"
            fill
            className="object-cover object-top transition-transform duration-[20s] ease-in-out hover:scale-110"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none text-center px-6">
          <h1 className="text-white font-medium text-5xl md:text-[6rem] lg:text-[7rem] tracking-tight leading-[0.9] drop-shadow-lg select-none">
            EMBRACE<br />PREMIUM
          </h1>
          <p className="text-white/95 font-medium text-xs mt-8 tracking-widest uppercase drop-shadow-md max-w-lg">
            The best is what we can offer. Powered by Google Sheets.
          </p>
          <div className="pointer-events-auto mt-12">
            <Link href="/shop" className="bg-white text-black px-10 py-4 text-xs font-semibold tracking-wide hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection: Jackets */}
      <section className="max-w-7xl mx-auto mt-32 px-6">
        <div className="flex flex-col items-center justify-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Latest Drops</span>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black uppercase">Outerwear</h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black/20">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="w-full h-[350px] md:h-[450px] border-r border-b border-black/20 p-6 flex flex-col justify-between animate-pulse">
                <div className="w-full h-full bg-gray-300/50 mb-4 rounded-xl"></div>
                <div className="h-6 bg-gray-300 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black/20">
            {featuredJackets.length > 0 ? featuredJackets.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : (
              <div className="col-span-2 lg:col-span-4 py-20 text-center text-gray-500 text-sm uppercase tracking-widest">
                Check your Google Sheet and ensure you have items with category 'Jackets' and featured set to 'true'.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Brand Philosophy Split */}
      <section className="flex flex-col md:flex-row w-full mt-32 bg-black text-white">
        <div className="w-full md:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col justify-center">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">Our Philosophy</span>
          <h2 className="font-medium text-3xl md:text-5xl tracking-tight uppercase leading-snug mb-8">
            Built for the modern rhythm of the city.
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-md">
            We merge minimalist aesthetics with high-performance functionality. Every piece is designed to ensure you stand out on the road while maintaining an elegant silhouette.
          </p>
        </div>
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
          <Image
            src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop"
            alt="Brand Philosophy"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Featured Collection: Bags */}
      <section className="max-w-7xl mx-auto mt-32 px-6">
        <div className="flex flex-col items-center justify-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Curated Selection</span>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black uppercase">Premium Bags</h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black/20">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="w-full h-[350px] md:h-[450px] border-r border-b border-black/20 p-6 flex flex-col justify-between animate-pulse">
                <div className="w-full h-full bg-gray-300/50 mb-4 rounded-xl"></div>
                <div className="h-6 bg-gray-300 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black/20">
            {featuredBags.length > 0 ? featuredBags.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : (
               <div className="col-span-2 lg:col-span-4 py-20 text-center text-gray-500 text-sm uppercase tracking-widest">
                No featured bags found in Google Sheets.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Editorial Split */}
      <section className="flex flex-col md:flex-row w-full h-[65vh] md:h-[80vh] gap-6 px-6 md:px-12 mt-32">
        <div className="relative w-full md:w-1/2 h-full bg-[#f8f8f8] group overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
            alt="Editorial"
            fill
            className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute bottom-10 left-10 z-10">
             <span className="text-white font-medium text-3xl md:text-4xl tracking-tight uppercase block mb-2">Classic<br/>Essentials</span>
             <Link href="/shop" className="text-white/90 font-normal text-xs tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white/50 hover:after:bg-white transition-colors">
               Explore Collection
             </Link>
          </div>
        </div>
        <div className="relative w-full md:w-1/2 h-full bg-[#f8f8f8] group overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            alt="Editorial"
            fill
            className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute bottom-10 left-10 z-10">
             <span className="text-white font-medium text-3xl md:text-4xl tracking-tight uppercase block mb-2">Winter<br/>Collection</span>
             <Link href="/shop" className="text-white/90 font-normal text-xs tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white/50 hover:after:bg-white transition-colors">
               Explore Collection
             </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection: Shoes */}
      <section className="max-w-7xl mx-auto mt-32 px-6 mb-32">
        <div className="flex flex-col items-center justify-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">New Arrivals</span>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black uppercase">Footwear</h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black/20">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="w-full h-[350px] md:h-[450px] border-r border-b border-black/20 p-6 flex flex-col justify-between animate-pulse">
                <div className="w-full h-full bg-gray-300/50 mb-4 rounded-xl"></div>
                <div className="h-6 bg-gray-300 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black/20">
            {featuredShoes.length > 0 ? featuredShoes.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : (
              <div className="col-span-2 lg:col-span-4 py-20 text-center text-gray-500 text-sm uppercase tracking-widest">
                No featured shoes found in Google Sheets.
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center mt-20">
          <Link href="/shop" className="flex items-center gap-2 group text-xs font-semibold uppercase tracking-wide bg-black text-white px-10 py-4 hover:bg-gray-800 transition-colors">
            Shop All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#f8f8f8] py-32 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Stay Connected</span>
          <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-black uppercase mb-6">Join The Club</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-lg">
            Subscribe to our newsletter for exclusive access to upcoming collections, early drops, and behind-the-scenes content.
          </p>
          <form className="w-full relative flex max-w-md mx-auto border-b border-black/20 pb-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              className="w-full bg-transparent outline-none text-sm font-medium tracking-wide placeholder:text-gray-400 placeholder:font-normal"
            />
            <button type="submit" className="text-xs font-semibold uppercase tracking-widest hover:text-gray-500 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
