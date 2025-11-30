import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header__brand">
        <Link to="/" className="header__logo">
          90s Shop
        </Link>
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li>
            <Link to="/" className="header__nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/cart" className="header__nav-link header__cart-link">
              Cart ({cartCount})
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
