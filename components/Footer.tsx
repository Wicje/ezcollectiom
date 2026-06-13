import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-gray-100 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-start gap-12">
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="font-medium text-2xl tracking-widest uppercase hover:opacity-80 transition-opacity flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-sm font-semibold tracking-normal">Z</div>
            ZINNES
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium quality reflective apparel for modern urban living.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-medium text-sm text-black">Company</span>
            <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-medium text-sm text-black">Support</span>
            <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Returns Policy</Link>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-black transition-colors">Help Center</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium tracking-wide">
        <span>© 2026 Zinnes. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-black transition-colors">Instagram</Link>
          <Link href="#" className="hover:text-black transition-colors">Twitter</Link>
        </div>
      </div>
    </footer>
  );
}
