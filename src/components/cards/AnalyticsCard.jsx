import React from 'react';
import { LucideIcon } from 'lucide-react';

const AnalyticsCard = ({ 
  title, 
  value, 
  icon: Icon,
  change,
  changeType = 'neutral',
  description,
  color = 'primary'
}) => {
  const colors = {
    primary: 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    orange: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
  };
  
  const iconColors = {
    primary: 'text-primary-600 dark:text-primary-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  };
  
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };
  
  return (
    <div className={`p-6 rounded-lg border ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconColors[color]} bg-white dark:bg-gray-800`}>
          <Icon size={24} />
        </div>
      </div>
      
      {(change || description) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {change && (
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
              </span>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;