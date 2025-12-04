import { useNotifications } from '../hooks/useNotifications';
import { formatDateTime } from '../utils/dateUtils';

export const useNotificationViewModel = () => {
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications();
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
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
  
  const formatNotificationTime = (timestamp) => {
    return formatDateTime(timestamp);
  };
  
  const groupNotificationsByDate = () => {
    const groups = {};
    
    notifications.forEach(notification => {
      const date = notification.createdAt.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, notifs]) => ({
        date,
        notifications: notifs
      }));
  };
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime,
    groupNotificationsByDate
  };
};