# Header Component

## Overview

The Header component provides the main navigation for the marketplace application with a tech-forward design featuring a frosted glass effect, animated logo, and responsive cart button with badge.

## Location

`src/components/Header/`

## Files

- `Header.js` - Main component with SVG icons
- `Header.scss` - Component styles using design system
- `index.js` - Barrel export

## Visual Design

### Features
- **Frosted glass effect**: `backdrop-filter: blur(16px)` with semi-transparent background
- **Fixed positioning**: Stays at top on scroll
- **Animated logo**: CPU icon with glow effect, rotates on hover
- **NEXUS3D branding**: Two-tone text with Orbitron font
- **Cart button**: With animated badge showing item count

### CSS Classes (BEM)
```scss
.header                    // Main container
.header__nav              // Navigation wrapper
.header__brand            // Logo container
.header__logo             // Logo link
.header__logo-icon        // CPU icon with glow
.header__brand-text       // Brand name
.header__brand-primary    // "NEXUS" in silver
.header__brand-secondary  // "3D" in white
.header__nav-list         // Navigation links
.header__nav-link         // Browse link with underline animation
.header__cart-btn         // Cart button
.header__cart-badge       // Item count badge
```

### Animations
- `header-slide-down`: Entry animation from top
- `logo-glow`: Pulsing glow behind icon
- `badge-pop`: Scale-in animation for badge

## Accessibility

- `role="banner"` on header element
- `aria-label="Main navigation"` on nav
- `aria-label` on cart button with item count
- `aria-hidden="true"` on decorative SVG icons
- Visible focus states on all interactive elements

## SEO Best Practices

- Semantic HTML structure (`<header>`, `<nav>`, `<ul>`)
- Meaningful link text ("Browse", "Cart")
- Proper heading hierarchy (brand is not an h1)

## Dependencies

- `react-router-dom` - For `<Link>` component
- `CartContext` - For cart count via `useCart()` hook

## Usage

```jsx
import Header from './components/Header';

function App() {
  return (
    <CartProvider>
      <Header />
      {/* ... */}
    </CartProvider>
  );
}
```

## Props

None. Uses `useCart()` hook internally for cart count.

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| Mobile | Compact layout, cart text hidden |
| Desktop (768px+) | Full layout with cart text visible |

## Tests

Located at `src/__tests__/Header.test.js`

- Renders brand name (NEXUS3D)
- Renders browse link
- Renders cart button with count
- Logo links to home page
- Cart badge appears when items > 0
