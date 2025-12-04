import { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../../context/CheckoutContext';
import Button from '../../../components/Button';
import {
  CheckIcon,
  ArrowRightIcon,
  EmailIcon,
  CalendarIcon,
  PrintIcon,
  CopyIcon,
} from '../../../components/Icons';

const ConfirmationStep = memo(function ConfirmationStep() {
  const { orderResult, resetCheckout } = useCheckout();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContinueShopping = () => {
    resetCheckout();
    navigate('/');
  };

  const handleCopyOrderId = async () => {
    if (orderResult?.orderId) {
      try {
        await navigator.clipboard.writeText(orderResult.orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (!orderResult) {
    return (
      <div className="checkout-step checkout-step--error">
        <p>Order information not available.</p>
        <button onClick={handleContinueShopping}>Return to Shop</button>
      </div>
    );
  }

  const estimatedDate = new Date(orderResult.estimatedDelivery);
  const formattedDate = estimatedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section
      className="checkout-step checkout-step--confirmation"
      aria-labelledby="confirmation-heading"
    >
      <div className="checkout-celebration" aria-hidden="true">
        <div className="checkout-celebration__particles">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="checkout-celebration__particle"
              style={{ '--i': i }}
            />
          ))}
        </div>
      </div>

      <div className="checkout-confirmation">
        <div className="checkout-confirmation__success">
          <div className="checkout-confirmation__icon-wrapper">
            <div
              className="checkout-confirmation__icon-glow"
              aria-hidden="true"
            />
            <div className="checkout-confirmation__icon">
              <svg
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="checkout-confirmation__icon-circle"
                  cx="26"
                  cy="26"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  className="checkout-confirmation__icon-check"
                  d="M15 26L23 34L37 18"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
          <h2
            id="confirmation-heading"
            className="checkout-confirmation__title"
          >
            Order Confirmed!
          </h2>
          <p className="checkout-confirmation__subtitle">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        <div className="checkout-confirmation__order-id">
          <span className="checkout-confirmation__order-label">Order ID</span>
          <div className="checkout-confirmation__order-row">
            <span className="checkout-confirmation__order-number">
              {orderResult.orderId}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`checkout-confirmation__copy-btn ${copied ? 'checkout-confirmation__copy-btn--copied' : ''}`}
              onClick={handleCopyOrderId}
              aria-label={copied ? 'Copied!' : 'Copy order ID'}
              icon={copied ? <CheckIcon /> : <CopyIcon />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="checkout-confirmation__details">
          <div className="checkout-confirmation__detail-section">
            <h3 className="checkout-confirmation__detail-title">
              Order Summary
            </h3>
            <ul className="checkout-confirmation__items">
              {orderResult.items.map((item) => (
                <li key={item.id} className="checkout-confirmation__item">
                  <span className="checkout-confirmation__item-name">
                    {item.name}
                  </span>
                  <span className="checkout-confirmation__item-qty">
                    x{item.quantity}
                  </span>
                  <span className="checkout-confirmation__item-price">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="checkout-confirmation__totals">
              <div className="checkout-confirmation__total-line">
                <span>Subtotal</span>
                <span>${orderResult.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-confirmation__total-line">
                <span>Tax</span>
                <span>${orderResult.totals.tax.toFixed(2)}</span>
              </div>
              <div className="checkout-confirmation__total-line">
                <span>Shipping</span>
                <span>
                  {orderResult.totals.shipping === 0
                    ? 'FREE'
                    : `$${orderResult.totals.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="checkout-confirmation__total-line checkout-confirmation__total-line--total">
                <span>Total Paid</span>
                <span>${orderResult.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="checkout-confirmation__detail-section">
            <h3 className="checkout-confirmation__detail-title">
              Delivery Information
            </h3>
            <div className="checkout-confirmation__delivery">
              <p className="checkout-confirmation__delivery-email">
                <EmailIcon />
                Download links will be sent to:{' '}
                <strong>{orderResult.shippingAddress.email}</strong>
              </p>
              <p className="checkout-confirmation__delivery-date">
                <CalendarIcon />
                Estimated delivery by: <strong>{formattedDate}</strong>
              </p>
            </div>
          </div>

          <div className="checkout-confirmation__detail-section">
            <h3 className="checkout-confirmation__detail-title">
              Order Timeline
            </h3>
            <ol className="checkout-confirmation__timeline">
              {orderResult.timeline.map((step, index) => (
                <li
                  key={index}
                  className={`checkout-confirmation__timeline-step ${step.completed ? 'checkout-confirmation__timeline-step--completed' : ''}`}
                >
                  <div className="checkout-confirmation__timeline-marker">
                    {step.completed ? <CheckIcon /> : <span>{index + 1}</span>}
                  </div>
                  <div className="checkout-confirmation__timeline-content">
                    <p className="checkout-confirmation__timeline-title">
                      {step.status}
                    </p>
                    <p className="checkout-confirmation__timeline-desc">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="checkout-confirmation__actions">
          <Button
            variant="primary"
            size="lg"
            className="checkout-confirmation__btn checkout-confirmation__btn--primary"
            onClick={handleContinueShopping}
            icon={<ArrowRightIcon />}
            iconPosition="end"
          >
            Continue Shopping
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="checkout-confirmation__btn checkout-confirmation__btn--secondary"
            onClick={() => window.print()}
            icon={<PrintIcon />}
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </section>
  );
});

export default ConfirmationStep;
