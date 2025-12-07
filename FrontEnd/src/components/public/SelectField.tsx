import { ChevronDown } from "lucide-react";

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
        className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white 
                  focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 text-sm h-11"
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
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);

export default SelectField;