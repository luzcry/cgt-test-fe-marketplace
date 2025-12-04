import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCheckout } from '../../../context/CheckoutContext';
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';
import SectionHeader from '../../../components/SectionHeader';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../components/Icons';

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

export default ShippingStep;
