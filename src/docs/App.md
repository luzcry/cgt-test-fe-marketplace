# App Component

## Overview

The App component serves as the main application shell, providing routing configuration and global state management through the CartProvider. The app features a tech-forward dark theme with chrome silver and electric blue accents.

## Location

`src/App.js`

## Files

- `App.js` - Main application component
- `App.scss` - App-level styles (layout, skip link)
- `index.js` - Entry point with BrowserRouter and global styles
- `styles/main.scss` - Design system entry point

## Visual Redesign (2024)

### Design System

The app now uses a comprehensive SCSS design system:

```
src/styles/
├── main.scss           # Entry point
├── _variables.scss     # CSS custom properties (colors, spacing, etc.)
├── _mixins.scss        # Reusable SCSS patterns
├── _base.scss          # Reset and typography
├── _animations.scss    # Keyframe animations
└── _utilities.scss     # Utility classes
```

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `hsl(220 30% 4%)` | Main background |
| `--color-primary` | `hsl(210 15% 75%)` | Chrome silver |
| `--color-accent` | `hsl(210 90% 55%)` | Electric blue |
| `--color-foreground` | `hsl(210 20% 98%)` | Text |

### Typography

- **Display Font**: Orbitron (headings, branding)
- **Body Font**: Inter (body text, UI)
- **Fluid Typography**: Using `clamp()` for responsive sizing

## Architecture

```
index.js (BrowserRouter, Global Styles)
└── App.js (CartProvider)
    ├── Skip Link (Accessibility)
    ├── Header (Frosted glass, animated logo)
    └── Routes
        ├── / → HomePage (Hero + Product Grid)
        ├── /products/:productId → ProductPage (Detail view)
        └── /cart → CartPage (Shopping cart)
```

## Key Features

### Accessibility
- Skip link for keyboard navigation
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels on interactive elements
- Focus states with visible outlines
- Reduced motion support

### SEO Best Practices
- Semantic HTML (`<main>`, `<header>`, `<nav>`, `<article>`)
- Proper document outline
- Meaningful link text
- Image alt attributes

### Performance
- SCSS with CSS custom properties for theming
- Lazy loading for images (`loading="lazy"`)
- Font loading with `display=swap`
- Animation performance with `transform` and `opacity`

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Hero section + product grid |
| `/products/:productId` | ProductPage | Product detail with specs |
| `/cart` | CartPage | Cart with order summary |

## Dependencies

- `react-router-dom` - Client-side routing
- `CartContext` - Global cart state management
- `sass` - SCSS compilation

## Tests

Located at `src/App.test.js`

### Layout Tests
- Renders header on all pages
- Renders navigation links
- Skip link is present

### Routing Tests
- Renders home page at /
- Renders product page at /products/:id
- Renders cart page at /cart

### Integration Tests
- Shows products on home page
- Cart count updates correctly
