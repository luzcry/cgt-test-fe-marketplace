# App Component

## Overview

The App component serves as the main application shell, providing routing configuration and global state management through the CartProvider.

## Location

`src/App.js`

## Files

- `App.js` - Main application component
- `App.css` - Global styles
- `index.js` - Entry point with BrowserRouter

## Refactoring Changes

### Before
```jsx
// 81 lines of monolithic code with:
// - Hardcoded products
// - window.location.pathname routing hack
// - Non-functional cart (always empty array)
// - Inline styles
// - Duplicate code for Product A and B

function cartItems() {
  return []
}

function App() {
  return (
    <main>
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

      {window.location.pathname === '/' && (...)}
      {window.location.pathname === '/products/b' && (...)}
      {window.location.pathname === '/products/a' && (...)}
      {window.location.pathname === '/cart' && (...)}
    </main>
  );
}
```

### After
```jsx
// 26 lines - clean, modular architecture

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}
```

## Key Improvements

1. **Proper React Router** - Replaced `window.location.pathname` with React Router v6
2. **State Management** - CartProvider wraps app for global cart state
3. **Component Architecture** - Extracted into reusable components
4. **Clean Routing** - Declarative Routes configuration
5. **Dynamic Product Pages** - Single route handles all products via `:productId`
6. **CSS File** - Global styles extracted to App.css
7. **BrowserRouter in index.js** - Proper router setup at entry point
8. **From 81 lines to 26 lines** - Cleaner, more maintainable code

## Dependencies

- `react-router-dom` - Routing (Routes, Route)
- `CartContext` - Global cart state
- `Header` - Navigation component
- `HomePage` - Home page component
- `ProductPage` - Product detail component
- `CartPage` - Shopping cart component

## Architecture

```
index.js (BrowserRouter)
└── App.js (CartProvider)
    ├── Header (uses useCart for count)
    └── Routes
        ├── / → HomePage
        ├── /products/:productId → ProductPage (uses useCart)
        └── /cart → CartPage (uses useCart)
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Product listing grid |
| `/products/:productId` | ProductPage | Product detail with add to cart |
| `/cart` | CartPage | Shopping cart with checkout |

## Tests

Located at `src/App.test.js`

### Layout Tests
- Renders header on all pages
- Renders navigation links

### Routing Tests
- Renders home page at /
- Renders product page at /products/:id
- Renders cart page at /cart

### Integration Tests
- Shows products on home page
- Cart count starts at 0
