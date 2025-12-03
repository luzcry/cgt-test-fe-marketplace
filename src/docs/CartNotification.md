# CartNotification

A toast notification component that appears when products are added to the cart.

## Overview

Provides visual feedback when users add items to their cart, with options to view the cart or continue shopping.

## Features

- Slide-in animation from top-right
- Auto-dismiss after 5 seconds
- Shows product name
- Success checkmark icon
- Close button
- "View Cart" and "Continue Shopping" actions
- Accessible with ARIA live region

## Usage

```jsx
import CartNotification from './components/CartNotification';

function App() {
  return (
    <CartProvider>
      <CartNotification />
      {/* Rest of app */}
    </CartProvider>
  );
}
```

## Context Integration

Uses `CartContext` for notification state:

```jsx
const { notification, hideNotification } = useCart();
const { show, product } = notification;
```

## Notification State

```javascript
{
  show: boolean,      // Whether notification is visible
  product: {          // Product that was added
    id: string,
    name: string,
    // ... other product fields
  }
}
```

## Behavior

### Auto-Dismiss

The notification automatically hides after 5 seconds:

```jsx
useEffect(() => {
  if (show) {
    const timer = setTimeout(() => {
      hideNotification();
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [show, hideNotification]);
```

### Actions

- **View Cart**: Navigates to `/cart` and closes notification
- **Continue Shopping**: Closes notification, stays on current page
- **Close Button**: Closes notification

## Component Structure

```
CartNotification
├── Icon (checkmark)
├── Info
│   ├── Title ("Added to cart")
│   └── Product name
├── Close button
└── Actions
    ├── Continue Shopping
    └── View Cart
```

## Accessibility

- `role="alert"` for screen reader announcement
- `aria-live="polite"` for non-intrusive updates
- `aria-label="Close notification"` on close button
- `aria-hidden="true"` on decorative icons
- Keyboard accessible buttons

## Styling

Located in `CartNotification.scss`:

```scss
.cart-notification {
}
.cart-notification__content {
}
.cart-notification__icon {
}
.cart-notification__info {
}
.cart-notification__title {
}
.cart-notification__product {
}
.cart-notification__close {
}
.cart-notification__actions {
}
.cart-notification__btn {
}
.cart-notification__btn--primary {
}
.cart-notification__btn--secondary {
}
```

### Animation

```scss
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## Props

This component accepts no props. All state is managed through `CartContext`.

## Triggering Notifications

Notifications are triggered via `CartContext.addToCart()`:

```jsx
const { addToCart } = useCart();

const handleAddToCart = () => {
  addToCart(product);
  // Notification appears automatically
};
```

## Related

- [CartContext](../context/CartContext.js)
- [CartPage.md](./CartPage.md)
- [ProductCard.md](./ProductCard.md)
