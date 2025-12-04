import React from 'react';
import { X, Bell, Calendar, TrendingUp, Users, Clock } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const RightPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const quickStats = [
    { label: 'Active Employees', value: '48', change: '+5%', icon: Users, color: 'primary' },
    { label: 'Today Present', value: '42', change: '+2%', icon: Clock, color: 'green' },
    { label: 'Pending Leaves', value: '6', change: '-1%', icon: Calendar, color: 'yellow' },
    { label: 'Avg. Performance', value: '4.2', change: '+0.3', icon: TrendingUp, color: 'purple' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'checked in', time: '09:00 AM', type: 'attendance' },
    { id: 2, user: 'Jane Smith', action: 'applied for leave', time: '10:30 AM', type: 'leave' },
    { id: 3, user: 'HR Department', action: 'processed payroll', time: '11:15 AM', type: 'payroll' },
    { id: 4, user: 'Mike Johnson', action: 'completed review', time: '02:45 PM', type: 'performance' }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="text-primary-600 dark:text-primary-400" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Overview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formatDate(new Date())}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-120px)]">
        {/* Quick Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
                green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
              };

              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colors[stat.color]}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.change.startsWith('+') 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const typeColors = {
                attendance: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
                leave: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
                payroll: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
                performance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
              };

              return (
                <div key={activity.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[activity.type]}`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            System Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-sm text-gray-900 dark:text-white">99.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-sm text-gray-900 dark:text-white">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;