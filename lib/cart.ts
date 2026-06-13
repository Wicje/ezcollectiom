import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from './sheets';

export interface CartItem {
  cartId: string; // Unique ID for cart item (product.id + variant combo)
  product: Product;
  variant?: ProductVariant; // The selected variant
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, size?: string, color?: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getSubtotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, variant, size, color) => {
        set((state) => {
          // Create a unique cart ID based on product ID and selected options
          const cartId = `${product.id}-${size || 'nosize'}-${color || 'nocolor'}`;
          const existingItem = state.items.find(item => item.cartId === cartId);

          if (existingItem) {
            // Update quantity if already in cart
            return {
              items: state.items.map(item => 
                item.cartId === cartId 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }

          // Add new item
          return {
            items: [...state.items, {
              cartId,
              product,
              variant,
              quantity: 1,
              selectedSize: size,
              selectedColor: color
            }]
          };
        });
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter(item => item.cartId !== cartId)
        }));
      },

      updateQuantity: (cartId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter(item => item.cartId !== cartId) };
          }
          return {
            items: state.items.map(item => 
              item.cartId === cartId ? { ...item, quantity } : item
            )
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getCartItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.variant?.price || item.product.base_price;
          return total + (itemPrice * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'ecommerce-cart-storage', // Key in localStorage
    }
  )
);
