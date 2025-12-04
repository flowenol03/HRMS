import React from 'react';

const IconButton = ({ 
  icon: Icon,
  onClick, 
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  size = 'md',
  variant = 'default',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
    primary: 'bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800',
    danger: 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800',
    success: 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-gray-800 dark:border-gray-200"
          style={{ 
            width: iconSize[size], 
            height: iconSize[size],
            borderTopColor: 'transparent'
          }}
        ></div>
      ) : Icon && <Icon size={iconSize[size]} />}
    </button>
  );
};

export default IconButton;