"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "vi" | "en";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: "vi",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set({ locale: get().locale === "vi" ? "en" : "vi" }),
    }),
    { name: "tourism-locale" }
  )
);
