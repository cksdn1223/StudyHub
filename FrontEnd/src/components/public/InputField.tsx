import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

type CommonProps = React.PropsWithChildren<{
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  size?: number;
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
      size,
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

    const localRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => localRef.current!);

    const adjustHeight = useCallback(() => {
      if (rows && localRef.current && localRef.current instanceof HTMLTextAreaElement) {
        const target = localRef.current;
        target.style.height = "auto";
        target.style.height = `${target.scrollHeight}px`;
      }
    }, [rows]);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight])


    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value: newValue } = e.target;
      
      if (size) {
        // 이미 1000자인 상태에서 글자를 더 추가하려고 하면 (중간 입력 포함) 아예 무시
        if (value && value.length >= size && newValue.length > value.length) {
          return;
        }
        // 붙여넣기 등으로 한번에 size를 초과해서 들어온 경우, 앞부분만 자름
        if (newValue.length > size) {
          e.target.value = newValue.substring(0, size);
        }
      }
      onChange?.(e);
      adjustHeight();
    };
    
    const baseClass = `w-full px-4 py-3 rounded-lg focus:outline-none text-sm placeholder-gray-500 ring-1 focus:ring-2 focus:ring-red-200
      ${rows ? "resize-none overflow-hidden" : "h-11"} 
      ${disabled ? "disabled:bg-gray-50 disabled:text-gray-500" : ""}
      ${errorMessage ? "ring-red-400 " : "ring-gray-300"}`;
    
    return (
      <div className={`mt-2 ${fullWidth ? "w-full" : ""}`}>
        {label !== undefined && label !== "" && (
          <label htmlFor={controlId} className="text-sm font-semibold text-gray-800">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="flex items-center mt-1 relative">
          {rows ? (
            <textarea
              id={controlId}
              name={name}
              ref={localRef as React.Ref<HTMLTextAreaElement>}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              placeholder={placeholder}
              rows={rows}
              onChange={handleChange}
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
              ref={localRef as React.Ref<HTMLInputElement>}
              type={type}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              placeholder={placeholder}
              onChange={handleChange}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              aria-invalid={!!errorMessage}
              className={baseClass}
            />
          )}
          {children}
          {/* size가 true면 글자 수 오른쪽 아래에 표시 */}
          {size &&
            <p className="absolute bottom-[-20px] right-0 text-[11px] text-gray-400">
              {value?.length || 0}/{size}
            </p>
          }
        </div>

        {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;