import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { products, filterProducts, PRICE_RANGE, POLY_COUNT_RANGE } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import './HomePage.scss';

/**
 * HomePage Component
 *
 * Landing page with tech-forward hero section, filter sidebar, and product grid.
 *
 * SEO Features:
 * - Dynamic meta tags via react-helmet-async
 * - JSON-LD structured data for product listings
 * - Semantic HTML with proper heading hierarchy
 * - Accessible markup with ARIA labels
 *
 * Performance Features:
 * - Memoized filtered products
 * - Stable callback functions
 * - Lazy-loaded product images
 * - CSS-based animations
 */

// Initial filter state
const initialFilters = {
  categories: [],
  priceRange: [PRICE_RANGE.min, PRICE_RANGE.max],
  polyCountRange: [POLY_COUNT_RANGE.min, POLY_COUNT_RANGE.max],
  fileFormats: [],
};

function HomePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered products for performance
  const filteredProducts = useMemo(() => {
    return filterProducts({ ...filters, searchTerm });
  }, [filters, searchTerm]);

  // Stable callbacks to prevent re-renders
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
  }, []);

  const toggleFilterSidebar = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const closeFilterSidebar = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Calculate active filters count for display
  const activeFiltersCount =
    filters.categories.length +
    filters.fileFormats.length +
    (filters.priceRange[0] !== PRICE_RANGE.min || filters.priceRange[1] !== PRICE_RANGE.max ? 1 : 0) +
    (filters.polyCountRange[0] !== POLY_COUNT_RANGE.min || filters.polyCountRange[1] !== POLY_COUNT_RANGE.max ? 1 : 0) +
    (searchTerm ? 1 : 0);

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '3D Models Marketplace',
    description: 'Premium 3D models and digital assets for creative professionals',
    numberOfItems: filteredProducts.length,
    itemListElement: filteredProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${window.location.origin}/products/${product.id}`,
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          bestRating: 5,
          worstRating: 1,
        },
      },
    })),
  };

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>3D Marketplace | Premium Digital Assets & 3D Models</title>
        <meta
          name="description"
          content="Discover premium 3D models and digital assets for your creative projects. Browse characters, vehicles, props, and more. Perfect for game development and visualization."
        />
        <link rel="canonical" href={window.location.origin} />

        {/* Open Graph */}
        <meta property="og:title" content="3D Marketplace | Premium Digital Assets" />
        <meta
          property="og:description"
          content="Discover premium 3D models and digital assets for your creative projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="3D Marketplace | Premium Digital Assets" />
        <meta
          name="twitter:description"
          content="Premium 3D models for game development and visualization."
        />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="home">
        {/* Hero Section */}
        <section className="hero" aria-labelledby="hero-title">
          {/* Animated Background */}
          <div className="hero__background" aria-hidden="true">
            <div className="hero__pattern-grid" />
            <div className="hero__scanlines" />
          </div>

          {/* Floating Particles */}
          <div className="hero__particles" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="hero__particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${50 + Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="hero__content">
            <div className="hero__grid">
              {/* Left: Text Content */}
              <div className="hero__text">
                <span className="hero__badge">Premium 3D Marketplace</span>

                <h1 id="hero-title" className="hero__title">
                  <span className="hero__title-line">Next-Gen</span>
                  <span className="hero__title-line hero__title-gradient">3D Assets</span>
                </h1>

                <p className="hero__description">
                  Professional-grade 3D models optimized for real-time rendering,
                  game development, and digital visualization. Industry-standard
                  formats, instant downloads.
                </p>

                <div className="hero__features">
                  <div className="hero__feature">
                    <span className="hero__feature-dot" aria-hidden="true" />
                    <span>High-Poly Models</span>
                  </div>
                  <div className="hero__feature">
                    <span className="hero__feature-dot" aria-hidden="true" />
                    <span>PBR Textures</span>
                  </div>
                  <div className="hero__feature">
                    <span className="hero__feature-dot" aria-hidden="true" />
                    <span>Multi-Format</span>
                  </div>
                </div>

                <p className="hero__stats">
                  <strong>{products.length}</strong> premium assets available
                </p>
              </div>

              {/* Right: Visual Element */}
              <div className="hero__visual" aria-hidden="true">
                <div className="hero__visual-ring" />
                <div className="hero__visual-ring hero__visual-ring--inner" />
                <div className="hero__visual-center">
                  <span className="hero__visual-text">3D</span>
                </div>
                <div className="hero__corner hero__corner--tl" />
                <div className="hero__corner hero__corner--tr" />
                <div className="hero__corner hero__corner--bl" />
                <div className="hero__corner hero__corner--br" />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section with Filter Sidebar */}
        <section className="products" aria-labelledby="products-title">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={closeFilterSidebar}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* Main Content */}
          <div className="products__main">
            {/* Header with Search and Filter Toggle */}
            <header className="products__header">
              <div className="products__header-top">
                <div className="products__title-group">
                  <h2 id="products-title" className="products__title">All Models</h2>
                  <p className="products__count">
                    {filteredProducts.length} of {products.length}{' '}
                    {products.length === 1 ? 'model' : 'models'}
                  </p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  className="products__filter-toggle"
                  onClick={toggleFilterSidebar}
                  aria-expanded={isFilterOpen}
                  aria-controls="filter-sidebar"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="products__filter-badge" aria-label={`${activeFiltersCount} active filters`}>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Search Bar */}
              <div className="products__search">
                <svg
                  className="products__search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  className="products__search-input"
                  placeholder="Search models, categories, tags..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search products"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="products__search-clear"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </header>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="products__grid" role="list" aria-label="Product listings">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="products__empty" role="status" aria-live="polite">
                <svg
                  className="products__empty-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <p className="products__empty-title">No models found</p>
                <p className="products__empty-text">
                  Try adjusting your filters or search term
                </p>
                <button
                  type="button"
                  className="products__empty-reset"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
