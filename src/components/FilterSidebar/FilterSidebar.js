import { useState, useCallback, memo } from 'react';
import {
  CATEGORIES,
  FILE_FORMATS,
  PRICE_RANGE,
  POLY_COUNT_RANGE,
} from '../../data/products';
import { FilterIcon, CloseIcon } from '../Icons';
import Button from '../Button';
import { FilterSection, CheckboxFilter, RangeSlider } from './components';
import './FilterSidebar.scss';

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
      <div
        className={`filter-backdrop ${isOpen ? 'filter-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`filter-sidebar ${isOpen ? 'filter-sidebar--open' : ''}`}
        aria-label="Product filters"
      >
        <header className="filter-sidebar__header">
          <div className="filter-sidebar__title-row">
            <div className="filter-sidebar__title-group">
              <FilterIcon className="filter-sidebar__icon" />
              <h2 className="filter-sidebar__title">Filters</h2>
            </div>
            <Button
              variant="icon"
              size="sm"
              className="filter-sidebar__close"
              onClick={onClose}
              aria-label="Close filters panel"
            >
              <CloseIcon />
            </Button>
          </div>

          {activeFiltersCount > 0 && (
            <div className="filter-sidebar__active">
              <span className="filter-sidebar__active-count">
                {activeFiltersCount} Active
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="filter-sidebar__reset"
                onClick={onReset}
                aria-label="Reset all filters"
              >
                Reset All
              </Button>
            </div>
          )}
        </header>

        <div className="filter-sidebar__content">
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
