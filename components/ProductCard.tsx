import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/sheets';
import { Bookmark, Plus } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Link href={`/product/${product.id}`} className="group relative flex flex-col w-full h-[350px] md:h-[450px] border-r border-b border-black/20 p-4 md:p-6 cursor-pointer hover:bg-white/40 transition-colors">
      <div className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black transition-colors">
         <Bookmark className="w-5 h-5" strokeWidth={1.5} />
      </div>
      
      <div className="relative w-full flex-1 mb-4 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={product.main_images[0] || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'opacity-70 grayscale' : ''}`}
          referrerPolicy="no-referrer"
        />
        {isOutOfStock && (
          <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end w-full mt-auto relative z-10">
        <div className="flex flex-col -space-y-1">
          <span className="text-black font-normal text-lg md:text-xl leading-none">
            {product.base_price.toLocaleString()} $
          </span>
          <span className="text-black font-medium text-lg md:text-2xl tracking-tight leading-none truncate max-w-[150px] md:max-w-[200px] mt-2">
            {product.name}
          </span>
        </div>
        
        <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center shrink-0 hover:bg-gray-800 transition-colors pointer-events-none">
          <Plus className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>
    </Link>
  );
}
