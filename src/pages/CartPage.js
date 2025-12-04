import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import {
  EmptyCartIcon,
  TrashIcon,
  ArrowLongRightIcon,
  MinusIcon,
  PlusIcon,
} from '../components/Icons';
import './CartPage.scss';

const ModelPreview = lazy(() => import('../components/ModelPreview'));

function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const CartSEO = () => (
    <Helmet>
      <title>Shopping Cart | 3D Marketplace</title>
      <meta
        name="description"
        content={
          cartItems.length > 0
            ? `Your cart contains ${cartCount} item${cartCount !== 1 ? 's' : ''} totaling $${cartTotal.toFixed(2)}. Review and checkout your premium 3D models.`
            : 'Your shopping cart is empty. Browse our collection of premium 3D models and digital assets.'
        }
      />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`${window.location.origin}/cart`} />
    </Helmet>
  );

  if (cartItems.length === 0) {
    return (
      <>
        <CartSEO />
        <div className="cart-page cart-page--empty">
          <EmptyState
            icon={<EmptyCartIcon data-testid="empty-cart-icon" />}
            title="Your Cart is Empty"
            description="Start adding some amazing products!"
            actionLabel="Browse Products"
            onAction={() => navigate('/')}
          />
        </div>
      </>
    );
  }

  const subtotal = cartTotal;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <>
      <CartSEO />
      <main className="cart-page">
        <h1 className="cart-page__title">Shopping Cart</h1>

        <div className="cart-page__content">
          <section className="cart-page__items" aria-label="Cart items">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <Link
                  to={`/products/${item.id}`}
                  className="cart-item__preview"
                  aria-label={`View ${item.name}`}
                >
                  <Suspense
                    fallback={
                      <div
                        className="cart-item__preview-fallback"
                        style={{ background: item.previewColor }}
                      >
                        <div
                          className="cart-item__preview-pattern"
                          aria-hidden="true"
                        />
                        <span
                          className="cart-item__preview-text"
                          aria-hidden="true"
                        >
                          3D
                        </span>
                      </div>
                    }
                  >
                    <ModelPreview
                      model={item.model}
                      previewColor={item.previewColor}
                      alt={`${item.name} 3D preview`}
                    />
                  </Suspense>
                </Link>

                <div className="cart-item__info">
                  <Link to={`/products/${item.id}`} className="cart-item__name">
                    {item.name}
                  </Link>
                  {item.category && (
                    <p className="cart-item__category">{item.category}</p>
                  )}

                  <div className="cart-item__controls">
                    <div className="cart-item__quantity">
                      <Button
                        variant="icon"
                        size="sm"
                        className="cart-item__quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <MinusIcon />
                      </Button>
                      <span
                        className="cart-item__quantity-value"
                        aria-label={`Quantity: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>
                      <Button
                        variant="icon"
                        size="sm"
                        className="cart-item__quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <PlusIcon />
                      </Button>
                    </div>

                    <div className="cart-item__price">
                      <p className="cart-item__price-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="cart-item__price-each">
                          ${item.price} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="icon"
                  size="md"
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <TrashIcon className="cart-item__remove-icon" />
                </Button>
              </article>
            ))}
          </section>

          <aside className="cart-page__summary" aria-label="Order summary">
            <div className="cart-page__summary-card">
              <OrderSummary
                title="Order Summary"
                items={[
                  { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                  { label: 'Tax (estimated)', value: `$${tax.toFixed(2)}` },
                  {
                    label: 'Total',
                    value: `$${total.toFixed(2)}`,
                    isTotal: true,
                  },
                ]}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="cart-page__checkout-btn"
                  aria-label="Proceed to checkout"
                  onClick={() => navigate('/checkout')}
                  icon={
                    <ArrowLongRightIcon className="cart-page__checkout-icon" />
                  }
                  iconPosition="end"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="cart-page__continue-btn"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="cart-page__clear-btn"
                  onClick={clearCart}
                  aria-label="Clear all items from cart"
                >
                  Clear Cart
                </Button>
              </OrderSummary>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default CartPage;
