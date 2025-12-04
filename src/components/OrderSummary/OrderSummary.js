import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './OrderSummary.scss';

/**
 * OrderSummary Component
 *
 * Displays a list of price/value line items commonly used in cart and checkout.
 * Supports subtotal, tax, discount, shipping, and total display.
 *
 * Features:
 * - Flexible line items with label/value pairs
 * - Special styling for totals and discounts
 * - Optional children slot for action buttons
 * - Forwards refs for parent component access
 */
const OrderSummary = memo(
  forwardRef(function OrderSummary(
    {
      title = 'Order Summary',
      items = [],
      className = '',
      children,
      headingLevel = 2,
      ...props
    },
    ref
  ) {
    const HeadingTag = `h${headingLevel}`;

    return (
      <div ref={ref} className={`order-summary ${className}`} {...props}>
        {title && (
          <HeadingTag className="order-summary__title">{title}</HeadingTag>
        )}
        <div className="order-summary__lines">
          {items.map((item, index) => (
            <div
              key={item.label || index}
              className={`order-summary__line ${item.isTotal ? 'order-summary__line--total' : ''} ${item.isDiscount ? 'order-summary__line--discount' : ''}`}
            >
              <span className="order-summary__label">{item.label}</span>
              <span className="order-summary__value">{item.value}</span>
            </div>
          ))}
        </div>
        {children && <div className="order-summary__actions">{children}</div>}
      </div>
    );
  })
);

OrderSummary.displayName = 'OrderSummary';

OrderSummary.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      isTotal: PropTypes.bool,
      isDiscount: PropTypes.bool,
    })
  ),
  className: PropTypes.string,
  children: PropTypes.node,
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
};

export default OrderSummary;
