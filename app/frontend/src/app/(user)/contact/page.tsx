import type { Metadata } from "next";
import { settingService } from "@/services/setting.service";
import ContactContent from "./_ContactContent";

export const metadata: Metadata = {
  title: "Contact Us – Tourism Service",
};

export default async function ContactPage() {
  let info = { email: "", phone: "", address: "", websiteName: "Tourism Service" };
  try {
    const data = await settingService.getWebsiteInfo();
    info = { ...info, ...data.websiteInfo };
  } catch {}

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="inner-image">
          <img alt="Contact" src="/client/assets/images/banner-4.png" />
        </div>
        <div className="inner-content">
          <div className="container">
            <div className="inner-wrap">
              <h1 className="inner-title">Contact Us</h1>
              <nav className="inner-links">
                <a href="/">Home</a>
                <i className="fa-solid fa-angles-right"></i>
                <a href="/contact">Contact</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <ContactContent
        email={info.email}
        phone={info.phone}
        address={info.address}
      />
    </>
  );
}
