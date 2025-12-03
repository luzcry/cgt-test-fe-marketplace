import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './SectionHeader.scss';

/**
 * SectionHeader Component
 *
 * A reusable header component with title and optional description.
 * Used for section headings in forms and content areas.
 *
 * Features:
 * - Configurable heading level (h1-h6)
 * - Optional description text
 * - Accessible with proper heading hierarchy
 * - Forwards refs for parent component access
 */
const SectionHeader = memo(
  forwardRef(function SectionHeader(
    { title, description, id, level = 2, className = '', ...props },
    ref
  ) {
    const HeadingTag = `h${level}`;

    return (
      <header ref={ref} className={`section-header ${className}`} {...props}>
        <HeadingTag id={id} className="section-header__title">
          {title}
        </HeadingTag>
        {description && (
          <p className="section-header__description">{description}</p>
        )}
      </header>
    );
  })
);

SectionHeader.displayName = 'SectionHeader';

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  id: PropTypes.string,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  className: PropTypes.string,
};

export default SectionHeader;
