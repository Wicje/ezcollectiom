import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'Zinnes E-commerce',
  description: 'Premium static e-commerce backed by Google Sheets',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#EAEAEA] text-black min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
