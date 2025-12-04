import React, { memo } from 'react';
import { CheckIcon } from '../../Icons';

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
        <CheckIcon />
      </span>
      <span className="checkbox-filter__label">{label}</span>
    </label>
  );
});

export default CheckboxFilter;
