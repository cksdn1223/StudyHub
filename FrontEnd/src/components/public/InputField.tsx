import React, { forwardRef } from "react";

type CommonProps = React.PropsWithChildren<{
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;

  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;

  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  errorMessage?: string;
}>;

type InputFieldProps =
  | (CommonProps & { rows?: undefined; type?: string })
  | (CommonProps & { rows: number; type?: never });

const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  (
    {
      onFocus,
      onBlur,
      onKeyDown,
      onChange,
      id,
      name,
      label,
      placeholder,
      value,
      defaultValue,
      disabled = false,
      fullWidth = true,
      children,
      rows,
      required = false,
      errorMessage,
      type = "text",
    },
    ref
  ) => {
    const controlId = id ?? name ?? label ?? undefined;

    const baseClass = `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 text-sm placeholder-gray-500
      ${rows ? "" : "h-11"}
      ${disabled ? "disabled:bg-gray-50 disabled:text-gray-500" : ""}
      ${errorMessage ? "border border-red-400 focus:ring-red-200" : "border border-gray-300 focus:ring-red-300 focus:border-red-300"}`;

    return (
      <div className={`mt-2 ${fullWidth ? "w-full" : ""}`}>
        {label !== undefined && label !== "" && (
          <label htmlFor={controlId} className="text-sm font-semibold text-gray-800">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="flex items-center mt-1">
          {rows ? (
            <textarea
              id={controlId}
              name={name}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              placeholder={placeholder}
              rows={rows}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-invalid={!!errorMessage}
              className={baseClass}
            />
          ) : (
            <input
              id={controlId}
              name={name}
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              placeholder={placeholder}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-invalid={!!errorMessage}
              className={baseClass}
            />
          )}

          {children}
        </div>

        {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;