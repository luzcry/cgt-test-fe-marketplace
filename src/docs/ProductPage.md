# ProductPage Component

## Overview

The ProductPage displays detailed information about a single product with a modern two-column layout featuring a sticky image viewer and comprehensive product information with specifications, features, and purchase actions.

## Location

`src/pages/ProductPage.js`

## Files

- `ProductPage.js` - Main component
- `ProductPage.scss` - Component styles

## Visual Design

### Layout
- **Two-column grid**: Image viewer (left) + Product info (right) on desktop
- **Sticky image viewer**: Stays visible while scrolling product details
- **Single column**: Stacks vertically on mobile

### Image Viewer
- **Container**: Rounded corners with gradient background
- **Grid pattern overlay**: Subtle tech aesthetic
- **Placeholder text**: Animated "3D" when no image
- **Image**: Full-size product image

### Product Information
- **Header**: Category badge, gradient title, rating with star
- **Description**: Full product description
- **Tags**: Hashtag-style badges
- **Specifications card**: Grid of product details
- **Features list**: Checkmark items with animations
- **Sticky price section**: Frosted glass effect at bottom

## CSS Classes (BEM)

```scss
// Layout
.product-page
.product-page__nav
.product-page__content
.product-page__grid
.product-page__viewer
.product-page__details

// Image Viewer
.product-page__image-container
.product-page__image-bg
.product-page__image
.product-page__image-hint

// Product Info
.product-page__header
.product-page__category
.product-page__title
.product-page__rating
.product-page__description
.product-page__tags
.product-page__tag
.product-page__specs
.product-page__specs-grid
.product-page__features
.product-page__feature
.product-page__feature-icon

// Actions
.product-page__actions
.product-page__price
.product-page__add-btn

// Not Found State
.product-page--not-found
.product-page__not-found-title
```

## Accessibility

- Proper heading hierarchy (h1 for title, h2 for sections)
- `aria-label` on back navigation
- `aria-labelledby` linking sections to headings
- `aria-hidden="true"` on decorative SVG icons
- Descriptive button labels with price info

## SEO Best Practices

- Semantic HTML (`<main>`, `<article>`, `<section>`, `<nav>`)
- Single h1 with product name
- Image with meaningful alt text
- Proper document outline
- Breadcrumb navigation

## Responsive Behavior

| Breakpoint | Layout | Image Viewer |
|------------|--------|--------------|
| Mobile | Single column | Static |
| Desktop (1024px+) | Two columns | Sticky |

## Dependencies

- `react-router-dom` - For `useParams`, `Link`, `useNavigate`
- `CartContext` - For add to cart functionality
- `data/products` - Product data source

## URL Parameters

- `productId` - The ID of the product to display (e.g., 'a', 'b')

## Props

None. Uses hooks for routing and cart state.

## Not Found State

Displays when product ID doesn't exist:
- Centered layout
- "Product Not Found" message
- "Back to Products" button

## Tests

Located at `src/__tests__/ProductPage.test.js`

- Renders product name and title
- Renders product price with formatting
- Renders product image
- Renders specifications
- Renders features list
- Add to cart functionality works
- Back navigation works
- Not found state for invalid products
