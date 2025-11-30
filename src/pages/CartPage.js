import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="cart-page__continue-link">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Cart</h1>
      <div className="cart-page__content">
        <div className="cart-page__items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item__image"
              />
              <div className="cart-item__details">
                <Link
                  to={`/products/${item.id}`}
                  className="cart-item__name"
                >
                  {item.name}
                </Link>
                <p className="cart-item__price">
                  {item.price} {item.currency}
                </p>
              </div>
              <div className="cart-item__quantity">
                <button
                  className="cart-item__quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span className="cart-item__quantity-value">
                  {item.quantity}
                </span>
                <button
                  className="cart-item__quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <div className="cart-item__subtotal">
                {item.price * item.quantity} {item.currency}
              </div>
              <button
                className="cart-item__remove"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="cart-page__summary">
          <div className="cart-page__total">
            <span>Total:</span>
            <span className="cart-page__total-amount">{cartTotal} USD</span>
          </div>
          <button className="cart-page__checkout-btn">
            Proceed to Checkout
          </button>
          <button className="cart-page__clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
      <Link to="/" className="cart-page__continue-link">
        ← Continue Shopping
      </Link>
    </div>
  );
}

export default CartPage;
