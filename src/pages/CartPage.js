import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
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
          <svg
            className="cart-page__empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            data-testid="empty-cart-icon"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h1 className="cart-page__empty-title">Your Cart is Empty</h1>
          <p className="cart-page__empty-text">
            Start adding some amazing products!
          </p>
          <button
            type="button"
            className="cart-page__empty-btn"
            onClick={() => navigate('/')}
          >
            Browse Products
          </button>
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
                      <button
                        type="button"
                        className="cart-item__quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span
                        className="cart-item__quantity-value"
                        aria-label={`Quantity: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="cart-item__quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
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

                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg
                    className="cart-item__remove-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </article>
            ))}
          </section>

          <aside className="cart-page__summary" aria-label="Order summary">
            <div className="cart-page__summary-card">
              <h2 className="cart-page__summary-title">Order Summary</h2>

              <div className="cart-page__summary-lines">
                <div className="cart-page__summary-line">
                  <span className="cart-page__summary-label">Subtotal</span>
                  <span className="cart-page__summary-value">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="cart-page__summary-line">
                  <span className="cart-page__summary-label">
                    Tax (estimated)
                  </span>
                  <span className="cart-page__summary-value">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="cart-page__summary-line cart-page__summary-line--total">
                  <span className="cart-page__summary-label cart-page__summary-label--total">
                    Total
                  </span>
                  <span className="cart-page__summary-value cart-page__summary-value--total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="cart-page__checkout-btn"
                aria-label="Proceed to checkout"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <svg
                  className="cart-page__checkout-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                className="cart-page__continue-btn"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>

              <button
                type="button"
                className="cart-page__clear-btn"
                onClick={clearCart}
                aria-label="Clear all items from cart"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default CartPage;
