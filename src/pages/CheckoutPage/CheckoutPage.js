import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  useCheckout,
  CHECKOUT_STEPS,
  STEP_ORDER,
} from '../../context/CheckoutContext';
import { useCart } from '../../context/CartContext';
import { LockIcon } from '../../components/Icons';
import {
  StepIndicator,
  ShippingStep,
  PaymentStep,
  ReviewStep,
  ConfirmationStep,
} from './components';
import './CheckoutPage.scss';

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
