"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (tourId: string) => void;
  updateItem: (tourId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.tourId === item.tourId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.tourId === item.tourId ? { ...i, ...item } : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (tourId) =>
        set({ items: get().items.filter((i) => i.tourId !== tourId) }),

      updateItem: (tourId, updates) =>
        set({
          items: get().items.map((i) =>
            i.tourId === tourId ? { ...i, ...updates } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.length,
    }),
    { name: "tourism-cart" }
  )
);
