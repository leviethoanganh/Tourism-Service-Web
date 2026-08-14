"use client";
import { useTranslation } from "@/hooks/useTranslation";

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        border: "1px solid #D5D5D5",
        borderRadius: 6,
        overflow: "hidden",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      <button
        type="button"
        onClick={() => setLocale("vi")}
        style={{
          padding: "6px 10px",
          border: "none",
          cursor: "pointer",
          background: locale === "vi" ? "#4880FF" : "transparent",
          color: locale === "vi" ? "#fff" : "#606060",
        }}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        style={{
          padding: "6px 10px",
          border: "none",
          cursor: "pointer",
          background: locale === "en" ? "#4880FF" : "transparent",
          color: locale === "en" ? "#fff" : "#606060",
        }}
      >
        EN
      </button>
    </div>
  );
}
