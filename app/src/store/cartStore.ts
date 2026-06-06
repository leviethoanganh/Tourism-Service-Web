import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (tourId: string) => void;
  updateItem: (tourId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(i => i.tourId === item.tourId);
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.tourId === item.tourId
                ? {
                    ...i,
                    quantityAdult: i.quantityAdult + item.quantityAdult,
                    quantityChildren: i.quantityChildren + item.quantityChildren,
                    quantityBaby: i.quantityBaby + item.quantityBaby,
                  }
                : i
            ),
          }));
        } else {
          set(state => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (tourId) =>
        set(state => ({ items: state.items.filter(i => i.tourId !== tourId) })),

      updateItem: (tourId, updates) =>
        set(state => ({
          items: state.items.map(i => (i.tourId === tourId ? { ...i, ...updates } : i)),
        })),

      clearCart: () => set({ items: [] }),

      totalCount: () => get().items.length,
    }),
    { name: 'tourism-cart' }
  )
);
