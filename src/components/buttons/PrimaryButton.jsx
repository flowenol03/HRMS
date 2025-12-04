import React from 'react';

const PrimaryButton = ({ 
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
        bg-primary-600 hover:bg-primary-700 
        text-white font-medium 
        py-2 px-4 rounded-lg 
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default PrimaryButton;