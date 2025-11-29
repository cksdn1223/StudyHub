const InputField = ({ onFocus, onBlur, onKeyPress, onChange, id, label, placeholder, value, type = 'text', disabled = false, fullWidth = true, children, rows, required = false }: React.PropsWithChildren<{
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  rows?: number;
  required?: boolean;
}>) => {
  const InputElement = rows ? 'textarea' : 'input';
  
  return (
    <div className={`mt-2 ${fullWidth ? 'w-full' : ''}`}>
      <label htmlFor={label} className="text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center mt-1">
        <InputElement
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-300 focus:border-red-300 text-sm placeholder-gray-500 ${rows ? '' : 'h-11'} ${disabled ? 'disabled:bg-gray-50 disabled:text-gray-500' : ''}`}
        />
        {children}
      </div>
    </div>
  );
};

export default InputField;