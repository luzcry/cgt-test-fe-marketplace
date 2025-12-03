# ProductCard Component

## Overview

A reusable, SEO-optimized product card component that displays product information with Schema.org microdata markup, accessible controls, and smooth animations. Used in the HomePage product grid.

## Location

`src/components/ProductCard/`

## Files

- `ProductCard.js` - Main component
- `ProductCard.scss` - Component styles
- `index.js` - Export file

## Features

### SEO Optimization

- **Schema.org Product markup**: Full microdata implementation
- **Structured price data**: Offer schema with currency
- **Aggregate rating**: Rating schema with best/worst values
- **Semantic HTML**: Proper heading hierarchy within cards

### Performance

- **React.memo**: Prevents unnecessary re-renders
- **Lazy loading images**: `loading="lazy"` and `decoding="async"`
- **CSS animations**: Hardware-accelerated transforms
- **Staggered entrance**: Animation delay based on index

### Accessibility

- **Descriptive links**: Full product info in aria-label
- **Button labels**: Clear action descriptions
- **Visual indicators**: Rating with aria-label
- **Keyboard navigation**: Focus-visible styles

## Props

| Prop      | Type   | Required | Description                                     |
| --------- | ------ | -------- | ----------------------------------------------- |
| `product` | Object | Yes      | Product data object                             |
| `index`   | Number | No       | Card index for staggered animation (default: 0) |

### Product Object Shape

```javascript
{
  id: 'cyber-warrior',           // Unique identifier
  name: 'Cyber Warrior',         // Display name
  price: 89,                     // Price in USD
  currency: 'USD',               // Currency code
  image: '/path/to/image.jpg',   // Product image
  description: 'Product desc',   // Short description
  category: 'Characters',        // Product category
  rating: 4.8,                   // Star rating (0-5)
  previewColor: 'linear-gradient(...)', // Card background
  polyCount: 45000,              // Polygon count
  fileFormat: ['FBX', 'OBJ'],    // Available formats
  tags: ['character', 'rigged'], // Searchable tags
}
```

## Schema.org Markup

The component includes full Schema.org Product microdata:

```html
<article itemScope itemType="https://schema.org/Product">
  <img itemprop="image" />
  <h3 itemprop="name">Product Name</h3>
  <p itemprop="description">Description</p>

  <span
    itemProp="aggregateRating"
    itemScope
    itemType="https://schema.org/AggregateRating"
  >
    <meta itemprop="ratingValue" content="4.8" />
    <meta itemprop="bestRating" content="5" />
  </span>

  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <meta itemprop="priceCurrency" content="USD" />
    <span itemProp="price" content="89">$89</span>
    <meta itemprop="availability" content="https://schema.org/InStock" />
  </div>
</article>
```

## CSS Classes (BEM)

```scss
.product-card                    // Card container
.product-card__link              // Clickable link wrapper
.product-card__preview           // Image/preview section
.product-card__preview-bg        // Gradient background
.product-card__preview-pattern   // Grid pattern overlay
.product-card__preview-text      // Rotating "3D" text
.product-card__image             // Product image
.product-card__rating            // Rating badge
.product-card__rating-star       // Star icon
.product-card__content           // Text content area
.product-card__category          // Category label
.product-card__name              // Product title (h3)
.product-card__description       // Product description
.product-card__specs             // Specs row container
.product-card__spec              // Individual spec badge
.product-card__spec--format      // File format badge
.product-card__spec-icon         // Layers icon
.product-card__price             // Price display
.product-card__cta               // CTA section
.product-card__btn               // Add to Cart button
.product-card__btn-icon          // Cart icon
.product-card__hover-overlay     // Hover gradient effect
```

## Animations

### Entrance Animation

```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Staggered Delay

Animation delay is calculated based on card index:

```javascript
const animationDelay = `${index * 0.05}s`;
```

### Hover Effects

- Card lifts 8px (`translateY(-8px)`)
- Border color changes to primary
- Background preview scales 1.05x
- Gradient overlay fades in

### Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  .product-card {
    animation: none;
    transition: none;
  }
}
```

## Usage

```jsx
import ProductCard from '../components/ProductCard';

function ProductGrid({ products }) {
  return (
    <div className="products__grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
```

## Dependencies

- `react-router-dom` - For Link component
- `CartContext` - For addToCart function
- Design system SCSS variables and mixins

## Accessibility Features

| Feature             | Implementation                                 |
| ------------------- | ---------------------------------------------- |
| Link description    | `aria-label="View {name} details - ${price}"`  |
| Button description  | `aria-label="Add {name} to cart for ${price}"` |
| Rating              | `aria-label="Rating: {rating} out of 5 stars"` |
| Polygon count       | `aria-label="{count} polygons"`                |
| Decorative elements | `aria-hidden="true"`                           |
| Focus indication    | `:focus-visible` outline styles                |

## Performance Considerations

1. **React.memo wrapper**: Prevents re-render when props unchanged
2. **Image lazy loading**: Uses native browser lazy loading
3. **CSS transforms**: Hardware-accelerated animations
4. **Minimal DOM**: Streamlined element structure
5. **Event handler optimization**: `stopPropagation` prevents bubbling

## Testing

The component is tested via HomePage tests:

- Schema markup presence
- Add to cart functionality
- Accessible labels
- Price rendering
