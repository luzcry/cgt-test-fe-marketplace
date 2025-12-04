import React, { useState, useCallback, useEffect, memo } from 'react';

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
      const inputValue = Number(e.target.value);
      setLocalValue((prev) => {
        const newMin = Math.min(inputValue, prev[1] - step);
        const newValue = [newMin, prev[1]];
        onChange(newValue);
        return newValue;
      });
    },
    [onChange, step]
  );

  const handleMaxChange = useCallback(
    (e) => {
      const inputValue = Number(e.target.value);
      setLocalValue((prev) => {
        const newMax = Math.max(inputValue, prev[0] + step);
        const newValue = [prev[0], newMax];
        onChange(newValue);
        return newValue;
      });
    },
    [onChange, step]
  );

  useEffect(() => {
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

export default RangeSlider;
