# ProductPage Component

## Overview

The ProductPage displays detailed information about a single product and allows users to add it to their cart. It's a dynamic page that works for any product based on the URL parameter.

## Location

`src/pages/ProductPage.js`

## Files

- `ProductPage.js` - Main component
- `ProductPage.css` - Styles

## Refactoring Changes

### Before (in App.js)
```jsx
{
  window.location.pathname === '/products/b' && (
    <div>
      <h1>Product B</h1>
      <p>Price: 30 USD</p>

      <button onClick={() => console.warn('Not implemented!')}>
        Add to cart
      </button>

      <div><img src={pictureB} width={640}/></div>
    </div>
  )
}
{
  window.location.pathname === '/products/a' && (
    <div>
      <h1>Product A</h1>
      <p>Price: 10 USD</p>

      <button onClick={() => console.warn('Not implemented!')}>
        Add to cart
      </button>

      <div><img src={pictureA} width={640}/></div>
    </div>
  )
}
```

### After
```jsx
<Route path="/products/:productId" element={<ProductPage />} />
```

## Key Improvements

1. **Single reusable component** - Handles all products via URL parameter
2. **Eliminated code duplication** - One component instead of one per product
3. **Uses URL parameters** - `useParams()` hook for dynamic routing
4. **Functional add to cart** - Actually adds items using CartContext
5. **Product not found handling** - Shows friendly error for invalid products
6. **Uses product data** - Pulls from `data/products.js`
7. **Back navigation** - Link to return to product listing
8. **Responsive design** - Grid layout adapts to screen size
9. **Accessible** - Proper alt text, semantic HTML

## Dependencies

- `react-router-dom` - For `useParams`, `Link`
- `CartContext` - For add to cart functionality
- `data/products` - Product data source

## Usage

```jsx
import { Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/products/:productId" element={<ProductPage />} />
      </Routes>
    </CartProvider>
  );
}
```

## URL Parameters

- `productId` - The ID of the product to display (e.g., 'a', 'b')

## Props

None. Uses `useParams()` for product ID and `useCart()` for cart actions.

## Tests

Located at `src/__tests__/ProductPage.test.js`

### Product A Tests
- Renders product name
- Renders product price
- Renders product image with alt text
- Renders add to cart button
- Renders back link

### Product B Tests
- Renders product name
- Renders product price

### Non-existent Product Tests
- Renders not found message
- Renders back to home link

### Add to Cart Tests
- Adds item to cart when button clicked
- Increments quantity when adding same product twice
