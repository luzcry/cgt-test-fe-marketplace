import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './InfoGrid.scss';

/**
 * InfoItem Component
 *
 * A single label-value pair for displaying information.
 * Can be used standalone or within InfoGrid.
 *
 * Features:
 * - Consistent label-value display
 * - Forwards refs for parent component access
 */
const InfoItem = memo(
  forwardRef(function InfoItem({ label, value, className = '', ...props }, ref) {
    return (
      <div ref={ref} className={`info-item ${className}`} {...props}>
        <p className="info-item__label">{label}</p>
        <p className="info-item__value">{value}</p>
      </div>
    );
  })
);

InfoItem.displayName = 'InfoItem';

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

/**
 * InfoGrid Component
 *
 * A grid layout for displaying multiple label-value pairs.
 * Useful for contact info, order details, specifications, etc.
 *
 * Features:
 * - Responsive column layouts (1-4 columns)
 * - Consistent styling for label-value pairs
 * - Forwards refs for parent component access
 */
const InfoGrid = memo(
  forwardRef(function InfoGrid(
    { items = [], columns = 2, className = '', ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`info-grid info-grid--cols-${columns} ${className}`}
        {...props}
      >
        {items.map((item, index) => (
          <InfoItem
            key={item.label || index}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    );
  })
);

InfoGrid.displayName = 'InfoGrid';

InfoGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ),
  columns: PropTypes.oneOf([1, 2, 3, 4]),
  className: PropTypes.string,
};

export { InfoItem };
export default InfoGrid;
