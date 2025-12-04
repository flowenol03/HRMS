import React from 'react';
import { Calendar } from 'lucide-react';

const DateInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="date"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full pl-10 pr-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500
            dark:focus:ring-primary-400
            ${error 
              ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default DateInput;