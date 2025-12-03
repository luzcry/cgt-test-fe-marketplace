import { useEffect, useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  useCheckout,
  CHECKOUT_STEPS,
  STEP_ORDER,
  STEP_TITLES,
} from '../context/CheckoutContext';
import { useCart } from '../context/CartContext';
import { detectCardType } from '../services/checkoutService';
import ModelPreview from '../components/ModelPreview/ModelPreview';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import SectionHeader from '../components/SectionHeader';
import InfoGrid from '../components/InfoGrid';
import RadioOption from '../components/RadioOption';
import OrderSummary from '../components/OrderSummary';
import {
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LockIcon,
  TagIcon,
  CloseIcon,
  AlertIcon,
  EmailIcon,
  CalendarIcon,
  PrintIcon,
  CopyIcon,
  CreditCardIcon,
} from '../components/Icons';
import './CheckoutPage.scss';

const StepIndicator = memo(function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) {
  return (
    <nav className="checkout-steps" aria-label="Checkout progress">
      <ol className="checkout-steps__list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = currentStep === step;
          const isClickable = isCompleted || isCurrent;

          return (
            <li
              key={step}
              className={`checkout-steps__item ${isCurrent ? 'checkout-steps__item--current' : ''} ${isCompleted ? 'checkout-steps__item--completed' : ''}`}
            >
              <button
                type="button"
                className="checkout-steps__button"
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="checkout-steps__number">
                  {isCompleted ? <CheckIcon /> : index + 1}
                </span>
                <span className="checkout-steps__label">
                  {STEP_TITLES[step]}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`checkout-steps__connector ${isCompleted ? 'checkout-steps__connector--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

const ShippingStep = memo(function ShippingStep() {
  const {
    shippingInfo,
    updateShippingInfo,
    submitShippingInfo,
    isLoading,
    fieldErrors,
  } = useCheckout();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitShippingInfo();
  };

  return (
    <section
      className="checkout-step checkout-step--shipping"
      aria-labelledby="shipping-heading"
    >
      <SectionHeader
        id="shipping-heading"
        title="Shipping Information"
        description="Enter your contact and delivery information for your digital assets."
        className="checkout-step__header"
      />

      <form onSubmit={handleSubmit} className="checkout-form" noValidate>
        <div className="checkout-form__section">
          <h3 className="checkout-form__section-title">Contact Information</h3>
          <div className="checkout-form__row checkout-form__row--two">
            <FormInput
              id="firstName"
              label="First Name"
              value={shippingInfo.firstName}
              onChange={updateShippingInfo}
              error={fieldErrors.firstName}
              placeholder="John"
              required
              autoComplete="given-name"
            />
            <FormInput
              id="lastName"
              label="Last Name"
              value={shippingInfo.lastName}
              onChange={updateShippingInfo}
              error={fieldErrors.lastName}
              placeholder="Doe"
              required
              autoComplete="family-name"
            />
          </div>
          <div className="checkout-form__row checkout-form__row--two">
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={shippingInfo.email}
              onChange={updateShippingInfo}
              error={fieldErrors.email}
              placeholder="john.doe@example.com"
              required
              autoComplete="email"
            />
            <FormInput
              id="phone"
              label="Phone Number"
              type="tel"
              value={shippingInfo.phone}
              onChange={updateShippingInfo}
              error={fieldErrors.phone}
              placeholder="(555) 123-4567"
              required
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="checkout-form__section">
          <h3 className="checkout-form__section-title">Billing Address</h3>
          <FormInput
            id="street"
            label="Street Address"
            value={shippingInfo.street}
            onChange={updateShippingInfo}
            error={fieldErrors.street}
            placeholder="123 Main Street, Apt 4"
            required
            autoComplete="street-address"
          />
          <div className="checkout-form__row checkout-form__row--three">
            <FormInput
              id="city"
              label="City"
              value={shippingInfo.city}
              onChange={updateShippingInfo}
              error={fieldErrors.city}
              placeholder="New York"
              required
              autoComplete="address-level2"
            />
            <FormInput
              id="state"
              label="State"
              value={shippingInfo.state}
              onChange={updateShippingInfo}
              error={fieldErrors.state}
              placeholder="NY"
              required
              autoComplete="address-level1"
              maxLength={2}
            />
            <FormInput
              id="zipCode"
              label="ZIP Code"
              value={shippingInfo.zipCode}
              onChange={updateShippingInfo}
              error={fieldErrors.zipCode}
              placeholder="10001"
              required
              autoComplete="postal-code"
              inputMode="numeric"
            />
          </div>
          <FormInput
            id="country"
            label="Country"
            value={shippingInfo.country}
            onChange={updateShippingInfo}
            error={fieldErrors.country}
            required
            autoComplete="country-name"
            disabled
          />
        </div>

        <div className="checkout-step__actions">
          <Link to="/cart" className="checkout-step__back-link">
            <ArrowLeftIcon />
            Back to Cart
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="checkout-step__submit"
            isLoading={isLoading}
            icon={!isLoading && <ArrowRightIcon />}
            iconPosition="end"
          >
            {isLoading ? 'Validating...' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </section>
  );
});

const PaymentStep = memo(function PaymentStep() {
  const {
    paymentInfo,
    updatePaymentInfo,
    submitPaymentInfo,
    goToPreviousStep,
    isLoading,
    fieldErrors,
  } = useCheckout();

  const [cardType, setCardType] = useState('unknown');

  const formatCardNumber = useCallback((value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  }, []);

  const formatExpiryDate = useCallback((value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  }, []);

  const handleCardNumberChange = useCallback(
    (id, value) => {
      const formatted = formatCardNumber(value);
      updatePaymentInfo(id, formatted);
      setCardType(detectCardType(formatted));
    },
    [formatCardNumber, updatePaymentInfo]
  );

  const handleExpiryChange = useCallback(
    (id, value) => {
      const formatted = formatExpiryDate(value);
      updatePaymentInfo(id, formatted);
    },
    [formatExpiryDate, updatePaymentInfo]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPaymentInfo();
  };

  const cardIcons = {
    visa: (
      <svg
        viewBox="0 0 48 32"
        className="card-icon card-icon--visa"
        aria-label="Visa"
      >
        <rect fill="#1A1F71" width="48" height="32" rx="4" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          VISA
        </text>
      </svg>
    ),
    mastercard: (
      <svg
        viewBox="0 0 48 32"
        className="card-icon card-icon--mastercard"
        aria-label="Mastercard"
      >
        <rect fill="#000" width="48" height="32" rx="4" />
        <circle cx="18" cy="16" r="10" fill="#EB001B" />
        <circle cx="30" cy="16" r="10" fill="#F79E1B" />
      </svg>
    ),
    amex: (
      <svg
        viewBox="0 0 48 32"
        className="card-icon card-icon--amex"
        aria-label="American Express"
      >
        <rect fill="#006FCF" width="48" height="32" rx="4" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="bold"
        >
          AMEX
        </text>
      </svg>
    ),
    discover: (
      <svg
        viewBox="0 0 48 32"
        className="card-icon card-icon--discover"
        aria-label="Discover"
      >
        <rect fill="#FF6000" width="48" height="32" rx="4" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="bold"
        >
          DISCOVER
        </text>
      </svg>
    ),
  };

  return (
    <section
      className="checkout-step checkout-step--payment"
      aria-labelledby="payment-heading"
    >
      <SectionHeader
        id="payment-heading"
        title="Payment Details"
        description="Enter your card information. Your payment is secure and encrypted."
        className="checkout-step__header"
      />

      <form onSubmit={handleSubmit} className="checkout-form" noValidate>
        <div className="checkout-form__section">
          <div className="checkout-form__card-header">
            <h3 className="checkout-form__section-title">Card Information</h3>
            <div className="checkout-form__card-icons" aria-hidden="true">
              {cardIcons.visa}
              {cardIcons.mastercard}
              {cardIcons.amex}
              {cardIcons.discover}
            </div>
          </div>

          <div className="checkout-form__card-field">
            <FormInput
              id="cardNumber"
              label="Card Number"
              value={paymentInfo.cardNumber}
              onChange={handleCardNumberChange}
              error={fieldErrors.cardNumber}
              placeholder="1234 5678 9012 3456"
              required
              autoComplete="cc-number"
              inputMode="numeric"
              maxLength={19}
            />
            {cardType !== 'unknown' && (
              <div className="checkout-form__detected-card" aria-live="polite">
                {cardIcons[cardType]}
              </div>
            )}
          </div>

          <FormInput
            id="cardHolder"
            label="Cardholder Name"
            value={paymentInfo.cardHolder}
            onChange={updatePaymentInfo}
            error={fieldErrors.cardHolder}
            placeholder="JOHN DOE"
            required
            autoComplete="cc-name"
          />

          <div className="checkout-form__row checkout-form__row--two">
            <FormInput
              id="expiryDate"
              label="Expiry Date"
              value={paymentInfo.expiryDate}
              onChange={handleExpiryChange}
              error={fieldErrors.expiryDate}
              placeholder="MM/YY"
              required
              autoComplete="cc-exp"
              inputMode="numeric"
              maxLength={5}
            />
            <FormInput
              id="cvv"
              label="CVV"
              type="password"
              value={paymentInfo.cvv}
              onChange={updatePaymentInfo}
              error={fieldErrors.cvv}
              placeholder="***"
              required
              autoComplete="cc-csc"
              inputMode="numeric"
              maxLength={4}
            />
          </div>

          <label className="checkout-form__checkbox">
            <input
              type="checkbox"
              checked={paymentInfo.saveCard}
              onChange={(e) => updatePaymentInfo('saveCard', e.target.checked)}
            />
            <span className="checkout-form__checkbox-mark" />
            <span className="checkout-form__checkbox-label">
              Save card for future purchases
            </span>
          </label>
        </div>

        <div className="checkout-form__security">
          <LockIcon />
          <span>Your payment information is encrypted and secure</span>
        </div>

        <div className="checkout-step__actions">
          <Button
            variant="ghost"
            size="lg"
            className="checkout-step__back"
            onClick={goToPreviousStep}
            icon={<ArrowLeftIcon />}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="checkout-step__submit"
            isLoading={isLoading}
            icon={!isLoading && <ArrowRightIcon />}
            iconPosition="end"
          >
            {isLoading ? 'Validating...' : 'Review Order'}
          </Button>
        </div>
      </form>
    </section>
  );
});

const ReviewStep = memo(function ReviewStep() {
  const {
    shippingInfo,
    paymentInfo,
    cartItems,
    totals,
    shippingOption,
    setShippingOption,
    promoCode,
    applyPromoCode,
    removePromoCode,
    goToPreviousStep,
    goToStep,
    placeOrder,
    isLoading,
    errors,
  } = useCheckout();

  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const cardType = detectCardType(paymentInfo.cardNumber);
  const lastFour = paymentInfo.cardNumber.replace(/\s/g, '').slice(-4);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    await applyPromoCode(promoInput);
    setIsApplyingPromo(false);
    setPromoInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder();
  };

  return (
    <section
      className="checkout-step checkout-step--review"
      aria-labelledby="review-heading"
    >
      <SectionHeader
        id="review-heading"
        title="Review Your Order"
        description="Please review your order details before completing your purchase."
        className="checkout-step__header"
      />

      <form onSubmit={handleSubmit} className="checkout-review">
        <div className="checkout-review__section">
          <h3 className="checkout-review__section-title">
            Order Items
            <span className="checkout-review__count">
              {cartItems.length} items
            </span>
          </h3>
          <ul className="checkout-review__items">
            {cartItems.map((item) => (
              <li key={item.id} className="checkout-review__item">
                <div className="checkout-review__item-preview">
                  <ModelPreview
                    model={item.model}
                    previewColor={item.previewColor}
                    alt={item.name}
                    disableCacheWrite
                  />
                </div>
                <div className="checkout-review__item-details">
                  <p className="checkout-review__item-name">{item.name}</p>
                  <p className="checkout-review__item-meta">
                    {item.category} &bull; Qty: {item.quantity}
                  </p>
                </div>
                <p className="checkout-review__item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="checkout-review__section">
          <div className="checkout-review__section-header">
            <h3 className="checkout-review__section-title">
              Contact & Billing
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="checkout-review__edit"
              onClick={() => goToStep(CHECKOUT_STEPS.SHIPPING)}
            >
              Edit
            </Button>
          </div>
          <InfoGrid
            items={[
              { label: 'Name', value: `${shippingInfo.firstName} ${shippingInfo.lastName}` },
              { label: 'Email', value: shippingInfo.email },
              { label: 'Phone', value: shippingInfo.phone },
              { label: 'Address', value: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}` },
            ]}
            columns={2}
            className="checkout-review__info-grid"
          />
        </div>

        <div className="checkout-review__section">
          <div className="checkout-review__section-header">
            <h3 className="checkout-review__section-title">Payment Method</h3>
            <Button
              variant="ghost"
              size="sm"
              className="checkout-review__edit"
              onClick={() => goToStep(CHECKOUT_STEPS.PAYMENT)}
            >
              Edit
            </Button>
          </div>
          <div className="checkout-review__payment">
            <div className="checkout-review__card-icon">
              <CreditCardIcon />
            </div>
            <div className="checkout-review__card-info">
              <p className="checkout-review__card-type">
                {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
              </p>
              <p className="checkout-review__card-number">
                **** **** **** {lastFour}
              </p>
            </div>
          </div>
        </div>

        <div className="checkout-review__section">
          <h3 className="checkout-review__section-title">Delivery Option</h3>
          <div className="checkout-review__delivery-options">
            <RadioOption
              name="shippingOption"
              value="instant"
              label="Instant Download"
              description="Get immediate access to your files"
              price="FREE"
              checked={shippingOption === 'instant'}
              onChange={setShippingOption}
            />
            <RadioOption
              name="shippingOption"
              value="priority"
              label="Priority Processing"
              description="Priority queue for download links"
              price="$4.99"
              checked={shippingOption === 'priority'}
              onChange={setShippingOption}
            />
          </div>
        </div>

        <div className="checkout-review__section">
          <h3 className="checkout-review__section-title">Promo Code</h3>
          {promoCode ? (
            <div className="checkout-review__promo-applied">
              <div className="checkout-review__promo-badge">
                <TagIcon />
                <span>{promoCode}</span>
              </div>
              <span className="checkout-review__promo-discount">
                -${totals.discount.toFixed(2)}
              </span>
              <Button
                variant="icon"
                size="sm"
                className="checkout-review__promo-remove"
                onClick={removePromoCode}
                aria-label="Remove promo code"
              >
                <CloseIcon />
              </Button>
            </div>
          ) : (
            <div className="checkout-review__promo-input">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="checkout-review__promo-field"
              />
              <Button
                variant="secondary"
                size="md"
                className="checkout-review__promo-apply"
                onClick={handleApplyPromo}
                disabled={!promoInput.trim()}
                isLoading={isApplyingPromo}
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          )}
          {errors.promo && (
            <p className="checkout-review__promo-error" role="alert">
              {errors.promo}
            </p>
          )}
          <p className="checkout-review__promo-hint">
            Try: WELCOME10, SAVE20, 3DFREE, or NEWUSER
          </p>
        </div>

        <OrderSummary
          title="Order Summary"
          className="checkout-review__summary"
          items={[
            { label: 'Subtotal', value: `$${totals.subtotal.toFixed(2)}` },
            ...(totals.discount > 0
              ? [{ label: 'Discount', value: `-$${totals.discount.toFixed(2)}`, isDiscount: true }]
              : []),
            { label: 'Tax (10%)', value: `$${totals.tax.toFixed(2)}` },
            { label: 'Delivery', value: totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}` },
            { label: 'Total', value: `$${totals.total.toFixed(2)}`, isTotal: true },
          ]}
        />

        {(errors.payment || errors.order || errors.general) && (
          <div className="checkout-review__error" role="alert">
            <AlertIcon />
            <p>{errors.payment || errors.order || errors.general}</p>
          </div>
        )}

        <div className="checkout-step__actions">
          <Button
            variant="ghost"
            size="lg"
            className="checkout-step__back"
            onClick={goToPreviousStep}
            icon={<ArrowLeftIcon />}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="checkout-step__submit checkout-step__submit--primary"
            isLoading={isLoading}
            icon={!isLoading && <LockIcon />}
          >
            {isLoading
              ? 'Processing...'
              : `Complete Purchase - $${totals.total.toFixed(2)}`}
          </Button>
        </div>
      </form>
    </section>
  );
});

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

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentStep, completedSteps, goToStep } = useCheckout();

  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== CHECKOUT_STEPS.CONFIRMATION) {
      navigate('/cart');
    }
  }, [cartItems.length, currentStep, navigate]);

  useEffect(() => {
    return () => {
      if (currentStep !== CHECKOUT_STEPS.CONFIRMATION) {
      }
    };
  }, [currentStep]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CheckoutPage',
    name: '3D Marketplace Checkout',
    description:
      'Complete your purchase of premium 3D models and digital assets',
    provider: {
      '@type': 'Organization',
      name: '3D Marketplace',
    },
  };

  const renderStep = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.SHIPPING:
        return <ShippingStep />;
      case CHECKOUT_STEPS.PAYMENT:
        return <PaymentStep />;
      case CHECKOUT_STEPS.REVIEW:
        return <ReviewStep />;
      case CHECKOUT_STEPS.CONFIRMATION:
        return <ConfirmationStep />;
      default:
        return <ShippingStep />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | 3D Marketplace</title>
        <meta
          name="description"
          content="Complete your purchase of premium 3D models and digital assets. Secure checkout with multiple payment options."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${window.location.origin}/checkout`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="checkout-page">
        <header className="checkout-page__header">
          <Link
            to="/"
            className="checkout-page__logo"
            aria-label="Return to 3D Marketplace home"
          >
            <span className="checkout-page__logo-text">3D</span>
            <span className="checkout-page__logo-sub">MARKETPLACE</span>
          </Link>
          <h1 className="checkout-page__title">Checkout</h1>
          <div className="checkout-page__secure">
            <LockIcon />
            <span>Secure Checkout</span>
          </div>
        </header>

        {currentStep !== CHECKOUT_STEPS.CONFIRMATION && (
          <StepIndicator
            steps={STEP_ORDER.filter((s) => s !== CHECKOUT_STEPS.CONFIRMATION)}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        )}

        <main className="checkout-page__main">{renderStep()}</main>

        <footer className="checkout-page__footer">
          <p className="checkout-page__footer-text">
            &copy; {new Date().getFullYear()} 3D Marketplace. All rights
            reserved.
          </p>
          <nav className="checkout-page__footer-links">
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/support">Support</a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default CheckoutPage;
