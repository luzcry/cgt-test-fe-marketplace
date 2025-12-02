# HomePage Component

## Overview

The HomePage serves as the landing page with a tech-forward hero section, responsive product grid, and filter sidebar. It showcases products with animated cards, search functionality, and category/price/format filters with direct "Add to Cart" functionality.

## Location

`src/pages/HomePage.js`

## Files

- `HomePage.js` - Main component
- `HomePage.scss` - Component styles

## Features

### Filter & Search System
- **Search bar**: Real-time search across product names, categories, and tags
- **Filter sidebar**: Collapsible sections for:
  - Category filter (checkboxes)
  - Price range slider ($0 - $500)
  - Polygon count range slider (0 - 100,000)
  - File format filter (FBX, OBJ, GLTF, BLEND, MAX)
- **Active filter count**: Badge showing number of active filters
- **Reset functionality**: Clear all filters with one click
- **Mobile responsive**: Slide-in panel on mobile, sticky sidebar on desktop

### SEO Features
- **Dynamic meta tags**: Via react-helmet-async
- **JSON-LD structured data**: Schema.org ItemList with Product items
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **Canonical URLs**: Prevents duplicate content issues

### Performance Optimizations
- **Memoized filtering**: `useMemo` for filtered products
- **Stable callbacks**: `useCallback` for event handlers
- **Lazy loading**: Images load on-demand
- **CSS animations**: Hardware-accelerated transforms

## Visual Design

### Hero Section
- **Background**: Tech gradient with grid pattern overlay
- **Animated scanlines**: Moving horizontal lines effect
- **Floating particles**: 20 animated dots rising upward
- **Two-column layout**: Text content + visual element on desktop
- **Visual element**: Rotating rings with corner accents

### Product Grid
- **Responsive columns**: 1 → 2 → 3 → 4 columns based on viewport
- **Staggered animation**: Cards animate in sequence
- **Hover effects**: Lift and border glow

### Product Cards
- **Preview area**: Gradient background with rotating "3D" text
- **Rating badge**: Star icon with rating value
- **Specs badges**: Polygon count and file format
- **Content**: Category, name, description, price
- **CTA button**: "Add to Cart" with cart icon

## State Management

```javascript
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [filters, setFilters] = useState(initialFilters);
const [searchTerm, setSearchTerm] = useState('');

const filteredProducts = useMemo(() => {
  return filterProducts({ ...filters, searchTerm });
}, [filters, searchTerm]);
```

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
.products__main
.products__header
.products__header-top
.products__title-group
.products__title
.products__count
.products__filter-toggle
.products__filter-badge
.products__search
.products__search-icon
.products__search-input
.products__search-clear
.products__grid

// Empty State
.products__empty
.products__empty-icon
.products__empty-title
.products__empty-text
.products__empty-reset
```

## Accessibility

- `aria-labelledby` linking sections to their headings
- `role="list"` on product grid with `aria-label`
- `aria-expanded` on filter toggle button
- `aria-controls` linking toggle to sidebar
- Search input with `aria-label`
- `role="status"` and `aria-live="polite"` on empty state
- Proper heading hierarchy (h1 → h2 → h3)

## SEO Best Practices

- Dynamic `<title>` and `<meta description>` via Helmet
- Open Graph tags for social sharing
- Twitter Card metadata
- JSON-LD structured data for products
- Semantic sectioning (`<section>`, `<article>`)
- Canonical URL declaration
- Lazy loading on images (`loading="lazy"`)

## Structured Data Example

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "3D Models Marketplace",
  "numberOfItems": 12,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Cyber Warrior",
        "offers": {
          "@type": "Offer",
          "price": 89,
          "priceCurrency": "USD"
        }
      }
    }
  ]
}
```

## Responsive Behavior

| Breakpoint | Grid Columns | Sidebar | Hero Layout |
|------------|--------------|---------|-------------|
| Mobile | 1 | Slide-in panel | Single column |
| Tablet (768px+) | 2 | Slide-in panel | Single column |
| Desktop (1024px+) | 2 | Sticky sidebar | Two columns |
| Wide (1280px+) | 3 | Sticky sidebar | Two columns |
| 2XL (1536px+) | 4 | Sticky sidebar | Two columns |

## Dependencies

- `react-helmet-async` - Dynamic SEO meta tags
- `react-router-dom` - For navigation
- `CartContext` - For `addToCart()` function
- `ProductCard` - Product display component
- `FilterSidebar` - Filter panel component
- `products` data - Product catalog with filter functions

## Props

None. Manages filter state internally and fetches products from data file.

## Tests

Located at `src/__tests__/HomePage.test.js`

- Renders hero title and badge
- Renders all products with prices
- Search input filters products
- Filter toggle button present
- Product count displays correctly
- Add to cart buttons work
- Accessibility: proper heading hierarchy
- SEO: Schema.org markup present on cards
