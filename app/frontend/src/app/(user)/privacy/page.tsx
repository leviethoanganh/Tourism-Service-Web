import type { Metadata } from "next";
import { settingService } from "@/services/setting.service";

export const metadata: Metadata = {
  title: "Privacy Policy – Tourism Service",
};

export default async function PrivacyPage() {
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
          <img alt="Privacy Policy" src="/client/assets/images/banner-5.png" />
        </div>
        <div className="inner-content">
          <div className="container">
            <div className="inner-wrap">
              <h1 className="inner-title">Privacy Policy</h1>
              <nav className="inner-links">
                <a href="/">Home</a>
                <i className="fa-solid fa-angles-right"></i>
                <a href="/privacy">Privacy Policy</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="static-page">
        <div className="container">
          <div className="static-page-inner">

            <h2>1. Information We Collect</h2>
            <p>
              When you use {info.websiteName}, we may collect the following types of information:
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Full name, phone number, and email address provided during booking.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on site, and search queries.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and operating system.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information collected to:</p>
            <ul>
              <li>Process and confirm tour bookings.</li>
              <li>Send booking confirmations and updates via email or phone.</li>
              <li>Improve our platform and personalize your experience.</li>
              <li>Respond to inquiries and provide customer support.</li>
              <li>Send promotional offers (only with your consent).</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties.
              We may share your information only in the following cases:
            </p>
            <ul>
              <li>With tour operators to fulfill your booking.</li>
              <li>With payment processors to complete transactions securely.</li>
              <li>When required by law or to protect our legal rights.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no internet transmission is completely secure, and we
              cannot guarantee absolute security.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small
              text files stored on your device. You can disable cookies through your browser
              settings, but this may affect some features of the website.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>

            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible
              for the privacy practices of these external sites. We encourage you to review
              their privacy policies before providing any personal information.
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to children under the age of 13. We do not
              knowingly collect personal information from children. If you believe we have
              collected information from a child, please contact us immediately.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes by posting the new policy on this page with an updated date.
              Your continued use of our services after changes constitutes acceptance of the
              updated policy.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul>
              {info.email && <li>Email: {info.email}</li>}
              {info.phone && <li>Phone: {info.phone}</li>}
              {info.address && <li>Address: {info.address}</li>}
            </ul>

            <p className="last-updated">Last updated: June 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}
