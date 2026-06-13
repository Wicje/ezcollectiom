'use client';

import { useCart } from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getSubtotal } = useCart();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 15; // Free delivery over 500
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-medium uppercase tracking-tight mb-16 text-center">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-8">
          <p className="text-gray-500 uppercase tracking-widest text-xs font-medium">Your cart is empty.</p>
          <Link href="/shop" className="bg-black text-white px-10 py-4 text-xs font-semibold tracking-wide hover:bg-gray-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-1">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-black/20 pb-4 mb-8 text-[10px] uppercase font-medium tracking-widest text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="flex flex-col gap-10">
              {items.map(item => {
                const itemPrice = item.variant?.price || item.product.base_price;
                return (
                  <div key={item.cartId} className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center">
                    {/* Product */}
                    <div className="w-full md:col-span-6 flex gap-6 items-center relative">
                      <button 
                        onClick={() => removeItem(item.cartId)}
                        className="absolute -top-2 -right-2 md:static md:top-auto md:right-auto text-gray-400 hover:text-black transition-colors"
                      >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <Link href={`/product/${item.product.id}`} className="w-24 h-32 relative bg-white shrink-0 shadow-sm border border-black/5 p-2 rounded-xl">
                        <Image 
                          src={item.variant?.images?.[0] || item.product.main_images[0]} 
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link href={`/product/${item.product.id}`} className="font-medium text-sm md:text-base tracking-wide uppercase hover:text-gray-500 transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{itemPrice.toLocaleString()} $</p>
                        
                        <div className="flex flex-col gap-1 mt-2">
                          {item.selectedColor && (
                            <span className="text-[10px] uppercase font-medium text-gray-500 tracking-wider">Color: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10px] uppercase font-medium text-gray-500 tracking-wider">Size: {item.selectedSize}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="w-full md:col-span-3 flex justify-between md:justify-center items-center py-4 md:py-0 border-y border-gray-100 md:border-none">
                      <span className="md:hidden text-[10px] uppercase font-medium tracking-widest text-gray-400">Quantity</span>
                      <div className="flex items-center gap-4 border border-gray-300 px-4 py-2">
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="text-gray-400 hover:text-black"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="text-gray-400 hover:text-black"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="w-full md:col-span-3 flex justify-between md:justify-end items-center">
                       <span className="md:hidden text-[10px] uppercase font-medium tracking-widest text-gray-400">Total</span>
                       <span className="text-sm font-medium">{(itemPrice * item.quantity).toLocaleString()} $</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0 bg-white shadow-sm border border-black/5 p-8 md:p-10 self-start rounded-2xl">
            <h2 className="font-medium text-xl uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="flex flex-col gap-4 text-xs font-medium tracking-widest text-gray-500 mb-8">
               <div className="flex justify-between">
                 <span>Subtotal</span>
                 <span className="text-black">{subtotal.toLocaleString()} $</span>
               </div>
               <div className="flex justify-between">
                 <span>Shipping</span>
                 <span className="text-black">{shipping === 0 ? 'FREE' : `${shipping.toLocaleString()} $`}</span>
               </div>
            </div>

            <div className="flex justify-between items-end border-t border-gray-200 pt-6 mb-10">
               <span className="text-sm uppercase font-medium tracking-widest text-black">Total</span>
               <span className="text-2xl text-black font-semibold">{total.toLocaleString()} $</span>
            </div>

            <Link href="/checkout" className="w-full block text-center bg-black text-white px-10 py-5 text-xs font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors rounded-none">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
