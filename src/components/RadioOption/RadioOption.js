import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './RadioOption.scss';

/**
 * RadioOption Component
 *
 * A styled radio button option with label, description, and optional price.
 * Useful for shipping options, payment methods, plan selection, etc.
 *
 * Features:
 * - Custom styled radio indicator
 * - Support for label, description, and price display
 * - Selected state styling
 * - Forwards refs for parent component access
 */
const RadioOption = memo(
  forwardRef(function RadioOption(
    {
      name,
      value,
      label,
      description,
      price,
      checked,
      onChange,
      className = '',
      ...props
    },
    ref
  ) {
    return (
      <label
        ref={ref}
        className={`radio-option ${checked ? 'radio-option--selected' : ''} ${className}`}
        {...props}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="radio-option__input"
        />
        <span className="radio-option__radio" aria-hidden="true" />
        <div className="radio-option__content">
          <span className="radio-option__label">{label}</span>
          {description && (
            <span className="radio-option__description">{description}</span>
          )}
        </div>
        {price !== undefined && (
          <span className="radio-option__price">{price}</span>
        )}
      </label>
    );
  })
);

RadioOption.displayName = 'RadioOption';

RadioOption.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default RadioOption;
