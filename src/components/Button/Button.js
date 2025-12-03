import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

/**
 * Reusable Button Component
 *
 * Variants:
 * - primary: Main action button (filled, accent color)
 * - secondary: Secondary action button (outlined)
 * - ghost: Minimal styling button
 * - icon: Icon-only button (square)
 *
 * Features:
 * - Loading state with spinner
 * - Icon support (start/end position)
 * - Polymorphic (can render as button, a, Link, etc.)
 */
const Button = memo(
  forwardRef(function Button(
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'start',
      isLoading = false,
      disabled = false,
      className = '',
      as: Component = 'button',
      ...props
    },
    ref
  ) {
    const isIconOnly = variant === 'icon';
    const showIcon = icon && !isLoading;

    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      isLoading && 'btn--loading',
      disabled && 'btn--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const buttonProps = {
      ref,
      className: classes,
      disabled: disabled || isLoading,
      'aria-busy': isLoading || undefined,
      ...props,
    };

    // Add type="button" only for actual button elements
    if (Component === 'button' && !props.type) {
      buttonProps.type = 'button';
    }

    return (
      <Component {...buttonProps}>
        {isLoading && (
          <>
            <span className="btn__spinner" aria-hidden="true" />
            <span className="visually-hidden" role="status">
              Loading
            </span>
          </>
        )}
        {showIcon && iconPosition === 'start' && (
          <span className="btn__icon btn__icon--start" aria-hidden="true">
            {icon}
          </span>
        )}
        {!isIconOnly && children && (
          <span className="btn__text">{children}</span>
        )}
        {isIconOnly && children}
        {showIcon && iconPosition === 'end' && (
          <span className="btn__icon btn__icon--end" aria-hidden="true">
            {icon}
          </span>
        )}
      </Component>
    );
  })
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'icon']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
};

export default Button;
