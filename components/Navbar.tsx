'use client';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = useCart((state) => state.getCartItemsCount());
  const pathname = usePathname();

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2 text-gray-700 hover:text-black focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Left Nav */}
        <div className="hidden md:flex gap-8 text-sm font-normal tracking-wide flex-1">
          <Link href="/shop" className="hover:text-gray-500 transition-colors">Shop</Link>
          <Link href="/shop?category=Shoes" className="hover:text-gray-500 transition-colors">Shoes</Link>
          <Link href="/shop?category=Bags" className="hover:text-gray-500 transition-colors">Bags</Link>
        </div>

        {/* Center Logo */}
        <div className="flex-1 md:flex-none flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href="/" className="font-medium text-2xl tracking-widest uppercase hover:opacity-80 transition-opacity flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-sm font-semibold tracking-normal">G</div>
            GLINT
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex gap-6 md:gap-8 items-center justify-end text-sm font-normal tracking-wide flex-1">
          <Link href="/cart" className="relative hover:text-gray-500 transition-colors flex items-center gap-2 pr-2">
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
            <span className="hidden sm:block">Cart</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-0 sm:-top-2 sm:right-auto sm:left-4 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 flex flex-col px-6 py-4 gap-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <Link href="/shop" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 py-2 border-b border-gray-50">All Collections</Link>
          <Link href="/shop?category=Shoes" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 py-2 border-b border-gray-50">Shoes</Link>
          <Link href="/shop?category=Bags" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 py-2 border-b border-gray-50">Bags</Link>
          <Link href="/shop?category=Jackets" className="text-sm font-medium tracking-widest uppercase hover:text-gray-500 py-2">Jackets</Link>
        </div>
      )}
    </div>
  );
}
