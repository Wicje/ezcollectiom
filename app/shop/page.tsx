'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, fetchProducts } from '@/lib/sheets';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const rawCategoryFilter = searchParams.get('category');
  const categoryFilter = rawCategoryFilter ? rawCategoryFilter.toLowerCase() : null;
  const searchFilter = searchParams.get('q')?.toLowerCase() || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter products
  const filteredProducts = products.filter(p => {
    let match = true;
    if (categoryFilter && p.category.toLowerCase() !== categoryFilter) {
      match = false;
    }
    if (searchFilter && !p.name.toLowerCase().includes(searchFilter)) {
      match = false;
    }
    return match;
  });

  const categories = Array.from(new Set(products.map(p => p.category.toLowerCase())));

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 shrink-0">
          <h2 className="font-medium text-xl uppercase tracking-widest mb-8">Shop</h2>
          
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase font-medium tracking-widest text-gray-400">Categories</span>
            <a 
              href="/shop" 
              className={`text-sm tracking-wide hover:text-black ${!categoryFilter ? 'font-medium text-black' : 'text-gray-500'}`}
            >
              All
            </a>
            {categories.map(cat => (
              <a 
                key={cat}
                href={`/shop?category=${cat}`}
                className={`text-sm tracking-wide capitalize hover:text-black ${categoryFilter === cat ? 'font-medium text-black' : 'text-gray-500'}`}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 border-t border-l border-black/20">
               {[1, 2, 3, 4, 5, 6].map(n => (
                 <div key={n} className="w-full h-[350px] md:h-[450px] border-r border-b border-black/20 p-6 flex flex-col justify-between animate-pulse">
                   <div className="w-full h-full bg-gray-300/50 mb-4 rounded-xl"></div>
                   <div className="h-6 bg-gray-300 w-1/3"></div>
                 </div>
               ))}
             </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 border-t border-l border-black/20">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-sm tracking-widest uppercase">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
