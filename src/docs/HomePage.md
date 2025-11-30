# HomePage Component

## Overview

The HomePage displays a grid of all available products with images, names, prices, and descriptions. Each product links to its detail page.

## Location

`src/pages/HomePage.js`

## Files

- `HomePage.js` - Main component
- `HomePage.css` - Styles

## Refactoring Changes

### Before (in App.js)
```jsx
{
  window.location.pathname === '/' && (
    <div>
      Welcome to our shop!

      <p>
        You are probably interested in <a href="/products/a">A</a>.
      </p>

      <p>
        Check out the newest product <a href="/products/b">B</a>!
      </p>
    </div>
  )
}
```

### After
```jsx
<Route path="/" element={<HomePage />} />
```

## Key Improvements

1. **Extracted to page component** - Clean separation of concerns
2. **Uses product data** - Pulls from `data/products.js` instead of hardcoded
3. **Product grid layout** - Responsive CSS grid display
4. **React Router `<Link>`** - SPA navigation without page reloads
5. **Accessibility** - Proper alt text on images
6. **Dynamic rendering** - Maps over products array, easy to add more products
7. **Product cards** - Visual cards with hover effects

## Dependencies

- `react-router-dom` - For `<Link>` component
- `data/products` - Product data source

## Usage

```jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
```

## Props

None. Gets product data from `data/products.js`.

## Tests

Located at `src/__tests__/HomePage.test.js`

- Renders welcome message
- Renders all products (A and B)
- Renders product prices
- Renders product links with correct hrefs
- Renders product images with alt text
- Renders product descriptions
