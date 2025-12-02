import React, { memo, lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.scss';

// Lazy load ModelPreview - only imported when actually rendered
const ModelPreview = lazy(() => import('../ModelPreview'));

/**
 * ProductCard Component
 *
 * SEO Best Practices:
 * - Semantic HTML with proper heading hierarchy (h3 for product names)
 * - Schema.org Product markup via data attributes
 * - Descriptive alt text and accessible labels
 * - Proper link structure for crawlability
 *
 * Performance Best Practices:
 * - React.memo for preventing unnecessary re-renders
 * - Lazy loading for images
 * - CSS-based animations (hardware accelerated)
 * - Minimal DOM depth
 */
const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  // Defer 3D loading until after initial paint for better LCP
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback to load 3D after page is interactive
    // Falls back to setTimeout for browsers without support
    const enablePreview = () => setEnable3D(true);

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(enablePreview, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(enablePreview, 1000);
      return () => clearTimeout(id);
    }
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Animation delay based on card index for staggered entrance
  const animationDelay = `${index * 0.05}s`;

  return (
    <article
      className="product-card"
      style={{ '--animation-delay': animationDelay }}
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link
        to={`/products/${product.id}`}
        className="product-card__link"
        aria-label={`View ${product.name} details - $${product.price}`}
      >
        {/* Preview Section */}
        <div className="product-card__preview">
          {/* 3D Model Preview (deferred) or Static Placeholder */}
          {product.model && enable3D ? (
            <Suspense
              fallback={
                <div
                  className="product-card__preview-bg"
                  style={{ background: product.previewColor }}
                  aria-hidden="true"
                >
                  <div className="product-card__preview-pattern" aria-hidden="true" />
                  <span className="product-card__preview-text" aria-hidden="true">
                    3D
                  </span>
                </div>
              }
            >
              <ModelPreview
                model={product.model}
                fallbackImage={product.image}
                previewColor={product.previewColor}
                alt={`${product.name} - ${product.category} 3D model`}
              />
            </Suspense>
          ) : (
            <>
              <div
                className="product-card__preview-bg"
                style={{ background: product.previewColor }}
                aria-hidden="true"
              >
                <div className="product-card__preview-pattern" aria-hidden="true" />
                <span className="product-card__preview-text" aria-hidden="true">
                  3D
                </span>
              </div>
              {product.image && (
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.category} 3D model`}
                  className="product-card__image"
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                />
              )}
            </>
          )}

          {/* Rating Badge */}
          <div className="product-card__rating" aria-label={`Rating: ${product.rating} out of 5 stars`}>
            <svg
              className="product-card__rating-star"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <meta itemProp="ratingValue" content={product.rating} />
              <meta itemProp="bestRating" content="5" />
              {product.rating}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="product-card__content">
          <p className="product-card__category">{product.category}</p>

          <h3 className="product-card__name" itemProp="name">
            {product.name}
          </h3>

          <p className="product-card__description" itemProp="description">
            {product.description}
          </p>

          {/* Specs Row */}
          <div className="product-card__specs">
            <span className="product-card__spec" aria-label={`${product.polyCount.toLocaleString()} polygons`}>
              <svg className="product-card__spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {product.polyCount.toLocaleString()}
            </span>
            <span className="product-card__spec product-card__spec--format">
              {product.fileFormat[0]}
            </span>
          </div>

          {/* Price */}
          <div className="product-card__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content={product.currency} />
            <span itemProp="price" content={product.price}>
              ${product.price}
            </span>
            <meta itemProp="availability" content="https://schema.org/InStock" />
          </div>
        </div>
      </Link>

      {/* CTA Button - Outside Link for proper semantics */}
      <div className="product-card__cta">
        <button
          type="button"
          className="product-card__btn"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart for $${product.price}`}
        >
          <svg className="product-card__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>
      </div>

      {/* Hover Overlay Effect */}
      <div className="product-card__hover-overlay" aria-hidden="true" />
    </article>
  );
});

export default ProductCard;
