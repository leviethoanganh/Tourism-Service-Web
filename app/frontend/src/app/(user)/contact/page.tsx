import type { Metadata } from "next";
import { settingService } from "@/services/setting.service";
import ContactContent from "./_ContactContent";
import T from "@/components/shared/T";

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
              <h1 className="inner-title"><T ns="contact" k="title" /></h1>
              <nav className="inner-links">
                <a href="/"><T ns="header" k="home" /></a>
                <i className="fa-solid fa-angles-right"></i>
                <a href="/contact"><T ns="header" k="contact" /></a>
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
