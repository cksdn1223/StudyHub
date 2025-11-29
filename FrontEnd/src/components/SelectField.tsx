const SelectField = ({ onChange, id, label, options, defaultValue, fullWidth = true, required = false }: React.PropsWithChildren<{
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  label: string;
  options: string[];
  defaultValue?: string;
  fullWidth?: boolean;
  required?: boolean;
}>) => (
  <div className={`mt-2 ${fullWidth ? 'w-full' : ''}`}>
    <label htmlFor={label} className="text-sm font-semibold text-gray-800">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative mt-1">
      <select
        id={id}
        onChange={onChange}
        defaultValue={""}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-red-300 focus:border-red-300 text-sm h-11"
      >
        {defaultValue && (
          <option
            value=""
            disabled
            hidden
          >
            {defaultValue}
          </option>
        )}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {/* 화살표 아이콘 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div>
    </div>
  </div>
);

export default SelectField;