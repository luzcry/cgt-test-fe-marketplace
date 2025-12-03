import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  products,
  filterProducts,
  PRICE_RANGE,
  POLY_COUNT_RANGE,
} from '../data/products';
import { buildProductListSchema } from '../utils/structuredData';
import {
  FilterIcon,
  SearchIcon,
  CloseIcon,
  SearchEmptyIcon,
} from '../components/Icons/Icons';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import './HomePage.scss';

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

  const filteredProducts = useMemo(() => {
    return filterProducts({ ...filters, searchTerm });
  }, [filters, searchTerm]);

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

  const activeFiltersCount =
    filters.categories.length +
    filters.fileFormats.length +
    (filters.priceRange[0] !== PRICE_RANGE.min ||
    filters.priceRange[1] !== PRICE_RANGE.max
      ? 1
      : 0) +
    (filters.polyCountRange[0] !== POLY_COUNT_RANGE.min ||
    filters.polyCountRange[1] !== POLY_COUNT_RANGE.max
      ? 1
      : 0) +
    (searchTerm ? 1 : 0);

  const structuredData = buildProductListSchema(filteredProducts);

  return (
    <>
      <Helmet>
        <title>3D Marketplace | Premium Digital Assets & 3D Models</title>
        <meta
          name="description"
          content="Discover premium 3D models and digital assets for your creative projects. Browse characters, vehicles, props, and more. Perfect for game development and visualization."
        />
        <link rel="canonical" href={window.location.origin} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="3D Marketplace | Premium Digital Assets"
        />
        <meta
          property="og:description"
          content="Discover premium 3D models and digital assets for your creative projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="3D Marketplace | Premium Digital Assets"
        />
        <meta
          name="twitter:description"
          content="Premium 3D models for game development and visualization."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__background" aria-hidden="true">
            <div className="hero__pattern-grid" />
            <div className="hero__scanlines" />
          </div>

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

          <div className="hero__content">
            <div className="hero__grid">
              <div className="hero__text">
                <span className="hero__badge">Premium 3D Marketplace</span>

                <h1 id="hero-title" className="hero__title">
                  <span className="hero__title-line">Next-Gen</span>
                  <span className="hero__title-line hero__title-gradient">
                    3D Assets
                  </span>
                </h1>

                <p className="hero__description">
                  Professional-grade 3D models optimized for real-time
                  rendering, game development, and digital visualization.
                  Industry-standard formats, instant downloads.
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

        <section className="products" aria-labelledby="products-title">
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={closeFilterSidebar}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="products__main">
            <header className="products__header">
              <div className="products__header-top">
                <div className="products__title-group">
                  <h2 id="products-title" className="products__title">
                    All Models
                  </h2>
                  <p className="products__count">
                    {filteredProducts.length} of {products.length}{' '}
                    {products.length === 1 ? 'model' : 'models'}
                  </p>
                </div>

                <button
                  type="button"
                  className="products__filter-toggle"
                  onClick={toggleFilterSidebar}
                  aria-expanded={isFilterOpen}
                  aria-controls="filter-sidebar"
                >
                  <FilterIcon />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span
                      className="products__filter-badge"
                      aria-label={`${activeFiltersCount} active filters`}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="products__search">
                <SearchIcon className="products__search-icon" />
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
                    <CloseIcon />
                  </button>
                )}
              </div>
            </header>

            {filteredProducts.length > 0 ? (
              <div
                className="products__grid"
                role="list"
                aria-label="Product listings"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="products__empty" role="status" aria-live="polite">
                <SearchEmptyIcon className="products__empty-icon" />
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
