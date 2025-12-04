import React from 'react';

const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        bg-gray-200 hover:bg-gray-300 
        dark:bg-gray-700 dark:hover:bg-gray-600
        text-gray-800 dark:text-gray-200 
        font-medium 
        py-2 px-4 rounded-lg 
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 dark:border-gray-200"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default SecondaryButton;