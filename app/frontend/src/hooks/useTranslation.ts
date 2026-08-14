"use client";
import { useLocaleStore } from "@/store/locale.store";
import { vi } from "@/i18n/vi";
import { en } from "@/i18n/en";

const dictionaries = { vi, en };

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return { t: dictionaries[locale], locale, toggleLocale, setLocale };
}
