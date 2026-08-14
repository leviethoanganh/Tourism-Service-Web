import type { Metadata } from "next";
import { settingService } from "@/services/setting.service";
import T from "@/components/shared/T";
import LegalPageContent from "@/components/shared/LegalPageContent";

export const metadata: Metadata = {
  title: "Terms of Service – Tourism Service",
};

export default async function TermsPage() {
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
          <img alt="Terms of Service" src="/client/assets/images/banner-4.png" />
        </div>
        <div className="inner-content">
          <div className="container">
            <div className="inner-wrap">
              <h1 className="inner-title"><T ns="terms" k="pageTitle" /></h1>
              <nav className="inner-links">
                <a href="/"><T ns="header" k="home" /></a>
                <i className="fa-solid fa-angles-right"></i>
                <a href="/terms"><T ns="terms" k="pageTitle" /></a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="static-page">
        <div className="container">
          <div className="static-page-inner">
            <LegalPageContent
              ns="terms"
              websiteName={info.websiteName}
              email={info.email}
              phone={info.phone}
              address={info.address}
            />
          </div>
        </div>
      </div>
    </>
  );
}
