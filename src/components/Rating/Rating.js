import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '../Icons';
import './Rating.scss';

/**
 * Rating Component
 *
 * Displays a star rating with optional label.
 * Supports both display and structured data for SEO.
 *
 * Features:
 * - Configurable max rating (default: 5)
 * - Optional label/subtitle text
 * - Schema.org structured data support
 * - Accessible with proper ARIA labels
 * - Forwards refs for parent component access
 */
const Rating = memo(
  forwardRef(function Rating(
    {
      value,
      maxValue = 5,
      label,
      showValue = true,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`rating rating--${size} ${className}`}
        itemProp="aggregateRating"
        itemScope
        itemType="https://schema.org/AggregateRating"
        {...props}
      >
        <meta itemProp="ratingValue" content={value} />
        <meta itemProp="bestRating" content={maxValue} />
        <div className="rating__stars">
          <StarIcon className="rating__icon" />
          {showValue && <span className="rating__value">{value}</span>}
        </div>
        {label && <span className="rating__label">{label}</span>}
      </div>
    );
  })
);

Rating.displayName = 'Rating';

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Rating;
