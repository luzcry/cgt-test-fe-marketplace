# Header Component

## Overview

The Header component provides the main navigation for the marketplace application. It displays the shop branding and navigation links to Home and Cart pages.

## Location

`src/components/Header/`

## Files

- `Header.js` - Main component
- `Header.css` - Styles
- `index.js` - Barrel export

## Refactoring Changes

### Before (in App.js)
```jsx
<header>
  90s shop
  <nav>
    <ul style={{listStyleType: 'none', display: 'flex'}}>
      <li><a href="/">Home</a></li>
      |
      <li><a href="/cart">Cart ({cartItems().length})</a></li>
    </ul>
  </nav>
  <hr/>
</header>
```

### After
```jsx
<Header />
```

## Key Improvements

1. **Extracted to separate component** - Reusable and isolated
2. **Uses React Router `<Link>`** - No page reloads, true SPA navigation
3. **Uses CartContext** - Dynamic cart count from state management
4. **Proper CSS styling** - Moved from inline styles to CSS file
5. **BEM naming convention** - Organized CSS class names
6. **Semantic HTML** - Proper use of `<header>` and `<nav>` elements

## Dependencies

- `react-router-dom` - For `<Link>` component
- `CartContext` - For cart count

## Usage

```jsx
import Header from './components/Header';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        {/* ... */}
      </BrowserRouter>
    </CartProvider>
  );
}
```

## Props

None. Uses `useCart()` hook internally for cart count.

## Tests

Located at `src/__tests__/Header.test.js`

- Renders shop name
- Renders home link with correct href
- Renders cart link with count
- Logo links to home page
