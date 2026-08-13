"use client";
import Script from "next/script";

export default function ClientInit() {
  return (
    <Script
      src="https://unpkg.com/aos@2.3.1/dist/aos.js"
      strategy="afterInteractive"
      onLoad={() => {
        (window as any).AOS?.init({
          once: true,
          duration: 800,
          offset: 50,
        });
      }}
    />
  );
}
