export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="inner-top">
            <div className="inner-title">Subscribe now to stay up to date with our latest programs</div>
            <form id="email-form" className="inner-form">
              <input
                id="email-input"
                placeholder="Enter your email..."
                type="email"
                name="email"
              />
              <button type="submit">Subscribe Now</button>
            </form>
          </div>

          <div className="inner-middle">
            <nav className="inner-links">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="#">Domestic Tours</a></li>
                <li><a href="#">International Tours</a></li>
                <li><a href="#">News</a></li>
                <li><a href="/contact">Contact</a></li>
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
            <div className="inner-copyright">© 2024 28Tech. All rights reserved.</div>
            <a className="inner-logo" href="#">
              <img alt="" src="/client/assets/images/logo.png" />
            </a>
            <nav className="inner-links">
              <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
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
