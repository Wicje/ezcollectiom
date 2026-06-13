'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getSubtotal, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    note: ''
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0 && !loading) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center text-center py-20 gap-8">
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Your cart is empty.</p>
          <Link href="/shop" className="bg-black text-white px-10 py-4 text-xs font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors">
            Return to Shop
          </Link>
        </div>
     )
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 15;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Generate Order ID
      const orderId = `ORD-${Date.now()}`;
      
      const itemsListStr = items.map(i => {
        const itemPrice = i.variant?.price || i.product.base_price;
        return `${i.quantity}x ${i.product.name} ${i.selectedColor ? i.selectedColor : ''} ${i.selectedSize ? i.selectedSize : ''} - ${(itemPrice * i.quantity).toLocaleString()} $`;
      }).join('%0A');

      // 2. Email Receipt via Resend / EmailJS placeholder
      // USER: Fill in your EmailJS or Resend logic here. 
      // await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", { orderId, email: formData.email ... })
      
      // 3. Hidden Google Form submission for Order Backup (Power Move!)
      // USER: Create a Google Form with fields for OrderID, Name, Email, Phone, Address, Items, Total. 
      // Get the form action URL (https://docs.google.com/forms/d/e/.../formResponse) and entry IDs.
      const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
      if (GOOGLE_FORM_URL.includes("YOUR_FORM_ID") === false) {
          const formParams = new URLSearchParams();
          // example mappings:
          formParams.append("entry.1111111", orderId);
          formParams.append("entry.2222222", formData.fullName);
          formParams.append("entry.3333333", itemsListStr);
          formParams.append("entry.4444444", total.toString());
          
          fetch(GOOGLE_FORM_URL, {
             method: "POST",
             mode: "no-cors",
             headers: { "Content-Type": "application/x-www-form-urlencoded" },
             body: formParams.toString()
          }).catch(console.error); // Silent fail is fine
      }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating network request
      
      // 4. Clear Cart
      clearCart();

      // 5. Redirect to WhatsApp
      const MY_WHATSAPP_NUMBER = "2347053245286"; // USER: Replace with your phone number (with country code)
      const waMessage = `Hello Zinnes!%0A%0AHere is my order: ${orderId}%0A%0A*Items:*%0A${itemsListStr}%0A%0A*Total:* ${total.toLocaleString()} $%0A%0A*Customer Info:*%0AName: ${formData.fullName}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AAddress: ${formData.address}, ${formData.state}%0ANote: ${formData.note || 'None'}`;
      
      const waLink = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${waMessage}`;
      
      // Open WA in new tab
      window.open(waLink, '_blank');
      
      // 6. Go to confirmation page
      router.push(`/order-confirm?orderId=${orderId}`);

    } catch (err) {
      console.error(err);
      alert('Failed to process order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-medium uppercase tracking-tight mb-16 text-center">Checkout</h1>
      
      <div className="flex flex-col-reverse lg:flex-row gap-16 lg:gap-24">
        
        {/* Form */}
        <div className="flex-1">
          <h2 className="font-medium text-sm uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="border border-gray-300 p-4 text-xs font-medium outline-none focus:border-black transition-colors bg-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 p-4 text-xs font-medium outline-none focus:border-black transition-colors bg-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 p-4 text-xs font-medium outline-none focus:border-black transition-colors bg-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">State/Region</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="border border-gray-300 p-4 text-xs font-medium outline-none focus:border-black transition-colors bg-transparent" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">Delivery Address</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="border border-gray-300 p-4 text-xs font-medium outline-none focus:border-black transition-colors resize-none bg-transparent" />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">Order Notes (Optional)</label>
                <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className="border border-gray-300 p-4 text-xs font-medium outline-none focus:border-black transition-colors resize-none bg-transparent" />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-8 bg-black text-white px-10 py-5 text-xs font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Place Order via WhatsApp'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0 bg-white shadow-sm border border-black/5 p-8 md:p-10 self-start rounded-2xl">
            <h2 className="font-medium text-xl uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="flex flex-col gap-6 mb-8 border-b border-gray-200 pb-8">
              {items.map(item => {
                const itemPrice = item.variant?.price || item.product.base_price;
                return (
                  <div key={item.cartId} className="flex justify-between items-start gap-4">
                     <div className="flex flex-col">
                       <span className="text-sm font-medium tracking-wide">{item.product.name}</span>
                       <span className="text-[10px] text-gray-500 font-medium tracking-widest mt-1 uppercase">Qty: {item.quantity} {item.selectedColor && `| ${item.selectedColor}`} {item.selectedSize && `| ${item.selectedSize}`}</span>
                     </div>
                     <span className="text-sm font-medium">{(itemPrice * item.quantity).toLocaleString()} $</span>
                  </div>
                )
              })}
            </div>

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

            <div className="flex justify-between items-end border-t border-gray-200 pt-6">
               <span className="text-sm uppercase font-medium tracking-widest text-black">Total</span>
               <span className="text-2xl text-black font-semibold">{total.toLocaleString()} $</span>
            </div>
        </div>

      </div>
    </div>
  );
}
