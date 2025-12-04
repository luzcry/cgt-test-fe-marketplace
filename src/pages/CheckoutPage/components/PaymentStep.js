import { memo, useState, useCallback } from 'react';
import { useCheckout } from '../../../context/CheckoutContext';
import { detectCardType } from '../../../services/checkoutService';
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import SectionHeader from '../../../components/SectionHeader';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LockIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  DiscoverIcon,
} from '../../../components/Icons';

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

  const cardIconMap = {
    visa: VisaIcon,
    mastercard: MastercardIcon,
    amex: AmexIcon,
    discover: DiscoverIcon,
  };

  const DetectedCardIcon = cardIconMap[cardType];

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
              <VisaIcon className="card-icon" />
              <MastercardIcon className="card-icon" />
              <AmexIcon className="card-icon" />
              <DiscoverIcon className="card-icon" />
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
            {DetectedCardIcon && (
              <div className="checkout-form__detected-card" aria-live="polite">
                <DetectedCardIcon className="card-icon" />
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

export default PaymentStep;
