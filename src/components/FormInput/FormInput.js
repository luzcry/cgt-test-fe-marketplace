import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './FormInput.scss';

/**
 * FormInput Component
 *
 * A reusable form input with label, error handling, and accessibility support.
 *
 * Features:
 * - Label with required indicator
 * - Error state with accessible error messages
 * - Support for all standard input attributes
 * - Forwards refs for parent component access (e.g., focus management)
 */
const FormInput = memo(
  forwardRef(function FormInput(
    {
      id,
      label,
      type = 'text',
      value,
      onChange,
      error,
      placeholder,
      required = false,
      autoComplete,
      maxLength,
      pattern,
      inputMode,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) {
    return (
      <div
        className={`form-field ${error ? 'form-field--error' : ''} ${className}`}
      >
        <label htmlFor={id} className="form-field__label">
          {label}
          {required && (
            <span className="form-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
          inputMode={inputMode}
          disabled={disabled}
          className="form-field__input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="form-field__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  })
);

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  inputMode: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FormInput;
