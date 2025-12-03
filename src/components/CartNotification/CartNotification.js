import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useExperiment, EXPERIMENTS } from '../../context/ABTestContext';
import { CheckIcon, CloseIcon, CartIcon } from '../Icons';
import Button from '../Button';
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
          <CheckIcon />
        </div>
        <div className="cart-notification__info">
          <p className="cart-notification__title">Added to cart</p>
          <p className="cart-notification__product">{product.name}</p>
        </div>
        <Button
          variant="icon"
          size="sm"
          className="cart-notification__close"
          onClick={onContinueShopping}
          aria-label="Close notification"
        >
          <CloseIcon />
        </Button>
      </div>
      <div className="cart-notification__actions">
        <Button
          variant="secondary"
          size="sm"
          className="cart-notification__btn cart-notification__btn--secondary"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="cart-notification__btn cart-notification__btn--primary"
          onClick={onViewCart}
          icon={<CartIcon />}
        >
          View Cart
        </Button>
      </div>
    </>
  );
}

function MinimalVariant({ product, onViewCart }) {
  return (
    <div className="cart-notification__minimal">
      <div className="cart-notification__icon cart-notification__icon--small">
        <CheckIcon />
      </div>
      <span className="cart-notification__text">
        <strong>{product.name}</strong> added
      </span>
      <Button
        variant="primary"
        size="sm"
        className="cart-notification__btn cart-notification__btn--compact"
        onClick={onViewCart}
      >
        View Cart
      </Button>
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
          <CheckIcon />
        </div>
        <div className="cart-notification__info">
          <p className="cart-notification__title">Added to cart!</p>
          <p className="cart-notification__product">{product.name}</p>
        </div>
        <Button
          variant="icon"
          size="sm"
          className="cart-notification__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <CloseIcon />
        </Button>
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
        <Button
          variant="primary"
          size="lg"
          className="cart-notification__btn cart-notification__btn--primary cart-notification__btn--large"
          onClick={onCheckout}
          icon={<CheckIcon />}
        >
          Checkout Now
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="cart-notification__btn cart-notification__btn--ghost"
          onClick={onViewCart}
        >
          View Cart
        </Button>
      </div>
    </>
  );
}

export default CartNotification;
