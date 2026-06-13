'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function OrderConfirmContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 min-h-screen flex flex-col items-center text-center">
      <CheckCircle className="w-20 h-20 text-black mb-8" strokeWidth={1} />
      <h1 className="text-3xl md:text-5xl font-medium uppercase tracking-tight mb-6">Order Received</h1>
      
      <p className="text-gray-500 text-sm leading-relaxed mb-10">
        Thank you for your purchase. Your order has been placed and you should have been redirected to WhatsApp to complete the process.
      </p>

      {orderId && (
        <div className="bg-white p-6 w-full mb-12 border border-black/10 rounded-2xl flex flex-col items-center gap-2 shadow-sm">
          <span className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">Order Reference</span>
          <span className="text-xl font-medium tracking-widest">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link href="/shop" className="bg-black border border-black text-white px-10 py-5 text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors">
          Return to Shop
        </Link>
        <Link href="/" className="bg-white border border-black text-black px-10 py-5 text-sm font-semibold uppercase tracking-wide hover:bg-gray-50 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase">Loading...</div>}>
      <OrderConfirmContent />
    </Suspense>
  )
}
