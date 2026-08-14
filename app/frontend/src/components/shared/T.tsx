"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { Translations } from "@/i18n/types";

type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

interface Props<NS extends keyof Translations> {
  ns: NS;
  k: StringKeys<Translations[NS]>;
}

/** Inline translated text for use inside server components that can't call useTranslation() directly. */
export default function T<NS extends keyof Translations>({ ns, k }: Props<NS>) {
  const { t } = useTranslation();
  const value = (t[ns] as Record<string, string>)[k as string];
  return <>{value}</>;
}
