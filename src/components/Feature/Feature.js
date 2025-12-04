import { memo } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '../Icons';
import './Feature.scss';

/**
 * FeatureItem Component
 *
 * A single feature item with an icon and text.
 * Supports different icon types (check, dot, custom).
 */
export const FeatureItem = memo(function FeatureItem({
  children,
  icon = 'check',
  iconClassName = '',
  className = '',
  ...props
}) {
  const renderIcon = () => {
    if (icon === 'check') {
      return <CheckIcon className={`feature__icon-svg ${iconClassName}`} />;
    }
    if (icon === 'dot') {
      return <span className={`feature__dot ${iconClassName}`} />;
    }
    // Custom icon (React element)
    return icon;
  };

  return (
    <div className={`feature ${className}`} {...props}>
      <span className="feature__icon" aria-hidden="true">
        {renderIcon()}
      </span>
      <span className="feature__text">{children}</span>
    </div>
  );
});

FeatureItem.displayName = 'FeatureItem';

FeatureItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.oneOf(['check', 'dot']),
    PropTypes.node,
  ]),
  iconClassName: PropTypes.string,
  className: PropTypes.string,
};

/**
 * FeatureList Component
 *
 * A list of features with consistent styling.
 * Can be displayed in column or row layout.
 */
const FeatureList = memo(function FeatureList({
  features,
  icon = 'check',
  direction = 'column',
  className = '',
  itemClassName = '',
  ...props
}) {
  return (
    <div
      className={`feature-list feature-list--${direction} ${className}`}
      {...props}
    >
      {features.map((feature, index) => (
        <FeatureItem
          key={typeof feature === 'string' ? feature : index}
          icon={icon}
          className={itemClassName}
        >
          {feature}
        </FeatureItem>
      ))}
    </div>
  );
});

FeatureList.displayName = 'FeatureList';

FeatureList.propTypes = {
  features: PropTypes.arrayOf(PropTypes.node).isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.oneOf(['check', 'dot']),
    PropTypes.node,
  ]),
  direction: PropTypes.oneOf(['column', 'row']),
  className: PropTypes.string,
  itemClassName: PropTypes.string,
};

export default FeatureList;
