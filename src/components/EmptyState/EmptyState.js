import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './EmptyState.scss';

/**
 * EmptyState Component
 *
 * Displays an empty state message with an icon, title, description, and optional action button.
 * Used when there are no items to display (e.g., empty cart, no search results, not found states).
 *
 * Features:
 * - Configurable heading level for proper document outline
 * - Optional icon, title, description, and action button
 * - Forwards refs for parent component access
 */
const EmptyState = memo(
  forwardRef(function EmptyState(
    {
      icon,
      title,
      description,
      actionLabel,
      onAction,
      actionVariant = 'primary',
      headingLevel = 2,
      className = '',
      ...props
    },
    ref
  ) {
    const HeadingTag = `h${headingLevel}`;

    return (
      <div
        ref={ref}
        className={`empty-state ${className}`}
        role="status"
        aria-live="polite"
        {...props}
      >
        {icon && (
          <div className="empty-state__icon" aria-hidden="true">
            {icon}
          </div>
        )}
        {title && (
          <HeadingTag className="empty-state__title">{title}</HeadingTag>
        )}
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
        {actionLabel && onAction && (
          <Button
            variant={actionVariant}
            size="lg"
            className="empty-state__action"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  })
);

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  actionVariant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  className: PropTypes.string,
};

export default EmptyState;
