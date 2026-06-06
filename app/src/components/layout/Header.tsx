import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Category } from '../../types';

interface HeaderProps {
  categories: Category[];
  websiteName?: string;
}

export default function Header({ categories, websiteName }: HeaderProps) {
  const totalCount = useCartStore(s => s.totalCount());
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="inner-wrap">
          <button className="inner-button-menu">
            <img alt="" src="/client/assets/images/icon-menu.png" />
          </button>
          <Link className="inner-logo" to="/">
            <img alt={websiteName || 'Tourism'} src="/client/assets/images/logo.png" />
          </Link>
          <nav className="inner-menu">
            <ul>
              <li>
                <Link className="active" to="/">Home</Link>
              </li>
              {categories.map(item => (
                <li key={item._id}>
                  <Link to={`/category/${item.slug}`}>{item.name}</Link>
                  {item.children && item.children.length > 0 && (
                    <>
                      <i className="fa-solid fa-caret-down" />
                      <ul className="inner-sub">
                        {item.children.map(child => (
                          <li key={child._id}>
                            <Link to={`/category/${child.slug}`}>{child.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
              <li><Link to="/search">Search</Link></li>
            </ul>
            <div className="inner-overlay" />
          </nav>
          <Link className="inner-cart" to="/cart">
            <img alt="" src="/client/assets/images/icon-cart.png" />
            <span>
              <img alt="" src="/client/assets/images/icon-arrow-left.png" />
              <div>{totalCount}</div>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
