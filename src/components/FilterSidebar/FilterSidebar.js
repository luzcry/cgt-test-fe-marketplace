import React, { useState, useCallback, memo } from 'react';
import {
  CATEGORIES,
  FILE_FORMATS,
  PRICE_RANGE,
  POLY_COUNT_RANGE,
} from '../../data/products';
import './FilterSidebar.scss';

/**
 * FilterSidebar Component
 *
 * SEO Best Practices:
 * - Semantic HTML with fieldset/legend for filter groups
 * - Proper label associations for form inputs
 * - ARIA attributes for accessibility
 * - Keyboard navigable controls
 *
 * Performance Best Practices:
 * - React.memo for preventing unnecessary re-renders
 * - useCallback for stable event handlers
 * - CSS-only animations for smooth performance
 * - Controlled component pattern for predictable state
 */

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
        <svg
          className={`filter-section__chevron ${isExpanded ? 'filter-section__chevron--expanded' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
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

const CheckboxFilter = memo(function CheckboxFilter({
  id,
  label,
  checked,
  onChange,
}) {
  return (
    <label className="checkbox-filter" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        className="checkbox-filter__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="checkbox-filter__box" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </span>
      <span className="checkbox-filter__label">{label}</span>
    </label>
  );
});

const RangeSlider = memo(function RangeSlider({
  id,
  label,
  min,
  max,
  value,
  onChange,
  formatValue = (v) => v,
  step = 1,
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleMinChange = useCallback(
    (e) => {
      const newMin = Math.min(Number(e.target.value), localValue[1] - step);
      setLocalValue([newMin, localValue[1]]);
      onChange([newMin, localValue[1]]);
    },
    [localValue, onChange, step]
  );

  const handleMaxChange = useCallback(
    (e) => {
      const newMax = Math.max(Number(e.target.value), localValue[0] + step);
      setLocalValue([localValue[0], newMax]);
      onChange([localValue[0], newMax]);
    },
    [localValue, onChange, step]
  );

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="range-slider" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="visually-hidden">
        {label}
      </span>

      <div className="range-slider__track">
        <div
          className="range-slider__fill"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        <input
          type="range"
          id={`${id}-min`}
          className="range-slider__input"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          aria-label={`Minimum ${label}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue[0]}
        />
        <input
          type="range"
          id={`${id}-max`}
          className="range-slider__input"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          aria-label={`Maximum ${label}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
        />
      </div>

      <div className="range-slider__values">
        <span className="range-slider__value">
          {formatValue(localValue[0])}
        </span>
        <span className="range-slider__separator" aria-hidden="true" />
        <span className="range-slider__value">
          {formatValue(localValue[1])}
        </span>
      </div>
    </div>
  );
});

const FilterSidebar = memo(function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    polyCount: true,
    format: true,
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleCategoryToggle = useCallback(
    (category) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      onFilterChange({ ...filters, categories: newCategories });
    },
    [filters, onFilterChange]
  );

  const handleFormatToggle = useCallback(
    (format) => {
      const newFormats = filters.fileFormats.includes(format)
        ? filters.fileFormats.filter((f) => f !== format)
        : [...filters.fileFormats, format];
      onFilterChange({ ...filters, fileFormats: newFormats });
    },
    [filters, onFilterChange]
  );

  const handlePriceChange = useCallback(
    (priceRange) => {
      onFilterChange({ ...filters, priceRange });
    },
    [filters, onFilterChange]
  );

  const handlePolyCountChange = useCallback(
    (polyCountRange) => {
      onFilterChange({ ...filters, polyCountRange });
    },
    [filters, onFilterChange]
  );

  // Calculate active filters count
  const activeFiltersCount =
    filters.categories.length +
    filters.fileFormats.length +
    (filters.priceRange[0] !== PRICE_RANGE.min ||
    filters.priceRange[1] !== PRICE_RANGE.max
      ? 1
      : 0) +
    (filters.polyCountRange[0] !== POLY_COUNT_RANGE.min ||
    filters.polyCountRange[1] !== POLY_COUNT_RANGE.max
      ? 1
      : 0);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`filter-backdrop ${isOpen ? 'filter-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`filter-sidebar ${isOpen ? 'filter-sidebar--open' : ''}`}
        aria-label="Product filters"
      >
        {/* Header */}
        <header className="filter-sidebar__header">
          <div className="filter-sidebar__title-row">
            <div className="filter-sidebar__title-group">
              <svg
                className="filter-sidebar__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <h2 className="filter-sidebar__title">Filters</h2>
            </div>
            <button
              type="button"
              className="filter-sidebar__close"
              onClick={onClose}
              aria-label="Close filters panel"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <div className="filter-sidebar__active">
              <span className="filter-sidebar__active-count">
                {activeFiltersCount} Active
              </span>
              <button
                type="button"
                className="filter-sidebar__reset"
                onClick={onReset}
                aria-label="Reset all filters"
              >
                Reset All
              </button>
            </div>
          )}
        </header>

        {/* Filter Sections */}
        <div className="filter-sidebar__content">
          {/* Categories */}
          <FilterSection
            title="Category"
            id="filter-categories"
            isExpanded={expandedSections.category}
            onToggle={() => toggleSection('category')}
          >
            <div className="filter-sidebar__checkboxes">
              {CATEGORIES.map((category) => (
                <CheckboxFilter
                  key={category}
                  id={`category-${category}`}
                  label={category}
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            title="Price Range"
            id="filter-price"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <RangeSlider
              id="price-range"
              label="Price"
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={10}
              value={filters.priceRange}
              onChange={handlePriceChange}
              formatValue={(v) => `$${v}`}
            />
          </FilterSection>

          {/* Polygon Count */}
          <FilterSection
            title="Polygon Count"
            id="filter-polycount"
            isExpanded={expandedSections.polyCount}
            onToggle={() => toggleSection('polyCount')}
          >
            <RangeSlider
              id="poly-count-range"
              label="Polygon count"
              min={POLY_COUNT_RANGE.min}
              max={POLY_COUNT_RANGE.max}
              step={5000}
              value={filters.polyCountRange}
              onChange={handlePolyCountChange}
              formatValue={(v) => v.toLocaleString()}
            />
          </FilterSection>

          {/* File Formats */}
          <FilterSection
            title="File Format"
            id="filter-formats"
            isExpanded={expandedSections.format}
            onToggle={() => toggleSection('format')}
          >
            <div className="filter-sidebar__checkboxes">
              {FILE_FORMATS.map((format) => (
                <CheckboxFilter
                  key={format}
                  id={`format-${format}`}
                  label={format}
                  checked={filters.fileFormats.includes(format)}
                  onChange={() => handleFormatToggle(format)}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Decorative Elements */}
        <div
          className="filter-sidebar__decor filter-sidebar__decor--top"
          aria-hidden="true"
        />
        <div
          className="filter-sidebar__decor filter-sidebar__decor--bottom"
          aria-hidden="true"
        />
      </aside>
    </>
  );
});

export default FilterSidebar;
