import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tourism Service",
  description: "Book your dream tour",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
