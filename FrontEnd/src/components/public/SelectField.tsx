import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  options: string[];
  defaultValue?: string;
  fullWidth?: boolean;
  required?: boolean;

  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;

  errorMessage?: string;
};

const SelectField = forwardRef<HTMLSelectElement, Props>(
  (
    {
      onChange,
      onBlur,
      id,
      name,
      label,
      options,
      defaultValue,
      fullWidth = true,
      required = false,
      value,
      errorMessage,
    },
    ref
  ) => (
    <div className={`mt-2 ${fullWidth ? "w-full" : ""}`}>
      <label htmlFor={id ?? name ?? label} className="text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-1">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!errorMessage}
          className={`w-full px-4 py-3 rounded-lg appearance-none bg-white text-sm h-11 focus:outline-none focus:ring-2
            ${errorMessage ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-red-300 focus:border-red-300"}`}
        >
          {defaultValue && (
            <option value="" disabled hidden>
              {defaultValue}
            </option>
          )}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  )
);

SelectField.displayName = "SelectField";
export default SelectField;
