import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartNotification.scss';

function CartNotification() {
  const navigate = useNavigate();
  const { notification, hideNotification } = useCart();
  const { show, product } = notification;

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, hideNotification]);

  const handleViewCart = () => {
    hideNotification();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    hideNotification();
  };

  if (!show || !product) return null;

  return (
    <div className="cart-notification" role="alert" aria-live="polite">
      <div className="cart-notification__content">
        <div className="cart-notification__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="cart-notification__info">
          <p className="cart-notification__title">Added to cart</p>
          <p className="cart-notification__product">{product.name}</p>
        </div>
        <button
          type="button"
          className="cart-notification__close"
          onClick={handleContinueShopping}
          aria-label="Close notification"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="cart-notification__actions">
        <button
          type="button"
          className="cart-notification__btn cart-notification__btn--secondary"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </button>
        <button
          type="button"
          className="cart-notification__btn cart-notification__btn--primary"
          onClick={handleViewCart}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          View Cart
        </button>
      </div>
    </div>
  );
}

export default CartNotification;
