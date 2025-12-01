# HomePage Component

## Overview

The HomePage serves as the landing page with a tech-forward hero section and responsive product grid. It showcases products with animated cards and provides direct "Add to Cart" functionality.

## Location

`src/pages/HomePage.js`

## Files

- `HomePage.js` - Main component
- `HomePage.scss` - Component styles

## Visual Design

### Hero Section
- **Background**: Tech gradient with grid pattern overlay
- **Animated scanlines**: Moving horizontal lines effect
- **Floating particles**: 12 animated dots rising upward
- **Two-column layout**: Text content + visual element on desktop
- **Visual element**: Rotating rings with corner accents

### Product Grid
- **Responsive columns**: 1 → 2 → 3 columns based on viewport
- **Staggered animation**: Cards animate in sequence
- **Hover effects**: Lift and border glow

### Product Cards
- **Preview area**: Gradient background with rotating "3D" text
- **Rating badge**: Star icon with rating value
- **Content**: Category, name, description, price
- **CTA button**: "Add to Cart" with cart icon

## CSS Classes (BEM)

```scss
// Hero Section
.hero
.hero__background
.hero__particles
.hero__particle
.hero__content
.hero__grid
.hero__text
.hero__badge
.hero__title
.hero__title-gradient
.hero__description
.hero__features
.hero__feature-dot
.hero__visual
.hero__visual-ring

// Products Section
.products
.products__header
.products__title
.products__grid

// Product Card
.product-card
.product-card__preview
.product-card__preview-bg
.product-card__rating
.product-card__content
.product-card__category
.product-card__name
.product-card__description
.product-card__price
.product-card__cta
.product-card__btn
```

## Accessibility

- `aria-labelledby` linking sections to their headings
- `role="list"` on product grid
- `role="listitem"` on product cards
- `aria-label` on product links with price info
- `aria-hidden="true"` on decorative elements
- Proper heading hierarchy (h1 → h2 → h3)

## SEO Best Practices

- Single h1 in hero section
- Semantic sectioning (`<section>`, `<article>`)
- Meaningful alt text (empty alt for decorative images)
- Lazy loading on images (`loading="lazy"`)
- Proper document outline

## Performance

- CSS animations using `transform` and `opacity`
- Staggered animations using CSS `animation-delay`
- Image lazy loading
- No JavaScript animation libraries required

## Responsive Behavior

| Breakpoint | Grid Columns | Hero Layout |
|------------|--------------|-------------|
| Mobile | 1 | Single column, visual hidden |
| Tablet (768px+) | 2 | Single column |
| Desktop (1024px+) | 2 | Two columns |
| Wide (1280px+) | 3 | Two columns |

## Dependencies

- `react-router-dom` - For `<Link>` component
- `CartContext` - For `addToCart()` function
- `products` data - Product catalog

## Props

None. Fetches products directly from data file.

## Tests

Located at `src/__tests__/HomePage.test.js`

- Renders hero title
- Renders product cards
- Shows product prices
- Add to cart buttons work
- Links to product pages
