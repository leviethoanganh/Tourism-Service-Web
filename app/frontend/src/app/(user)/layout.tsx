import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientInit from "@/components/ClientInit";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
      />
      <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
      <link rel="stylesheet" href="/client/assets/css/style.css" />
      <Header />
      {children}
      <Footer />
      <ClientInit />
    </>
  );
}
