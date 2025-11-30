# CartPage Component

## Overview

The CartPage displays all items in the user's shopping cart with quantity controls, item removal, subtotals, and a total price. Users can modify quantities, remove items, or clear the entire cart.

## Location

`src/pages/CartPage.js`

## Files

- `CartPage.js` - Main component
- `CartPage.css` - Styles

## Refactoring Changes

### Before (in App.js)
```jsx
{
  window.location.pathname === '/cart' && (
    <div>
      Are you ready to purchase these?

      <ul>
        {cartItems().map((cartItem) => <li key={cartItem}>{cartItem}</li>)}
      </ul>
    </div>
  )
}
```

Note: The original `cartItems()` function always returned an empty array, so the cart was non-functional.

### After
```jsx
<Route path="/cart" element={<CartPage />} />
```

## Key Improvements

1. **Functional cart** - Actually displays and manages cart items
2. **Uses CartContext** - Real state management with add/remove/update
3. **Quantity controls** - Increase/decrease buttons for each item
4. **Item removal** - Remove individual items or clear entire cart
5. **Price calculations** - Automatic subtotals and total
6. **Empty cart state** - Friendly message with link to continue shopping
7. **Product links** - Click item name to go to product page
8. **Responsive design** - Adapts layout for mobile
9. **Accessibility** - ARIA labels on all interactive elements

## Dependencies

- `react-router-dom` - For `<Link>` component
- `CartContext` - For cart state and actions

## Usage

```jsx
import { Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </CartProvider>
  );
}
```

## Props

None. Uses `useCart()` hook for all cart data and actions.

## Cart Item Structure

Each cart item has:
```javascript
{
  id: string,
  name: string,
  price: number,
  currency: string,
  image: string,
  quantity: number
}
```

## Features

### Empty Cart State
- Shows "Your Cart is Empty" message
- Provides "Continue Shopping" link

### Cart with Items
- Item image thumbnail
- Item name (links to product page)
- Individual price
- Quantity controls (+/-)
- Subtotal (price × quantity)
- Remove button (×)

### Cart Summary
- Total price
- "Proceed to Checkout" button
- "Clear Cart" button

## Tests

Located at `src/__tests__/CartPage.test.js`

### Empty Cart Tests
- Renders empty cart message
- Renders continue shopping link
- Shows helpful message

### Cart with Items Tests
- Renders cart title
- Renders product name
- Renders product price
- Renders product image
- Renders quantity controls
- Renders cart total
- Renders checkout button
- Renders clear cart button
- Renders remove button

### Interaction Tests
- Increases quantity when + clicked
- Decreases quantity when - clicked
- Removes item when quantity reaches 0
- Removes item when remove button clicked
- Clears all items when clear cart clicked

### Calculation Tests
- Calculates correct total for single item
- Calculates subtotal correctly
