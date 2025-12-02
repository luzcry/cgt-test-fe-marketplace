# 3D Marketplace - Enhanced MVP

A modern, SEO-optimized e-commerce marketplace for 3D models and digital assets built with React. Features advanced filtering, search functionality, and comprehensive SEO implementation.

## ✨ New Features

### 🔍 Advanced Filtering System
- **Category Filter**: Filter by product categories (Characters, Vehicles, Props, Architecture, Nature, Sci-Fi)
- **Price Range Slider**: Dual-thumb slider for price filtering ($0 - $500)
- **Polygon Count Filter**: Filter by polygon count (0 - 100,000)
- **File Format Filter**: Filter by available formats (FBX, OBJ, GLTF, BLEND, MAX)
- **Real-time Search**: Search across product names, categories, and tags
- **Active Filter Badge**: Shows count of active filters
- **One-click Reset**: Clear all filters instantly

### 🎨 Enhanced Product Cards
- **SEO-Optimized**: Full Schema.org Product microdata
- **Lazy Loading**: Images load on-demand for better performance
- **Staggered Animations**: Cards animate in sequence
- **Rich Information**: Displays polygon count, file formats, ratings
- **Hover Effects**: Smooth lift and glow animations

### 📱 Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Slide-in Filter Panel**: Mobile-friendly filter sidebar
- **Sticky Desktop Sidebar**: Filter panel stays visible while scrolling
- **Adaptive Grid**: 1 → 2 → 3 → 4 columns based on viewport

### 🚀 SEO & Performance
- **Dynamic Meta Tags**: Per-page SEO via react-helmet-async
- **Structured Data**: JSON-LD for rich search results
- **Open Graph Tags**: Optimized social media sharing
- **Twitter Cards**: Enhanced Twitter previews
- **Lazy Loading**: Images and components load on-demand
- **Memoization**: Optimized re-renders with React.memo and useMemo
- **CSS Animations**: Hardware-accelerated transforms

## 📦 Tech Stack

- **React 18.1.0** - UI library
- **React Router DOM 6.30.2** - Client-side routing
- **react-helmet-async** - Dynamic SEO meta tags
- **SASS 1.94.2** - CSS preprocessing with ITCSS architecture
- **React Testing Library** - Component testing
- **Create React App** - Build tooling

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ProductCard/          # SEO-optimized product card
│   │   ├── ProductCard.js
│   │   ├── ProductCard.scss
│   │   └── index.js
│   ├── FilterSidebar/         # Advanced filter panel
│   │   ├── FilterSidebar.js
│   │   ├── FilterSidebar.scss
│   │   └── index.js
│   └── Header/                # Navigation header
├── pages/
│   ├── HomePage.js            # Landing page with filters
│   ├── ProductPage.js         # Product detail page
│   └── CartPage.js            # Shopping cart
├── context/
│   └── CartContext.js         # Cart state management
├── data/
│   └── products.js            # Product catalog (12 products)
├── styles/
│   ├── main.scss              # ITCSS entry point
│   ├── _variables.scss        # Design tokens
│   ├── _mixins.scss           # Reusable patterns
│   ├── _base.scss             # Reset & typography
│   ├── _animations.scss       # Keyframe animations
│   └── _utilities.scss        # Utility classes
├── docs/                      # Component documentation
│   ├── HomePage.md
│   ├── ProductCard.md
│   ├── FilterSidebar.md
│   ├── SEO.md
│   ├── ProductPage.md
│   ├── CartPage.md
│   ├── Header.md
│   └── App.md
└── __tests__/                 # Test files
```

## 🎯 Key Features

### Cart Functionality
- Add products to cart with quantity tracking
- Update quantities (increase/decrease)
- Remove individual items
- Clear entire cart
- Real-time total calculation with tax
- Persistent cart state via Context API

### Product Filtering
- Multi-criteria filtering (category, price, polygon count, format)
- Real-time search across multiple fields
- Filter combination (AND logic)
- Empty state with reset option
- Filter count indicator

### SEO Implementation
- Static meta tags in `public/index.html`
- Dynamic per-page meta tags via Helmet
- JSON-LD structured data for products
- Schema.org Product microdata on cards
- Open Graph tags for social sharing
- Twitter Card tags
- Semantic HTML structure
- Lazy loading for images

### Performance Optimizations
- React.memo on ProductCard and FilterSidebar
- useMemo for filtered products
- useCallback for stable event handlers
- CSS-only animations (hardware accelerated)
- Code splitting by route
- Font preconnection
- Image lazy loading

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cgt-test-fe-marketplace
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm test -- --watchAll=false`
Runs all tests once without watch mode

### `npm run build`
Builds the app for production to the `build` folder

## 🧪 Testing

All tests passing: **74 tests across 6 test suites**

Test coverage includes:
- Component rendering
- User interactions (click, type, etc.)
- Cart functionality (add, remove, update)
- Filtering and search
- Accessibility features
- SEO markup presence

Run tests:
```bash
npm test
```

## 📚 Documentation

Comprehensive documentation available in `src/docs/`:

- **[HomePage.md](src/docs/HomePage.md)** - Landing page with filters
- **[ProductCard.md](src/docs/ProductCard.md)** - Product card component
- **[FilterSidebar.md](src/docs/FilterSidebar.md)** - Filter panel
- **[SEO.md](src/docs/SEO.md)** - SEO implementation guide
- **[ProductPage.md](src/docs/ProductPage.md)** - Product detail page
- **[CartPage.md](src/docs/CartPage.md)** - Shopping cart
- **[Header.md](src/docs/Header.md)** - Navigation header

## 🎨 Design System

### Colors
- **Primary**: Chrome Silver (#C0C5CE)
- **Accent**: Electric Blue (#3B9FF3)
- **Background**: Deep Navy (#0A0C14)
- **Text**: Near White (#F8F9FA)

### Typography
- **Display Font**: Orbitron (headings, tech-forward)
- **Body Font**: Inter (content, readability)

### Spacing
8px base unit with consistent scale (4px, 8px, 12px, 16px, 24px, 32px, etc.)

### Animations
- Fade in up (cards entrance)
- Staggered delays (sequential reveals)
- Hover lifts (card interactions)
- Smooth transitions (all interactive elements)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus-visible indicators
- Skip links for keyboard users
- Reduced motion support
- Screen reader friendly
- Color contrast compliance

## 🔍 SEO Features

### Static SEO (index.html)
- Meta title and description
- Keywords
- Author information
- Canonical URL
- Open Graph tags
- Twitter Cards
- Theme color
- Robots directives

### Dynamic SEO (via Helmet)
- Per-page titles
- Per-page descriptions
- Dynamic canonical URLs
- Page-specific Open Graph data
- JSON-LD structured data

### Structured Data
- ItemList schema for product listings
- Product schema with microdata
- Offer schema with price and availability
- AggregateRating schema

## 📈 Performance Metrics

Optimizations implemented:
- ✅ Component memoization (React.memo)
- ✅ Hook optimizations (useMemo, useCallback)
- ✅ Image lazy loading
- ✅ Font preconnection
- ✅ CSS animations (GPU accelerated)
- ✅ Code splitting by route
- ✅ Minimal bundle size
- ✅ Reduced motion support

## 🔄 State Management

Using **React Context API** for global cart state:
- Add to cart
- Remove from cart
- Update quantity
- Clear cart
- Calculate totals

No external state management library required for this MVP scope.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Product Data Structure

```javascript
{
  id: 'cyber-warrior',
  name: 'Cyber Warrior',
  price: 89,
  currency: 'USD',
  image: '/path/to/image.jpg',
  description: 'Product description...',
  category: 'Characters',
  rating: 4.8,
  previewColor: 'linear-gradient(...)',
  polyCount: 45000,
  fileFormat: ['FBX', 'OBJ', 'BLEND'],
  tags: ['cyberpunk', 'character', 'rigged'],
  featured: true
}
```

## 🚧 Future Enhancements

- [ ] User authentication
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Advanced sorting options
- [ ] Multiple images per product
- [ ] 3D model preview viewer
- [ ] Payment integration
- [ ] Order history
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] A/B testing
- [ ] Internationalization (i18n)

## 📄 License

This project is for testing and educational purposes.

## 🙏 Acknowledgments

- Inspired by modern e-commerce platforms
- Built with React best practices
- SEO guidance from Google Search Central
- Design system influenced by tech-forward aesthetics
