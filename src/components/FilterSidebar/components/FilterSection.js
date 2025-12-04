import React, { memo } from 'react';
import { ChevronIcon } from '../../Icons';

const FilterSection = memo(function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
  id,
}) {
  return (
    <fieldset className="filter-section">
      <legend className="visually-hidden">{title} filters</legend>
      <button
        type="button"
        className="filter-section__header"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={id}
      >
        <span className="filter-section__title">{title}</span>
        <ChevronIcon
          className={`filter-section__chevron ${isExpanded ? 'filter-section__chevron--expanded' : ''}`}
          direction={isExpanded ? 'up' : 'down'}
        />
      </button>
      <div
        id={id}
        className={`filter-section__content ${isExpanded ? 'filter-section__content--expanded' : ''}`}
        aria-hidden={!isExpanded}
      >
        {children}
      </div>
    </fieldset>
  );
});

export default FilterSection;
