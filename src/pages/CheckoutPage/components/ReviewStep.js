import { memo, useState, lazy, Suspense } from 'react';
import { useCheckout, CHECKOUT_STEPS } from '../../../context/CheckoutContext';
import { detectCardType } from '../../../services/checkoutService';
import Button from '../../../components/Button';
import SectionHeader from '../../../components/SectionHeader';
import InfoGrid from '../../../components/InfoGrid';
import RadioOption from '../../../components/RadioOption';
import OrderSummary from '../../../components/OrderSummary';
import {
  ArrowLeftIcon,
  LockIcon,
  TagIcon,
  CloseIcon,
  AlertIcon,
  CreditCardIcon,
} from '../../../components/Icons';

const ModelPreview = lazy(() => import('../../../components/ModelPreview'));

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
                  <Suspense
                    fallback={
                      <div
                        className="checkout-review__item-preview-fallback"
                        style={{ background: item.previewColor }}
                      />
                    }
                  >
                    <ModelPreview
                      model={item.model}
                      previewColor={item.previewColor}
                      alt={item.name}
                    />
                  </Suspense>
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
              {
                label: 'Name',
                value: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
              },
              { label: 'Email', value: shippingInfo.email },
              { label: 'Phone', value: shippingInfo.phone },
              {
                label: 'Address',
                value: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
              },
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
              ? [
                  {
                    label: 'Discount',
                    value: `-$${totals.discount.toFixed(2)}`,
                    isDiscount: true,
                  },
                ]
              : []),
            { label: 'Tax (10%)', value: `$${totals.tax.toFixed(2)}` },
            {
              label: 'Delivery',
              value:
                totals.shipping === 0
                  ? 'FREE'
                  : `$${totals.shipping.toFixed(2)}`,
            },
            {
              label: 'Total',
              value: `$${totals.total.toFixed(2)}`,
              isTotal: true,
            },
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

export default ReviewStep;
