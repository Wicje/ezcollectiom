'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Product, getProductById } from '@/lib/sheets';
import { getAvailableColors, getAvailableSizes, findMatchingVariant } from '@/lib/variants';
import { useCart } from '@/lib/cart';
import { toast } from 'sonner';
import clsx from 'clsx';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const addItemToCart = useCart((state) => state.addItem);

  const sizes = product ? getAvailableSizes(product.variants) : [];
  const colors = product ? getAvailableColors(product.variants) : [];
  const selectedVariant = product ? findMatchingVariant(product.variants, selectedSize, selectedColor) : undefined;
  
  // Calculate final images array (using variant images if available, else product main images)
  const displayImages = selectedVariant?.images?.length ? selectedVariant.images : (product?.main_images || []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMainImageIndex(0);
  }, [selectedColor, selectedSize]);

  useEffect(() => {
    async function fetchSpecific() {
      if (!id) return;
      try {
        const p = await getProductById(id);
        if (p) setProduct(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpecific();
  }, [id]);

// Obsolete block removed

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase animate-pulse">Loading Product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase">Product Not Found.</div>;
  }

  // Compute final price based on selected variant
  const displayPrice = selectedVariant?.price || product.base_price;
  
  const isOutOfStock = product.stock <= 0;
  
  // Require selections if variants exist
  const needsSize = sizes.length > 0 && !selectedSize;
  const needsColor = colors.length > 0 && !selectedColor;
  const canAddToCart = !isOutOfStock && !needsSize && !needsColor;

  const handleAddToCart = () => {
    if (canAddToCart) {
      addItemToCart(product, selectedVariant, selectedSize, selectedColor);
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error('Please select all options before adding to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-10">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-black">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
        
        {/* Left Column (Thumbnails & Info) */}
        <div className="md:col-span-3 flex flex-col gap-10 order-2 md:order-1 pt-4 md:pt-10">
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {displayImages.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setMainImageIndex(i)} 
                className={clsx(
                  "relative w-24 h-32 md:w-full md:h-48 bg-gray-100 border transition-all cursor-pointer overflow-hidden shrink-0 rounded-lg", 
                  mainImageIndex === i ? "border-black" : "border-transparent hover:border-black/20"
                )}
              >
                 <Image src={img} alt="" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>

          <div className="border-t border-black/20 pt-6">
             <h3 className="text-xl md:text-2xl font-medium mb-4 tracking-tight">Description</h3>
             <p className="text-sm text-gray-600 leading-relaxed">
               {product.description}
             </p>
          </div>

          <div className="border-t border-black/20 pt-6 border-b border-black/20 pb-6">
             <h3 className="text-xl md:text-2xl font-medium mb-4 tracking-tight">Details</h3>
             <p className="text-sm text-gray-600 leading-relaxed">
               Made with high quality materials, featuring precise stitching and minimalist aesthetic perfect for dynamic modern life.
             </p>
          </div>
        </div>

        {/* Center Column (Main Image) */}
        <div className="md:col-span-6 order-1 md:order-2 w-full aspect-[3/4] md:aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center relative shadow-sm border border-black/5">
            <Image
              src={displayImages[mainImageIndex] || displayImages[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
              priority
            />
        </div>

        {/* Right Column (Actions/Options) */}
        <div className="md:col-span-3 flex flex-col justify-center order-3 md:order-3 pt-4 md:pt-10">
           <h1 className="text-3xl md:text-5xl font-semibold mb-2 tracking-tight uppercase leading-none">{product.name}</h1>
           <div className="text-xl md:text-2xl text-gray-700 font-medium tracking-tight mb-10">{displayPrice.toLocaleString()} $</div>
           
           {/* Color Selection */}
           {colors.length > 0 && (
             <div className="mb-8">
               <h3 className="text-lg font-medium mb-3 tracking-tight">Colour</h3>
               <div className="flex flex-wrap gap-2">
                 {colors.map(color => (
                   <button
                     key={color}
                     onClick={() => setSelectedColor(color)}
                     className={clsx(
                       "px-4 h-10 flex items-center justify-center text-sm border transition-all font-medium",
                       selectedColor === color ? "border-black bg-black text-white" : "border-black bg-white text-black hover:bg-black/5"
                     )}
                   >
                     {color}
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Size Selection */}
           {sizes.length > 0 && (
             <div className="mb-10">
               <h3 className="text-lg font-medium mb-3 tracking-tight">Size</h3>
               <div className="flex flex-wrap gap-2">
                 {sizes.map(size => (
                   <button
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={clsx(
                       "min-w-[2.5rem] px-2 h-10 flex items-center justify-center text-sm border transition-all font-medium",
                       selectedSize === size ? "border-black bg-black text-white" : "border-black hover:border-black text-black bg-transparent"
                     )}
                   >
                     {size}
                   </button>
                 ))}
               </div>
             </div>
           )}

           <div className="flex w-full mt-4">
             <button
               className="flex-1 py-4 text-center border border-black hover:bg-black/5 transition-colors text-sm md:text-base font-medium tracking-tight"
             >
               To Favorites
             </button>
             <button
               onClick={handleAddToCart}
               disabled={isOutOfStock}
               className="flex-1 py-4 text-center bg-black border border-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base font-medium tracking-tight"
             >
               {isOutOfStock ? "Sold Out" : "Buy"}
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
