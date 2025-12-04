import React from 'react';
import Modal from './Modal';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false
}) => {
  const icons = {
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
    info: Info
  };

  const colors = {
    warning: 'text-yellow-600 dark:text-yellow-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  };

  const Icon = icons[type];
  const iconColor = colors[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-3 rounded-full ${iconColor} bg-opacity-10`}>
            <Icon size={32} />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white">{message}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 text-white rounded-lg font-medium transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;