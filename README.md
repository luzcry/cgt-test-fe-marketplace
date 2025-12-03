# 3D Marketplace - Enhanced MVP

A modern, SEO-optimized e-commerce marketplace for 3D models and digital assets built with React. Features advanced filtering, search functionality, and comprehensive SEO implementation.

## ✨ Features

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
- **3D Model Preview**: Live 3D model snapshots with WebGL
- **Lazy Loading**: Images and 3D models load on-demand
- **Staggered Animations**: Cards animate in sequence
- **Rich Information**: Displays polygon count, file formats, ratings
- **Hover Effects**: Smooth lift and glow animations

### 🛒 Complete Checkout Flow
- **Multi-step Checkout**: Shipping → Payment → Review → Confirmation
- **Form Validation**: Real-time field validation with error messages
- **Payment Processing**: Card type detection, secure input formatting
- **Promo Codes**: Apply discount codes with instant validation
- **Order Confirmation**: Animated success page with order timeline
- **Cart Notifications**: Toast notifications for cart actions

### 🎮 3D Model Viewing
- **Interactive Viewer**: Full 3D model interaction on product pages
- **Orbit Controls**: Rotate, zoom, and pan models
- **Animation Playback**: Plays embedded model animations
- **Wireframe Mode**: Toggle wireframe view
- **Fullscreen Mode**: Immersive full-screen viewing
- **Snapshot Caching**: Efficient preview generation for product cards

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
- **Three.js 0.181.2** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **SASS 1.94.2** - CSS preprocessing with ITCSS architecture
- **React Testing Library** - Component testing
- **Create React App** - Build tooling

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ProductCard/          # SEO-optimized product card
│   ├── FilterSidebar/        # Advanced filter panel
│   ├── Header/               # Navigation header
│   ├── CartNotification/     # Toast notification for cart actions
│   ├── ModelPreview/         # Lightweight 3D preview for cards
│   └── ModelViewer/          # Full interactive 3D viewer
├── pages/
│   ├── HomePage.js           # Landing page with filters
│   ├── ProductPage.js        # Product detail with 3D viewer
│   ├── CartPage.js           # Shopping cart
│   └── CheckoutPage.js       # Multi-step checkout flow
├── context/
│   ├── CartContext.js        # Cart state management
│   └── CheckoutContext.js    # Checkout flow state management
├── services/
│   └── checkoutService.js    # Checkout API and validation
├── data/
│   └── products.js           # Product catalog (12 products)
├── styles/
│   ├── main.scss             # ITCSS entry point
│   ├── _variables.scss       # Design tokens
│   ├── _mixins.scss          # Reusable patterns
│   ├── _base.scss            # Reset & typography
│   ├── _animations.scss      # Keyframe animations
│   └── _utilities.scss       # Utility classes
├── docs/                     # Component documentation
│   ├── App.md
│   ├── HomePage.md
│   ├── ProductPage.md
│   ├── CartPage.md
│   ├── CheckoutPage.md
│   ├── ProductCard.md
│   ├── FilterSidebar.md
│   ├── Header.md
│   ├── CartNotification.md
│   ├── ModelPreview.md
│   ├── ModelViewer.md
│   └── SEO.md
└── __tests__/                # Test files
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

### Code Quality

```bash
npm run lint          # Analyze code (like Flutter analyze)
npm run lint:fix      # Auto-fix lint issues
npm run format        # Format all code
npm run format:check  # Check formatting without changing files
npm run test:ci       # Run tests in CI mode (non-interactive)
```

## 🧪 Testing

All tests passing: **208 tests across 10 test suites**

Test coverage includes:
- Component rendering
- User interactions (click, type, etc.)
- Cart functionality (add, remove, update)
- Checkout flow (shipping, payment, review, confirmation)
- Form validation and error handling
- Filtering and search
- Context providers (CartContext, CheckoutContext)
- Service functions (checkoutService)
- Accessibility features
- SEO markup presence

Run tests:
```bash
npm test
```

### Test Cards

Use these card numbers to test the checkout flow:

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | Success |
| 4242 4242 4242 4242 | Visa | Success |
| 5500 0000 0000 0004 | Mastercard | Success |
| 3711 1111 1111 111 | Amex | Success (use 4-digit CVV) |

## 📚 Documentation

Comprehensive documentation available in `src/docs/`:

### Pages
- **[HomePage.md](src/docs/HomePage.md)** - Landing page with filters
- **[ProductPage.md](src/docs/ProductPage.md)** - Product detail page with 3D viewer
- **[CartPage.md](src/docs/CartPage.md)** - Shopping cart
- **[CheckoutPage.md](src/docs/CheckoutPage.md)** - Multi-step checkout flow

### Components
- **[ProductCard.md](src/docs/ProductCard.md)** - Product card component
- **[FilterSidebar.md](src/docs/FilterSidebar.md)** - Filter panel
- **[Header.md](src/docs/Header.md)** - Navigation header
- **[CartNotification.md](src/docs/CartNotification.md)** - Cart toast notifications
- **[ModelPreview.md](src/docs/ModelPreview.md)** - Lightweight 3D preview
- **[ModelViewer.md](src/docs/ModelViewer.md)** - Interactive 3D model viewer

### Guides
- **[SEO.md](src/docs/SEO.md)** - SEO implementation guide
- **[App.md](src/docs/App.md)** - Application structure

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

Using **React Context API** for global state:

### CartContext
- Add to cart with notifications
- Remove from cart
- Update quantity
- Clear cart
- Calculate totals
- Toast notifications

### CheckoutContext
- Multi-step navigation (Shipping → Payment → Review → Confirmation)
- Form state management
- Field validation and error handling
- Promo code application
- Order processing
- Loading states

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
## 📄 License

This project is for testing and educational purposes.

## 🙏 Acknowledgments

- Inspired by modern e-commerce platforms
- Built with React best practices
- SEO guidance from Google Search Central
- Design system influenced by tech-forward aesthetics
