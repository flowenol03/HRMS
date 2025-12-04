import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  CheckCheck,
  Trash2 
} from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

const NotificationList = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getNotificationBg = (type, read) => {
    if (!read) {
      switch (type) {
        case 'success': return 'bg-green-50 dark:bg-green-900/20';
        case 'error': return 'bg-red-50 dark:bg-red-900/20';
        case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
        case 'info': return 'bg-blue-50 dark:bg-blue-900/20';
        default: return 'bg-gray-50 dark:bg-gray-900/20';
      }
    }
    return '';
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Bell className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No notifications
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You're all caught up!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <CheckCheck size={16} />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Trash2 size={16} />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        const iconColor = getNotificationColor(notification.type);
        const bgClass = getNotificationBg(notification.type, notification.read);
        
        return (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${bgClass}`}
            onClick={() => {
              onNotificationClick?.(notification);
              if (!notification.read) {
                onMarkAsRead(notification.id);
              }
            }}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDateTime(notification.createdAt)}
                  </span>
                  {notification.module && (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {notification.module}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;