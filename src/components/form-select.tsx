'use client';

import {useState} from 'react';
import {Select} from 'antd';

export type FormSelectOption = {value: string; label: string};

export function FormSelect({
  name,
  defaultValue,
  options,
  placeholder,
  required,
  ariaLabel,
  variant,
  className,
  id,
  showSearch
}: {
  name: string;
  defaultValue?: string;
  options: FormSelectOption[];
  placeholder?: string;
  required?: boolean;
  ariaLabel?: string;
  variant?: 'outlined' | 'borderless' | 'filled';
  className?: string;
  id?: string;
  showSearch?: boolean;
}) {
  // Note: callers pass key={defaultValue} where the default can change
  // across navigations (e.g. the Bangkok region filter) so the state
  // re-initialises via remount instead of syncing in an effect.
  const [value, setValue] = useState<string | undefined>(defaultValue || undefined);

  return (
    <>
      <Select
        id={id}
        className={className}
        variant={variant ?? 'outlined'}
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={(next) => setValue(next)}
        aria-label={ariaLabel}
        style={{width: '100%'}}
        showSearch={showSearch}
        optionFilterProp={showSearch ? 'label' : undefined}
      />
      <input type="hidden" name={name} value={value ?? ''} required={required} />
    </>
  );
}
