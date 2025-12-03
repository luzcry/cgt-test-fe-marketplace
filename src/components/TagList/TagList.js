import { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './TagList.scss';

/**
 * TagList Component
 *
 * Displays a list of tags/labels with optional prefix (e.g., hashtags).
 * Useful for product tags, categories, keywords, etc.
 *
 * Features:
 * - Configurable tag prefix (default: #)
 * - Optional click handler for interactive tags
 * - Accessible with proper ARIA labels
 * - Forwards refs for parent component access
 */
const TagList = memo(
  forwardRef(function TagList(
    {
      tags = [],
      prefix = '#',
      onClick,
      ariaLabel = 'Tags',
      className = '',
      ...props
    },
    ref
  ) {
    const isInteractive = typeof onClick === 'function';

    return (
      <div
        ref={ref}
        className={`tag-list ${className}`}
        aria-label={ariaLabel}
        {...props}
      >
        {tags.map((tag) =>
          isInteractive ? (
            <button
              key={tag}
              type="button"
              className="tag-list__tag tag-list__tag--interactive"
              onClick={() => onClick(tag)}
            >
              {prefix}
              {tag}
            </button>
          ) : (
            <span key={tag} className="tag-list__tag">
              {prefix}
              {tag}
            </span>
          )
        )}
      </div>
    );
  })
);

TagList.displayName = 'TagList';

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  prefix: PropTypes.string,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default TagList;
