# CartPage Component

## Overview

The CartPage displays the user's shopping cart with a modern two-column layout featuring cart items with quantity controls and a sticky order summary with pricing breakdown.

## Location

`src/pages/CartPage.js`

## Files

- `CartPage.js` - Main component
- `CartPage.scss` - Component styles

## Visual Design

### Layout

- **Two-column grid**: Cart items (left 2/3) + Order summary (right 1/3)
- **Sticky summary**: Order summary stays visible while scrolling
- **Single column**: Stacks vertically on mobile

### Cart Items

- **Preview box**: Gradient background with "3D" text
- **Item info**: Name, category, quantity controls, price
- **Quantity controls**: +/- buttons with current value
- **Price display**: Total with "each" note for multiple items
- **Remove button**: Trash icon with hover effect

### Order Summary

- **Summary card**: Frosted glass card with gradient background
- **Price breakdown**: Subtotal, tax, total
- **Total display**: Large gradient text
- **Actions**: Checkout button (primary), Continue shopping, Clear cart

### Empty State

- **Shopping bag icon**: Large SVG illustration
- **Message**: "Your Cart is Empty"
- **CTA button**: "Browse Products" with glow effect

## CSS Classes (BEM)

```scss
// Layout
.cart-page
.cart-page__title
.cart-page__content

// Cart Items
.cart-page__items
.cart-item
.cart-item__preview
.cart-item__info
.cart-item__name
.cart-item__category
.cart-item__controls
.cart-item__quantity
.cart-item__quantity-btn
.cart-item__quantity-value
.cart-item__price
.cart-item__price-total
.cart-item__price-each
.cart-item__remove

// Order Summary
.cart-page__summary
.cart-page__summary-card
.cart-page__summary-title
.cart-page__summary-lines
.cart-page__summary-line
.cart-page__checkout-btn
.cart-page__continue-btn
.cart-page__clear-btn

// Empty State
.cart-page--empty
.cart-page__empty-icon
.cart-page__empty-title
.cart-page__empty-text
.cart-page__empty-btn
```

## Accessibility

- `aria-label` on all buttons (quantity, remove, checkout)
- `aria-label` on cart items section
- `aria-label` on order summary aside
- `disabled` attribute on decrease button when quantity is 1
- Proper heading hierarchy (h1 for title, h2 for summary)

## SEO Best Practices

- Semantic HTML (`<main>`, `<section>`, `<aside>`, `<article>`)
- Single h1 with page title
- Meaningful button labels
- Proper document outline

## Features

### Quantity Management

- Increase/decrease buttons
- Minimum quantity of 1 (decrease disabled at 1)
- Real-time price updates

### Price Calculations

- Subtotal: Sum of (price × quantity)
- Tax: 10% of subtotal
- Total: Subtotal + Tax

### Cart Actions

- **Proceed to Checkout**: Primary CTA
- **Continue Shopping**: Navigate to home
- **Clear Cart**: Remove all items

## Responsive Behavior

| Breakpoint        | Layout            | Summary        |
| ----------------- | ----------------- | -------------- |
| Mobile            | Single column     | Bottom of page |
| Desktop (1024px+) | Two columns (2:1) | Sticky sidebar |

## Dependencies

- `react-router-dom` - For `Link`, `useNavigate`
- `CartContext` - For cart state and actions

## Props

None. Uses `useCart()` hook for all cart data.

## Cart Item Structure

```javascript
{
  id: string,
  name: string,
  price: number,
  currency: string,
  image: string,
  category: string,
  previewColor: string,
  quantity: number
}
```

## Tests

Located at `src/__tests__/CartPage.test.js`

### Empty Cart Tests

- Renders empty cart message
- Renders browse products button
- Shows shopping bag icon

### Cart with Items Tests

- Renders cart title
- Renders product info
- Renders quantity controls
- Renders price with formatting
- Renders order summary
- Renders checkout button

### Interaction Tests

- Increases quantity
- Decreases quantity
- Removes item on button click
- Clears all items
- Navigates to continue shopping

### Calculation Tests

- Calculates subtotal correctly
- Calculates tax correctly
- Calculates total correctly
