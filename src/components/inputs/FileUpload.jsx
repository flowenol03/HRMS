import React, { useRef, useState } from 'react';
import { Upload, X, File } from 'lucide-react';

const FileUpload = ({
  label,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png',
  error = '',
  disabled = false,
  required = false,
  className = '',
  maxSize = 5, // in MB
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setFileError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    setFileError('');
    onChange(file);
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null);
  };

  const handleClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-4
          transition-colors duration-200 cursor-pointer
          ${disabled 
            ? 'border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400'
          }
          ${(error || fileError) ? 'border-red-500 dark:border-red-400' : ''}
          ${className}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          disabled={disabled}
          className="hidden"
          {...props}
        />
        
        {!fileName ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {accept} (max {maxSize}MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Click to change file
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="p-1 text-gray-500 hover:text-red-500"
              disabled={disabled}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      
      {(error || fileError) && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error || fileError}
        </p>
      )}
    </div>
  );
};

export default FileUpload;