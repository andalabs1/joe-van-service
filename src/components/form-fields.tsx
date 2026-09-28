'use client';

import {useState} from 'react';
import {DatePicker, InputNumber, TimePicker} from 'antd';

// Ant DatePicker / TimePicker / InputNumber don't render a native form
// control, so each wrapper mirrors its value into a hidden input with the
// real field name. Server-side (zod) validation remains the source of truth.
const toHidden = (dateString: string | string[] | null | undefined) => {
  if (!dateString) return '';
  return Array.isArray(dateString) ? dateString[0] ?? '' : dateString;
};

export function FormDatePicker({
  name,
  ariaLabel,
  placeholder,
  className
}: {
  name: string;
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState('');
  return (
    <>
      <DatePicker
        className={className}
        format="YYYY-MM-DD"
        placeholder={placeholder}
        aria-label={ariaLabel}
        style={{width: '100%'}}
        disabledDate={(current) => {
          if (!current) return false;
          const selected = current.toDate();
          selected.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selected < today;
        }}
        onChange={(_date, dateString) => setValue(toHidden(dateString))}
      />
      <input type="hidden" name={name} value={value} />
    </>
  );
}

export function FormTimePicker({
  name,
  ariaLabel,
  placeholder,
  className
}: {
  name: string;
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState('');
  return (
    <>
      <TimePicker
        className={className}
        format="HH:mm"
        placeholder={placeholder}
        aria-label={ariaLabel}
        style={{width: '100%'}}
        onChange={(_time, timeString) => setValue(toHidden(timeString))}
      />
      <input type="hidden" name={name} value={value} />
    </>
  );
}

export function FormNumber({
  name,
  defaultValue,
  min,
  max,
  ariaLabel,
  className
}: {
  name: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  ariaLabel?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue === undefined ? '' : String(defaultValue));
  return (
    <>
      <InputNumber
        className={className}
        style={{width: '100%'}}
        defaultValue={defaultValue}
        min={min}
        max={max}
        aria-label={ariaLabel}
        onChange={(next) => setValue(next == null ? '' : String(next))}
      />
      <input type="hidden" name={name} value={value} />
    </>
  );
}
