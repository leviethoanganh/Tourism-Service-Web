import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="inner-wrap">
          <div className="inner-col">
            <Link className="inner-logo" to="/">
              <img alt="Tourism" src="/client/assets/images/logo.png" />
            </Link>
            <p className="inner-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
          </div>
          <div className="inner-col">
            <h3 className="inner-title">Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tours">Tours</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          <div className="inner-col">
            <h3 className="inner-title">Contact</h3>
            <ul>
              <li>Email: leviethoanganh0912200@gmail.com</li>
              <li>Phone: +84 xxx xxx xxx</li>
            </ul>
          </div>
        </div>
        <div className="inner-bottom">
          <p>&copy; {new Date().getFullYear()} Tourism Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
