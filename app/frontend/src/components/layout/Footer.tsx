"use client";
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="inner-top">
            <div className="inner-title">{t.footer.subscribeTitle}</div>
            <form id="email-form" className="inner-form">
              <input
                id="email-input"
                placeholder={t.footer.emailPlaceholder}
                type="email"
                name="email"
              />
              <button type="submit">{t.footer.subscribeButton}</button>
            </form>
          </div>

          <div className="inner-middle">
            <nav className="inner-links">
              <ul>
                <li><a href="/">{t.footer.home}</a></li>
                <li><a href="#">{t.footer.domesticTours}</a></li>
                <li><a href="#">{t.footer.internationalTours}</a></li>
                <li><a href="#">{t.footer.news}</a></li>
                <li><a href="/contact">{t.footer.contact}</a></li>
              </ul>
            </nav>
            <nav className="inner-socials">
              <ul>
                <li>
                  <a target="_blank" href="#"><i className="fa-brands fa-facebook"></i></a>
                </li>
                <li>
                  <a target="_blank" href="#"><i className="fa-brands fa-tiktok"></i></a>
                </li>
                <li>
                  <a target="_blank" href="#"><i className="fa-brands fa-instagram"></i></a>
                </li>
                <li>
                  <a target="_blank" href="#"><i className="fa-brands fa-youtube"></i></a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="inner-bottom">
            <div className="inner-copyright">{t.footer.copyright}</div>
            <a className="inner-logo" href="#">
              <img alt="" src="/client/assets/images/logo.png" />
            </a>
            <nav className="inner-links">
              <ul>
                <li><a href="/terms">{t.footer.termsOfService}</a></li>
                <li><a href="/privacy">{t.footer.privacyPolicy}</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
      {/* End Footer */}

      {/* Box Contact */}
      <nav className="box-contact">
        <ul>
          <li>
            <a target="_blank" href="#"><i className="fa-brands fa-facebook-f"></i></a>
          </li>
          <li>
            <a target="_blank" href="#"><i className="fa-brands fa-instagram"></i></a>
          </li>
          <li>
            <a target="_blank" href="#"><i className="fa-brands fa-whatsapp"></i></a>
          </li>
          <li>
            <a target="_blank" href="#"><i className="fa-brands fa-youtube"></i></a>
          </li>
        </ul>
      </nav>
      {/* End Box Contact */}
    </>
  );
}
