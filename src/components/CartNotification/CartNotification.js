import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useExperiment, EXPERIMENTS } from '../../context/ABTestContext';
import './CartNotification.scss';

function CartNotification() {
  const navigate = useNavigate();
  const { notification, hideNotification, cartTotal, cartCount } = useCart();
  const { show, product } = notification;

  const { variant, trackConversion } = useExperiment(
    EXPERIMENTS.CART_NOTIFICATION_STYLE.id
  );

  const autoHideDelay = variant === 'minimal' ? 3000 : 5000;

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        hideNotification();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [show, hideNotification, autoHideDelay]);

  const handleViewCart = () => {
    trackConversion('view_cart_click');
    hideNotification();
    navigate('/cart');
  };

  const handleCheckout = () => {
    trackConversion('checkout_click');
    hideNotification();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    trackConversion('continue_shopping_click');
    hideNotification();
  };

  if (!show || !product) return null;

  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return <MinimalVariant product={product} onViewCart={handleViewCart} />;
      case 'prominent':
        return (
          <ProminentVariant
            product={product}
            cartTotal={cartTotal}
            itemCount={cartCount}
            onCheckout={handleCheckout}
            onViewCart={handleViewCart}
            onClose={handleContinueShopping}
          />
        );
      default:
        return (
          <ControlVariant
            product={product}
            onViewCart={handleViewCart}
            onContinueShopping={handleContinueShopping}
          />
        );
    }
  };

  return (
    <div
      className={`cart-notification cart-notification--${variant}`}
      role="alert"
      aria-live="polite"
      data-testid="cart-notification"
      data-variant={variant}
    >
      {renderVariant()}
    </div>
  );
}

function ControlVariant({ product, onViewCart, onContinueShopping }) {
  return (
    <>
      <div className="cart-notification__content">
        <div className="cart-notification__icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
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
          onClick={onContinueShopping}
          aria-label="Close notification"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="cart-notification__actions">
        <button
          type="button"
          className="cart-notification__btn cart-notification__btn--secondary"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
        <button
          type="button"
          className="cart-notification__btn cart-notification__btn--primary"
          onClick={onViewCart}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          View Cart
        </button>
      </div>
    </>
  );
}

function MinimalVariant({ product, onViewCart }) {
  return (
    <div className="cart-notification__minimal">
      <div className="cart-notification__icon cart-notification__icon--small">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="cart-notification__text">
        <strong>{product.name}</strong> added
      </span>
      <button
        type="button"
        className="cart-notification__btn cart-notification__btn--compact"
        onClick={onViewCart}
      >
        View Cart
      </button>
    </div>
  );
}

function ProminentVariant({
  product,
  cartTotal,
  itemCount,
  onCheckout,
  onViewCart,
  onClose,
}) {
  return (
    <>
      <div className="cart-notification__header">
        <div className="cart-notification__icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="cart-notification__info">
          <p className="cart-notification__title">Added to cart!</p>
          <p className="cart-notification__product">{product.name}</p>
        </div>
        <button
          type="button"
          className="cart-notification__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="cart-notification__summary">
        <div className="cart-notification__summary-row">
          <span>
            Cart Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="cart-notification__total">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="cart-notification__actions cart-notification__actions--stacked">
        <button
          type="button"
          className="cart-notification__btn cart-notification__btn--primary cart-notification__btn--large"
          onClick={onCheckout}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Checkout Now
        </button>
        <button
          type="button"
          className="cart-notification__btn cart-notification__btn--ghost"
          onClick={onViewCart}
        >
          View Cart
        </button>
      </div>
    </>
  );
}

export default CartNotification;
