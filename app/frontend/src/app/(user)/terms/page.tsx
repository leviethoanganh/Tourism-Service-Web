import type { Metadata } from "next";
import { settingService } from "@/services/setting.service";

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
              <h1 className="inner-title">Terms of Service</h1>
              <nav className="inner-links">
                <a href="/">Home</a>
                <i className="fa-solid fa-angles-right"></i>
                <a href="/terms">Terms of Service</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="static-page">
        <div className="container">
          <div className="static-page-inner">

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using {info.websiteName}, you accept and agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Services</h2>
            <p>
              {info.websiteName} provides an online platform for browsing, booking, and managing
              tour packages. We act as an intermediary between travelers and tour operators.
              All tour details, pricing, and availability are subject to change without prior notice.
            </p>

            <h2>3. Bookings and Payments</h2>
            <p>
              All bookings are subject to availability and confirmation. Payment must be made
              in accordance with the payment method selected at checkout. Prices are displayed
              in Vietnamese Dong (VND) and include applicable taxes.
            </p>
            <ul>
              <li>Bookings are confirmed only after successful payment or manual confirmation.</li>
              <li>Bank transfer payments must be completed within 24 hours of booking.</li>
              <li>{info.websiteName} reserves the right to cancel unconfirmed bookings.</li>
            </ul>

            <h2>4. Cancellation and Refund Policy</h2>
            <p>
              Cancellation requests must be submitted at least 7 days before the tour departure date
              for a full refund. Cancellations made within 7 days of departure are non-refundable.
              For tours cancelled by the operator, a full refund will be provided.
            </p>

            <h2>5. User Responsibilities</h2>
            <p>
              You agree to provide accurate information when making a booking. You are responsible
              for ensuring that all travelers meet any visa, health, or entry requirements for
              your destination. {info.websiteName} is not liable for any losses arising from
              incomplete or incorrect information provided by the user.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              {info.websiteName} shall not be liable for any indirect, incidental, or consequential
              damages arising from the use of our platform or services. Our maximum liability
              is limited to the total amount paid for the booking in question.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design, is the
              property of {info.websiteName} and is protected by copyright law. Unauthorized use
              or reproduction is strictly prohibited.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will
              be effective immediately upon posting. Continued use of our services constitutes
              acceptance of the updated terms.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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
