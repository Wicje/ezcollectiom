import Papa from 'papaparse';

// ============================================================================
// GOOGLE SHEETS DATABASE CONFIGURATION
// ============================================================================
// To use this:
// 1. Create a Google Sheet.
// 2. Add columns exactly named: id, name, category, description, base_price, variants, main_images, stock, featured, rating
// 3. Go to File > Share > Publish to web. Choose "Entire Document" or your specific tab, and "Comma-separated values (.csv)".
// 4. Copy the link and paste it here:
const SHEET_CSV_URL = process.env.NEXT_PUBLIC_SHEET_CSV_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_Fgjz2hkkwxyBmuzkG90bajGvKbbOPNAsUHMpz5M3f1GuB4JSYa-jl6xk7pZUEKXJkxjW0d8BzHO1/pub?gid=0&single=true&output=csv"; 
// Example dummy data link used above. In a real app, replace with your published CSV link.
// For now, if the sheet fails to load, we will fallback to dummy data.

export interface ProductVariant {
  size?: string;
  color?: string;
  price?: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  variants: ProductVariant[];
  main_images: string[];
  stock: number;
  featured: boolean;
  rating: number;
}

const CACHE_KEY = "sheet_ecommerce_data_v2";
const CACHE_EXPIRY_KEY = "sheet_ecommerce_data_expiry_v2";
const CACHE_DURATION_MS = 50 * 60 * 1000; // 50 minutes

// Dummy data fallback
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "P001",
    name: "Jacket NIX",
    category: "Jackets",
    description: "In a city where rhythm dictates speed and movement, safety becomes part of the style. High-visibility elements keep you safe on the road.",
    base_price: 240,
    variants: [
      { size: "44", color: "Black", price: 240, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop"] },
      { size: "46", color: "Black", price: 240, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"] },
      { size: "48", color: "Black", price: 240, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"] },
      { size: "44", color: "White Metallic", price: 280, images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"] },
      { size: "46", color: "White Metallic", price: 280, images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"] }
    ],
    main_images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"],
    stock: 12,
    featured: true,
    rating: 4.8
  },
  {
    id: "P002",
    name: "Jacket EOS",
    category: "Jackets",
    description: "Reflective metallic surface design tailored for maximum urban impact.",
    base_price: 260,
    variants: [
      { size: "S", color: "Silver", price: 260, images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"] },
      { size: "M", color: "Silver", price: 260, images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"] },
      { size: "L", color: "Silver", price: 260, images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"] },
      { size: "XL", color: "Silver", price: 260, images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"] }
    ],
    main_images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"],
    stock: 5,
    featured: true,
    rating: 5.0
  },
  {
    id: "P003",
    name: "Classic Urban Sneaker",
    category: "Shoes",
    description: "Premium comfort for daily wear. Made with high quality materials.",
    base_price: 215,
    variants: [
      { size: "36", color: "Black Design", price: 215, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"] },
      { size: "38", color: "Black Design", price: 215, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"] },
      { size: "40", color: "Red Line", price: 220, images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop"] }
    ],
    main_images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"],
    stock: 8,
    featured: true,
    rating: 4.0
  },
  {
    id: "P004",
    name: "Sandtex Minimalist Bag",
    category: "Bags",
    description: "Versatile, minimalist design for any occasion.",
    base_price: 150,
    variants: [
      { size: "One Size", color: "Black", price: 150, images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"] }
    ],
    main_images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
    stock: 5,
    featured: true,
    rating: 5.0
  }
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    // 1. Check Session Storage Cache
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(CACHE_KEY);
      const expiry = sessionStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (cached && expiry && Date.now() < parseInt(expiry, 10)) {
        return JSON.parse(cached) as Product[];
      }
    }

    // 2. Fetch from Google Sheets CSV
    if (SHEET_CSV_URL === "YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE") {
      console.log("No valid Sheet CSV URL provided. Using fallback products.");
      return FALLBACK_PRODUCTS;
    }

    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch sheet");
    }
    const csvText = await response.text();

    // 3. Parse CSV
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const products: Product[] = parsed.data.map((row: any) => {
      let variants: ProductVariant[] = [];
      try {
        if (row.variants) {
          variants = JSON.parse(row.variants);
          variants = variants.map(v => {
            if (v.images) {
              v.images = v.images.map(u => {
                if (u.includes('unsplash.com/photos/')) {
                  return "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop";
                }
                return u;
              });
            }
            return v;
          });
        }
      } catch (e) {
        console.warn(`Failed to parse variants for product ${row.id}`);
      }

      let main_images: string[] = [];
      if (row.main_images) {
        main_images = row.main_images.split(',').map((u: string) => {
          let url = u.trim();
          // Fix unsplash HTML page links which crash Next.js image optimization
          if (url.includes('unsplash.com/photos/')) {
             return "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop";
          }
          return url;
        }).filter(Boolean);
      } else {
        // Fallback placeholders
        main_images = ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop"];
      }

      return {
        id: row.id || `P-${Math.random().toString(36).substr(2, 9)}`,
        name: row.name || "Unnamed Product",
        category: row.category || "Uncategorized",
        description: row.description || "",
        base_price: parseFloat(row.base_price) || 0,
        variants,
        main_images,
        stock: parseInt(row.stock || "0", 10),
        featured: row.featured?.toLowerCase() === 'true',
        rating: parseFloat(row.rating) || 5.0
      };
    });

    // Valid check
    if (!products.length) {
      throw new Error("Empty products array from sheet");
    }

    // 4. Save to Cache
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(products));
      sessionStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION_MS).toString());
    }

    return products;

  } catch (error) {
    console.error("Error fetching products from sheet, using fallback:", error);
    // Return dummy data if sheet fails (so app still looks good while setting up)
    return FALLBACK_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find(p => p.id === id);
}
