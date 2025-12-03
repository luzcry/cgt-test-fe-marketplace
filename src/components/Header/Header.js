import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.scss';

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header" role="banner">
      <nav className="header__nav" aria-label="Main navigation">
        {/* Logo / Brand */}
        <div className="header__brand">
          <Link
            to="/"
            className="header__logo"
            aria-label="NEXUS3D - Go to homepage"
          >
            <span className="header__logo-icon" aria-hidden="true">
              {/* CPU/Chip Icon - represents 3D/tech */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
              </svg>
            </span>
            <span className="header__brand-text">
              <span className="header__brand-primary">NEXUS</span>
              <span className="header__brand-secondary">3D</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <Link to="/" className="header__nav-link">
              Browse
            </Link>
          </li>
          <li className="header__nav-item">
            <Link
              to="/cart"
              className="header__cart-btn"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              {/* Shopping Cart Icon */}
              <svg
                className="header__cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="header__cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="header__cart-badge" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
