# FilterSidebar Component

## Overview

A responsive filter panel with collapsible sections for filtering products by category, price range, polygon count, and file format. Features mobile slide-in animation and desktop sticky positioning.

## Location

`src/components/FilterSidebar/`

## Files

- `FilterSidebar.js` - Main component with sub-components
- `FilterSidebar.scss` - Component styles
- `index.js` - Export file

## Features

### Filter Types

- **Category filter**: Checkbox list (Characters, Vehicles, Props, etc.)
- **Price range**: Dual-thumb slider ($0 - $500)
- **Polygon count**: Dual-thumb slider (0 - 100,000)
- **File format**: Checkbox list (FBX, OBJ, GLTF, BLEND, MAX)

### UI Features

- **Collapsible sections**: Expandable filter groups with animation
- **Active filter count**: Badge showing number of active filters
- **Reset all**: One-click filter reset
- **Mobile responsive**: Slide-in panel with backdrop overlay
- **Desktop sticky**: Fixed sidebar during scroll

### Performance

- **React.memo**: On all sub-components
- **useCallback**: Stable event handlers
- **CSS animations**: Smooth transitions without JS

## Props

| Prop             | Type     | Required | Description                        |
| ---------------- | -------- | -------- | ---------------------------------- |
| `isOpen`         | Boolean  | Yes      | Controls mobile sidebar visibility |
| `onClose`        | Function | Yes      | Callback when sidebar should close |
| `filters`        | Object   | Yes      | Current filter state               |
| `onFilterChange` | Function | Yes      | Callback when filters change       |
| `onReset`        | Function | Yes      | Callback to reset all filters      |

### Filter State Shape

```javascript
{
  categories: [],                    // Selected category names
  priceRange: [0, 500],              // [min, max] price
  polyCountRange: [0, 100000],       // [min, max] polygons
  fileFormats: [],                   // Selected format names
}
```

## Sub-Components

### FilterSection

Collapsible container for filter groups.

```jsx
<FilterSection
  title="Category"
  id="filter-categories"
  isExpanded={true}
  onToggle={() => toggleSection('category')}
>
  {/* Filter content */}
</FilterSection>
```

### CheckboxFilter

Individual checkbox item with custom styling.

```jsx
<CheckboxFilter
  id="category-Characters"
  label="Characters"
  checked={filters.categories.includes('Characters')}
  onChange={() => handleCategoryToggle('Characters')}
/>
```

### RangeSlider

Dual-thumb range slider with value display.

```jsx
<RangeSlider
  id="price-range"
  label="Price"
  min={0}
  max={500}
  step={10}
  value={filters.priceRange}
  onChange={handlePriceChange}
  formatValue={(v) => `$${v}`}
/>
```

## CSS Classes (BEM)

```scss
// Backdrop (mobile)
.filter-backdrop
.filter-backdrop--visible

// Main Sidebar
.filter-sidebar
.filter-sidebar--open
.filter-sidebar__header
.filter-sidebar__title-row
.filter-sidebar__title-group
.filter-sidebar__icon
.filter-sidebar__title
.filter-sidebar__close
.filter-sidebar__active
.filter-sidebar__active-count
.filter-sidebar__reset
.filter-sidebar__content
.filter-sidebar__checkboxes
.filter-sidebar__decor

// Filter Section
.filter-section
.filter-section__header
.filter-section__title
.filter-section__chevron
.filter-section__chevron--expanded
.filter-section__content
.filter-section__content--expanded

// Checkbox Filter
.checkbox-filter
.checkbox-filter__input
.checkbox-filter__box
.checkbox-filter__label

// Range Slider
.range-slider
.range-slider__track
.range-slider__fill
.range-slider__input
.range-slider__values
.range-slider__value
.range-slider__separator
```

## Responsive Behavior

| Breakpoint        | Behavior                                   |
| ----------------- | ------------------------------------------ |
| Mobile (<1024px)  | Slide-in panel from left, backdrop overlay |
| Desktop (1024px+) | Sticky sidebar, always visible             |

### Mobile Animation

```scss
.filter-sidebar {
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--open {
    transform: translateX(0);
  }
}
```

### Desktop Sticky

```scss
@media (min-width: 1024px) {
  .filter-sidebar {
    position: sticky;
    top: 73px;
    transform: translateX(0);
  }
}
```

## Accessibility

### Semantic Structure

- `<fieldset>` with `<legend>` for filter groups
- `<label>` association with form inputs
- Proper `id` and `for` attributes

### ARIA Attributes

- `aria-expanded` on collapsible section buttons
- `aria-controls` linking buttons to content
- `aria-hidden` on collapsed content
- `aria-label` on close button and range inputs
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` on sliders

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to toggle sections
- Arrow keys for slider adjustment
- Focus-visible indicators

## Usage

```jsx
import FilterSidebar from '../components/FilterSidebar';

function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  return (
    <section className="products">
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(initialFilters)}
      />
      <div className="products__main">{/* Product grid */}</div>
    </section>
  );
}
```

## Filter Logic

The actual filtering happens in the parent component using `filterProducts()` from the products data module:

```javascript
import { filterProducts } from '../data/products';

const filteredProducts = useMemo(() => {
  return filterProducts({
    searchTerm,
    categories: filters.categories,
    priceRange: filters.priceRange,
    polyCountRange: filters.polyCountRange,
    fileFormats: filters.fileFormats,
  });
}, [filters, searchTerm]);
```

## Dependencies

- Product constants from `data/products.js`:
  - `CATEGORIES` - Available category names
  - `FILE_FORMATS` - Available format names
  - `PRICE_RANGE` - Min/max price bounds
  - `POLY_COUNT_RANGE` - Min/max polygon bounds
- Design system SCSS variables and mixins

## Animation Details

### Section Expand/Collapse

```scss
.filter-section__content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;

  &--expanded {
    max-height: 500px;
    opacity: 1;
  }
}
```

### Chevron Rotation

```scss
.filter-section__chevron {
  transition: transform 0.3s ease;

  &--expanded {
    transform: rotate(180deg);
  }
}
```

### Checkbox Animation

```scss
.checkbox-filter__box svg {
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.checkbox-filter__input:checked + .checkbox-filter__box svg {
  opacity: 1;
  transform: scale(1);
}
```

## Reduced Motion Support

```scss
@media (prefers-reduced-motion: reduce) {
  .filter-sidebar,
  .filter-backdrop,
  .filter-section__content,
  .filter-section__chevron,
  .checkbox-filter__box svg {
    transition: none;
  }
}
```
