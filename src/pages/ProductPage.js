import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import ModelViewer from '../components/ModelViewer';
import './ProductPage.scss';

/**
 * ProductPage Component
 *
 * Detailed product view with interactive 3D model viewer and purchase options.
 *
 * Features:
 * - Interactive 3D model viewer with Three.js
 * - Fallback to static image for unsupported browsers
 * - Two-column responsive layout
 * - Sticky price/action section
 *
 * SEO Best Practices:
 * - JSON-LD structured data for Product schema
 * - Dynamic meta tags via react-helmet-async
 * - Semantic HTML with proper heading hierarchy
 * - Open Graph and Twitter meta tags
 *
 * Performance Optimizations:
 * - Lazy-loaded 3D models with Suspense
 * - Efficient re-renders with proper component structure
 * - GPU-accelerated CSS animations
 *
 * Accessibility:
 * - ARIA labels on interactive elements
 * - Proper heading hierarchy (h1 > h2)
 * - Keyboard navigable controls
 * - Screen reader announcements for 3D viewer
 */
function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(productId);

  // Not found state
  if (!product) {
    return (
      <div className="product-page product-page--not-found">
        <Helmet>
          <title>Product Not Found | 3D Marketplace</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="product-page__not-found-title">Product Not Found</h1>
        <p className="product-page__not-found-text">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          type="button"
          className="product-page__not-found-btn"
          onClick={() => navigate('/')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  // Features list (can be extended from product data)
  const features = [
    'High-quality digital asset',
    'Instant download after purchase',
    'Lifetime access',
    'Commercial license included',
  ];

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: '3D Marketplace',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: '3D Marketplace',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: '5',
      worstRating: '1',
      ratingCount: Math.floor(product.rating * 20), // Simulated review count
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Polygon Count',
        value: product.polyCount.toLocaleString(),
      },
      {
        '@type': 'PropertyValue',
        name: 'File Formats',
        value: product.fileFormat.join(', '),
      },
      {
        '@type': 'PropertyValue',
        name: '3D Preview Available',
        value: product.model ? 'Yes' : 'No',
      },
    ],
  };

  // Meta description for SEO
  const metaDescription = `${product.name} - ${product.description} Available in ${product.fileFormat.join(', ')} formats. ${product.polyCount.toLocaleString()} polygons. $${product.price} USD.`;

  return (
    <main className="product-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{product.name} | 3D Marketplace</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`3D model, ${product.category}, ${product.tags.join(', ')}, ${product.fileFormat.join(', ')}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta
          property="og:title"
          content={`${product.name} | 3D Marketplace`}
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={product.image} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content={product.currency} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${product.name} | 3D Marketplace`}
        />
        <meta name="twitter:description" content={metaDescription} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Back Navigation */}
      <nav className="product-page__nav" aria-label="Breadcrumb">
        <Link to="/" className="product-page__back">
          <svg
            className="product-page__back-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </nav>

      {/* Main Content */}
      <div className="product-page__content">
        <div className="product-page__grid">
          {/* Left: 3D Model Viewer */}
          <div className="product-page__viewer">
            <ModelViewer
              model={product.model}
              productName={product.name}
              fallbackImage={product.image}
              previewColor={product.previewColor}
            />
            <p className="product-page__image-hint">
              {product.model
                ? 'Interactive 3D preview available'
                : 'High-resolution preview'}
            </p>
          </div>

          {/* Right: Product Details */}
          <article
            className="product-page__details"
            itemScope
            itemType="https://schema.org/Product"
          >
            {/* Hidden structured data */}
            <meta itemProp="sku" content={product.id} />
            <meta itemProp="image" content={product.image} />

            {/* Header */}
            <header className="product-page__header">
              {product.category && (
                <p className="product-page__category" itemProp="category">
                  {product.category}
                </p>
              )}
              <h1 className="product-page__title" itemProp="name">
                {product.name}
              </h1>
              {product.rating && (
                <div
                  className="product-page__rating"
                  itemProp="aggregateRating"
                  itemScope
                  itemType="https://schema.org/AggregateRating"
                >
                  <meta itemProp="ratingValue" content={product.rating} />
                  <meta itemProp="bestRating" content="5" />
                  <div className="product-page__rating-stars">
                    <svg
                      className="product-page__rating-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="product-page__rating-value">
                      {product.rating}
                    </span>
                  </div>
                  <span className="product-page__rating-count">
                    (Premium Asset)
                  </span>
                </div>
              )}
            </header>

            {/* Description */}
            <p className="product-page__description" itemProp="description">
              {product.description}
            </p>

            {/* Tags */}
            <div className="product-page__tags" aria-label="Product tags">
              {product.tags.map((tag) => (
                <span key={tag} className="product-page__tag">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Technical Specifications */}
            <section
              className="product-page__specs"
              aria-labelledby="specs-title"
            >
              <h2 id="specs-title" className="product-page__specs-title">
                Technical Specifications
              </h2>
              <div className="product-page__specs-grid">
                <div>
                  <p className="product-page__spec-label">Category</p>
                  <p className="product-page__spec-value">{product.category}</p>
                </div>
                <div>
                  <p className="product-page__spec-label">Polygons</p>
                  <p className="product-page__spec-value">
                    {product.polyCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="product-page__spec-label">Formats</p>
                  <p className="product-page__spec-value">
                    {product.fileFormat.join(', ')}
                  </p>
                </div>
                <div>
                  <p className="product-page__spec-label">License</p>
                  <p className="product-page__spec-value">Commercial</p>
                </div>
              </div>
            </section>

            {/* 3D Preview Badge */}
            {product.model && (
              <div
                className="product-page__preview-badge"
                aria-label="3D preview available"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>Interactive 3D Preview Available</span>
              </div>
            )}

            {/* Features */}
            <section
              className="product-page__features"
              aria-labelledby="features-title"
            >
              <h2 id="features-title" className="product-page__features-title">
                What's Included
              </h2>
              {features.map((feature) => (
                <div key={feature} className="product-page__feature">
                  <span
                    className="product-page__feature-icon"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="product-page__feature-text">{feature}</span>
                </div>
              ))}
            </section>

            {/* Sticky Price & Actions */}
            <div
              className="product-page__actions"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content={product.currency} />
              <meta
                itemProp="availability"
                content="https://schema.org/InStock"
              />
              <div className="product-page__price-row">
                <div>
                  <p className="product-page__price-label">Price</p>
                  <p
                    className="product-page__price"
                    itemProp="price"
                    content={product.price}
                  >
                    ${product.price}
                  </p>
                </div>
              </div>
              <div className="product-page__buttons">
                <button
                  type="button"
                  className="product-page__add-btn"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.name} to cart for $${product.price}`}
                >
                  <svg
                    className="product-page__add-btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
