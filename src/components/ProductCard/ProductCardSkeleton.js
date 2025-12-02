import React, { memo } from 'react';
import './ProductCardSkeleton.scss';

/**
 * ProductCardSkeleton Component
 *
 * Displays a shimmer loading placeholder that matches the ProductCard layout.
 * Used during initial page load for a polished loading experience.
 */
const ProductCardSkeleton = memo(function ProductCardSkeleton({ index = 0 }) {
  // Staggered animation delay for cascade effect
  const animationDelay = `${index * 0.1}s`;

  return (
    <article
      className="product-card-skeleton"
      style={{ '--animation-delay': animationDelay }}
      aria-hidden="true"
    >
      {/* Preview Section */}
      <div className="product-card-skeleton__preview">
        <div className="product-card-skeleton__shimmer" />
        {/* Rating Badge Placeholder */}
        <div className="product-card-skeleton__rating" />
      </div>

      {/* Content Section */}
      <div className="product-card-skeleton__content">
        {/* Category */}
        <div className="product-card-skeleton__category" />

        {/* Name */}
        <div className="product-card-skeleton__name" />

        {/* Description - 2 lines */}
        <div className="product-card-skeleton__description">
          <div className="product-card-skeleton__line product-card-skeleton__line--full" />
          <div className="product-card-skeleton__line product-card-skeleton__line--partial" />
        </div>

        {/* Specs Row */}
        <div className="product-card-skeleton__specs">
          <div className="product-card-skeleton__spec" />
          <div className="product-card-skeleton__spec product-card-skeleton__spec--small" />
        </div>

        {/* Price */}
        <div className="product-card-skeleton__price" />
      </div>

      {/* CTA Button */}
      <div className="product-card-skeleton__cta">
        <div className="product-card-skeleton__btn" />
      </div>
    </article>
  );
});

export default ProductCardSkeleton;
