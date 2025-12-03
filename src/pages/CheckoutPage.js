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
import './CheckoutPage.scss';

// =============================================================================
// Step Indicator Component
// =============================================================================
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
                  {isCompleted ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
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

// =============================================================================
// Form Input Component
// =============================================================================
const FormInput = memo(function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  maxLength,
  pattern,
  inputMode,
  disabled = false,
}) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
        inputMode={inputMode}
        disabled={disabled}
        className="form-field__input"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

// =============================================================================
// Shipping Step Component
// =============================================================================
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
      <header className="checkout-step__header">
        <h2 id="shipping-heading" className="checkout-step__title">
          Shipping Information
        </h2>
        <p className="checkout-step__description">
          Enter your contact and delivery information for your digital assets.
        </p>
      </header>

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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Cart
          </Link>
          <button
            type="submit"
            className="checkout-step__submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="checkout-step__spinner" aria-hidden="true" />
                Validating...
              </>
            ) : (
              <>
                Continue to Payment
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
});

// =============================================================================
// Payment Step Component
// =============================================================================
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

  // Format card number with spaces
  const formatCardNumber = useCallback((value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  }, []);

  // Format expiry date
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
      <header className="checkout-step__header">
        <h2 id="payment-heading" className="checkout-step__title">
          Payment Details
        </h2>
        <p className="checkout-step__description">
          Enter your card information. Your payment is secure and encrypted.
        </p>
      </header>

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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Your payment information is encrypted and secure</span>
        </div>

        <div className="checkout-step__actions">
          <button
            type="button"
            className="checkout-step__back"
            onClick={goToPreviousStep}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button
            type="submit"
            className="checkout-step__submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="checkout-step__spinner" aria-hidden="true" />
                Validating...
              </>
            ) : (
              <>
                Review Order
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
});

// =============================================================================
// Review Step Component
// =============================================================================
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
      <header className="checkout-step__header">
        <h2 id="review-heading" className="checkout-step__title">
          Review Your Order
        </h2>
        <p className="checkout-step__description">
          Please review your order details before completing your purchase.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="checkout-review">
        {/* Order Items */}
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

        {/* Shipping Info */}
        <div className="checkout-review__section">
          <div className="checkout-review__section-header">
            <h3 className="checkout-review__section-title">
              Contact & Billing
            </h3>
            <button
              type="button"
              className="checkout-review__edit"
              onClick={() => goToStep(CHECKOUT_STEPS.SHIPPING)}
            >
              Edit
            </button>
          </div>
          <div className="checkout-review__info-grid">
            <div className="checkout-review__info-item">
              <p className="checkout-review__info-label">Name</p>
              <p className="checkout-review__info-value">
                {shippingInfo.firstName} {shippingInfo.lastName}
              </p>
            </div>
            <div className="checkout-review__info-item">
              <p className="checkout-review__info-label">Email</p>
              <p className="checkout-review__info-value">
                {shippingInfo.email}
              </p>
            </div>
            <div className="checkout-review__info-item">
              <p className="checkout-review__info-label">Phone</p>
              <p className="checkout-review__info-value">
                {shippingInfo.phone}
              </p>
            </div>
            <div className="checkout-review__info-item">
              <p className="checkout-review__info-label">Address</p>
              <p className="checkout-review__info-value">
                {shippingInfo.street}, {shippingInfo.city}, {shippingInfo.state}{' '}
                {shippingInfo.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="checkout-review__section">
          <div className="checkout-review__section-header">
            <h3 className="checkout-review__section-title">Payment Method</h3>
            <button
              type="button"
              className="checkout-review__edit"
              onClick={() => goToStep(CHECKOUT_STEPS.PAYMENT)}
            >
              Edit
            </button>
          </div>
          <div className="checkout-review__payment">
            <div className="checkout-review__card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
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

        {/* Delivery Option */}
        <div className="checkout-review__section">
          <h3 className="checkout-review__section-title">Delivery Option</h3>
          <div className="checkout-review__delivery-options">
            <label
              className={`checkout-review__delivery-option ${shippingOption === 'instant' ? 'checkout-review__delivery-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="shippingOption"
                value="instant"
                checked={shippingOption === 'instant'}
                onChange={() => setShippingOption('instant')}
              />
              <span className="checkout-review__delivery-radio" />
              <div className="checkout-review__delivery-content">
                <span className="checkout-review__delivery-name">
                  Instant Download
                </span>
                <span className="checkout-review__delivery-desc">
                  Get immediate access to your files
                </span>
              </div>
              <span className="checkout-review__delivery-price">FREE</span>
            </label>
            <label
              className={`checkout-review__delivery-option ${shippingOption === 'priority' ? 'checkout-review__delivery-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="shippingOption"
                value="priority"
                checked={shippingOption === 'priority'}
                onChange={() => setShippingOption('priority')}
              />
              <span className="checkout-review__delivery-radio" />
              <div className="checkout-review__delivery-content">
                <span className="checkout-review__delivery-name">
                  Priority Processing
                </span>
                <span className="checkout-review__delivery-desc">
                  Priority queue for download links
                </span>
              </div>
              <span className="checkout-review__delivery-price">$4.99</span>
            </label>
          </div>
        </div>

        {/* Promo Code */}
        <div className="checkout-review__section">
          <h3 className="checkout-review__section-title">Promo Code</h3>
          {promoCode ? (
            <div className="checkout-review__promo-applied">
              <div className="checkout-review__promo-badge">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span>{promoCode}</span>
              </div>
              <span className="checkout-review__promo-discount">
                -${totals.discount.toFixed(2)}
              </span>
              <button
                type="button"
                className="checkout-review__promo-remove"
                onClick={removePromoCode}
                aria-label="Remove promo code"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
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
              <button
                type="button"
                className="checkout-review__promo-apply"
                onClick={handleApplyPromo}
                disabled={!promoInput.trim() || isApplyingPromo}
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </button>
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

        {/* Order Summary */}
        <div className="checkout-review__summary">
          <h3 className="checkout-review__summary-title">Order Summary</h3>
          <div className="checkout-review__summary-lines">
            <div className="checkout-review__summary-line">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="checkout-review__summary-line checkout-review__summary-line--discount">
                <span>Discount</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="checkout-review__summary-line">
              <span>Tax (10%)</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="checkout-review__summary-line">
              <span>Delivery</span>
              <span>
                {totals.shipping === 0
                  ? 'FREE'
                  : `$${totals.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="checkout-review__summary-line checkout-review__summary-line--total">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Errors */}
        {(errors.payment || errors.order || errors.general) && (
          <div className="checkout-review__error" role="alert">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{errors.payment || errors.order || errors.general}</p>
          </div>
        )}

        <div className="checkout-step__actions">
          <button
            type="button"
            className="checkout-step__back"
            onClick={goToPreviousStep}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button
            type="submit"
            className="checkout-step__submit checkout-step__submit--primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="checkout-step__spinner" aria-hidden="true" />
                Processing...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Complete Purchase - ${totals.total.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
});

// =============================================================================
// Confirmation Step Component
// =============================================================================
const ConfirmationStep = memo(function ConfirmationStep() {
  const { orderResult, resetCheckout } = useCheckout();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Scroll to top when confirmation page loads
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
        // Fallback for older browsers
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
      {/* Celebration background effect */}
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
            <button
              type="button"
              className={`checkout-confirmation__copy-btn ${copied ? 'checkout-confirmation__copy-btn--copied' : ''}`}
              onClick={handleCopyOrderId}
              aria-label={copied ? 'Copied!' : 'Copy order ID'}
            >
              {copied ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Download links will be sent to:{' '}
                <strong>{orderResult.shippingAddress.email}</strong>
              </p>
              <p className="checkout-confirmation__delivery-date">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
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
                    {step.completed ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
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
          <button
            className="checkout-confirmation__btn checkout-confirmation__btn--primary"
            onClick={handleContinueShopping}
          >
            Continue Shopping
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            className="checkout-confirmation__btn checkout-confirmation__btn--secondary"
            onClick={() => window.print()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Receipt
          </button>
        </div>
      </div>
    </section>
  );
});

// =============================================================================
// Main Checkout Page Component
// =============================================================================
function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { currentStep, completedSteps, goToStep } = useCheckout();

  // Redirect to cart if empty (except on confirmation)
  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== CHECKOUT_STEPS.CONFIRMATION) {
      navigate('/cart');
    }
  }, [cartItems.length, currentStep, navigate]);

  // Reset checkout when unmounting (unless on confirmation)
  useEffect(() => {
    return () => {
      if (currentStep !== CHECKOUT_STEPS.CONFIRMATION) {
        // Don't reset if user is on confirmation page
      }
    };
  }, [currentStep]);

  // SEO structured data
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

  // Render current step
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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
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
