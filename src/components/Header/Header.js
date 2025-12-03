import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { LogoIcon, CartIcon } from '../Icons';
import './Header.scss';

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header" role="banner">
      <nav className="header__nav" aria-label="Main navigation">
        <div className="header__brand">
          <Link
            to="/"
            className="header__logo"
            aria-label="NEXUS3D - Go to homepage"
          >
            <span className="header__logo-icon" aria-hidden="true">
              <LogoIcon />
            </span>
            <span className="header__brand-text">
              <span className="header__brand-primary">NEXUS</span>
              <span className="header__brand-secondary">3D</span>
            </span>
          </Link>
        </div>

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
              <CartIcon className="header__cart-icon" />
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
