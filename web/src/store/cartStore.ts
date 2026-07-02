import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  nameZh: string;
  nameEn: string;
  price: number;
  images: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                nameZh: product.nameZh,
                nameEn: product.nameEn,
                price: Number(product.price),
                images: product.images,
                quantity: quantity,
              },
            ],
          });
        }
      },
      
      removeItem: (id) => {
        const currentItems = get().items;
        set({ items: currentItems.filter(item => item.id !== id) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'atarax-cart-storage', // unique name
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
