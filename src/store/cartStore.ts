import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartId: string;
  productId: string;
  variationId: string;
  sku: string;
  name: string;
  variationType: Record<string, string>;
  price: number;
  qty: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartId'>) => void;
  updateQty: (cartId: string, qty: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          // Check if same variation exists
          const existingItemIndex = state.items.findIndex(
            i => i.productId === item.productId && i.variationId === item.variationId
          );
          
          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].qty += item.qty;
            return { items: newItems };
          }
          
          return { items: [...state.items, { ...item, cartId: Date.now().toString() }] };
        });
      },
      
      updateQty: (cartId, qty) => {
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter(i => i.cartId !== cartId) };
          }
          return {
            items: state.items.map(i => i.cartId === cartId ? { ...i, qty } : i)
          };
        });
      },
      
      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter(i => i.cartId !== cartId)
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0);
      },
      
      getCartItemsCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      }
    }),
    {
      name: 'jainco-cart-storage'
    }
  )
);
