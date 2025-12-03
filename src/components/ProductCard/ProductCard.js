import { memo, lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useExperiment, EXPERIMENTS } from '../../context/ABTestContext';
import { CartIcon, PlusIcon, StarIcon, LayersIcon } from '../Icons';
import './ProductCard.scss';

// Lazy load ModelPreview - only imported when actually rendered
const ModelPreview = lazy(() => import('../ModelPreview'));

/**
 * ProductCard Component with A/B Testing
 *
 * Experiment: PRODUCT_CARD_CTA
 * Variants:
 * - control: "Add to Cart" with cart icon (original)
 * - quick_add: "Quick Add" with plus icon, more compact style
 * - price_in_button: "Add • $XX" showing price directly in button
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

  // A/B Test: Get variant and track exposure
  const { variant, trackConversion } = useExperiment(
    EXPERIMENTS.PRODUCT_CARD_CTA.id
  );

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
    // Track conversion with variant info
    trackConversion('add_to_cart', {
      productId: product.id,
      price: product.price,
    });
    addToCart(product);
  };

  // Animation delay based on card index for staggered entrance
  const animationDelay = `${index * 0.05}s`;

  // Render variant-specific CTA button
  const renderCTAButton = () => {
    switch (variant) {
      case 'quick_add':
        return (
          <button
            type="button"
            className="product-card__btn product-card__btn--quick"
            onClick={handleAddToCart}
            aria-label={`Quick add ${product.name} to cart`}
            data-testid="product-card-cta"
          >
            <PlusIcon className="product-card__btn-icon" />
            Quick Add
          </button>
        );

      case 'price_in_button':
        return (
          <button
            type="button"
            className="product-card__btn product-card__btn--price"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart for $${product.price}`}
            data-testid="product-card-cta"
          >
            <CartIcon className="product-card__btn-icon" />
            <span className="product-card__btn-text">Add</span>
            <span className="product-card__btn-separator">•</span>
            <span className="product-card__btn-price">${product.price}</span>
          </button>
        );

      default: // control
        return (
          <button
            type="button"
            className="product-card__btn"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart for $${product.price}`}
            data-testid="product-card-cta"
          >
            <CartIcon className="product-card__btn-icon" />
            Add to Cart
          </button>
        );
    }
  };

  return (
    <article
      className={`product-card product-card--cta-${variant}`}
      style={{ '--animation-delay': animationDelay }}
      itemScope
      itemType="https://schema.org/Product"
      role="listitem"
      data-variant={variant}
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
                  <div
                    className="product-card__preview-pattern"
                    aria-hidden="true"
                  />
                  <span
                    className="product-card__preview-text"
                    aria-hidden="true"
                  >
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
                <div
                  className="product-card__preview-pattern"
                  aria-hidden="true"
                />
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
          <div
            className="product-card__rating"
            aria-label={`Rating: ${product.rating} out of 5 stars`}
          >
            <StarIcon className="product-card__rating-star" />
            <span
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
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
            <span
              className="product-card__spec"
              aria-label={`${product.polyCount.toLocaleString()} polygons`}
            >
              <LayersIcon className="product-card__spec-icon" />
              {product.polyCount.toLocaleString()}
            </span>
            <span className="product-card__spec product-card__spec--format">
              {product.fileFormat[0]}
            </span>
          </div>

          {/* Price - Hidden in price_in_button variant */}
          {variant !== 'price_in_button' && (
            <div
              className="product-card__price"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content={product.currency} />
              <span itemProp="price" content={product.price}>
                ${product.price}
              </span>
              <meta
                itemProp="availability"
                content="https://schema.org/InStock"
              />
            </div>
          )}
        </div>
      </Link>

      {/* CTA Button - Outside Link for proper semantics */}
      <div className="product-card__cta">{renderCTAButton()}</div>

      {/* Hover Overlay Effect */}
      <div className="product-card__hover-overlay" aria-hidden="true" />
    </article>
  );
});

export default ProductCard;
