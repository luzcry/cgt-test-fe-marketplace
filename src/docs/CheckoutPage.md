# CheckoutPage

The CheckoutPage component implements a complete multi-step checkout flow for the 3D Marketplace.

## Overview

A four-step checkout process:
1. **Shipping** - Contact and billing information
2. **Payment** - Card details with validation
3. **Review** - Order summary with promo codes
4. **Confirmation** - Order success with timeline

## Features

### Multi-Step Navigation
- Visual step indicator with progress
- Completed step checkmarks
- Click to navigate between completed steps
- Back/forward navigation buttons

### Form Validation
- Real-time field validation
- Error messages with ARIA support
- Loading states during submission
- Field-level error clearing on input

### Payment Processing
- Card type detection (Visa, Mastercard, Amex, Discover)
- Auto-formatting for card number
- Expiry date formatting (MM/YY)
- Secure CVV input
- Save card option

### Order Review
- Order items with 3D previews
- Editable shipping/payment info
- Delivery option selection (Instant/Priority)
- Promo code input with validation
- Real-time total calculation

### Confirmation
- Animated success icon
- Celebration particles effect
- Copy order ID to clipboard
- Order timeline
- Print receipt option

## Usage

```jsx
import CheckoutPage from './pages/CheckoutPage';
import { CheckoutProvider } from './context/CheckoutContext';

function App() {
  return (
    <CheckoutProvider>
      <CheckoutPage />
    </CheckoutProvider>
  );
}
```

## Component Structure

```
CheckoutPage
├── StepIndicator         # Progress navigation
├── ShippingStep          # Contact & billing form
├── PaymentStep           # Card information form
├── ReviewStep            # Order summary & promo
└── ConfirmationStep      # Success page
```

## Sub-Components

### StepIndicator
Displays checkout progress with clickable steps.

```jsx
<StepIndicator
  steps={['shipping', 'payment', 'review']}
  currentStep="payment"
  completedSteps={['shipping']}
  onStepClick={(step) => goToStep(step)}
/>
```

### FormInput
Reusable form field with validation.

```jsx
<FormInput
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
  autoComplete="email"
/>
```

## Context Integration

Uses `CheckoutContext` for state management:

```jsx
const {
  currentStep,
  shippingInfo,
  paymentInfo,
  totals,
  isLoading,
  fieldErrors,
  submitShippingInfo,
  submitPaymentInfo,
  placeOrder,
} = useCheckout();
```

## Checkout Steps

### CHECKOUT_STEPS
```javascript
{
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review',
  CONFIRMATION: 'confirmation',
}
```

### STEP_TITLES
```javascript
{
  shipping: 'Shipping',
  payment: 'Payment',
  review: 'Review',
  confirmation: 'Confirmation',
}
```

## SEO

- Dynamic page title via Helmet
- noindex, nofollow for checkout pages
- JSON-LD structured data for CheckoutPage type

## Accessibility

- Semantic HTML structure
- ARIA labels on all interactive elements
- Form validation with aria-invalid
- Error messages with role="alert"
- Step indicator with aria-current="step"
- Keyboard navigable forms
- Screen reader announcements

## Styling

Located in `CheckoutPage.scss`:

```scss
.checkout-page { }
.checkout-steps { }
.checkout-step { }
.checkout-form { }
.form-field { }
.checkout-review { }
.checkout-confirmation { }
.checkout-celebration { }
```

## Props

The component requires no props but must be wrapped in:
- `CheckoutProvider` - Checkout state management
- `CartProvider` - Cart items access
- `HelmetProvider` - SEO meta tags
- `BrowserRouter` - Routing

## Redirects

- Redirects to `/cart` if cart is empty (except on confirmation)
- Links back to cart from shipping step
- Continue shopping returns to home after order

## Related

- [CartPage.md](./CartPage.md)
- [CartContext](../context/CartContext.js)
- [CheckoutContext](../context/CheckoutContext.js)
- [checkoutService](../services/checkoutService.js)
