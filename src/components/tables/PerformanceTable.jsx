import React from 'react';
import { BarChart3, Eye, Edit, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const PerformanceTable = ({ 
  performances,
  onView,
  onEdit,
  onAcknowledge,
  onComplete,
  showEmployee = true
}) => {
  const getPerformanceBadge = (score) => {
    if (score >= 4.5) return { 
      label: 'Excellent', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: TrendingUp 
    };
    if (score >= 4) return { 
      label: 'Very Good', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: TrendingUp 
    };
    if (score >= 3) return { 
      label: 'Good', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      icon: BarChart3 
    };
    if (score >= 2) return { 
      label: 'Needs Improvement', 
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      icon: TrendingDown 
    };
    return { 
      label: 'Poor', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: TrendingDown 
    };
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'in-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      acknowledged: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    
    const labels = {
      draft: 'Draft',
      'in-review': 'In Review',
      completed: 'Completed',
      acknowledged: 'Acknowledged'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const renderScoreBar = (score) => {
    const percentage = (score / 5) * 100;
    let color = 'bg-red-500';
    
    if (score >= 4) color = 'bg-green-500';
    else if (score >= 3) color = 'bg-yellow-500';
    else if (score >= 2) color = 'bg-orange-500';
    
    return (
      <div className="flex items-center space-x-2">
        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            {showEmployee && <th className="table-header">Employee</th>}
            <th className="table-header">Review Period</th>
            <th className="table-header">Review Date</th>
            <th className="table-header">Overall Score</th>
            <th className="table-header">Performance</th>
            <th className="table-header">Status</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {performances.map((review) => {
            const performance = getPerformanceBadge(review.overallScore);
            const PerformanceIcon = performance.icon;
            
            return (
              <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {showEmployee && (
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {review.employeeName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.employeeName}
                        </div>
                        {review.reviewerName && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            By: {review.reviewerName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {review.reviewPeriod}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(review.reviewDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {renderScoreBar(review.overallScore)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <PerformanceIcon size={14} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${performance.color}`}>
                      {performance.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(review.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(review)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:opacity-70 transition-opacity"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(review)}
                        className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:opacity-70 transition-opacity"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    
                    {onAcknowledge && review.status === 'completed' && (
                      <button
                        onClick={() => onAcknowledge(review.id)}
                        className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30 rounded font-medium"
                      >
                        Acknowledge
                      </button>
                    )}
                    
                    {onComplete && review.status === 'in-review' && (
                      <button
                        onClick={() => onComplete(review.id)}
                        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30 rounded font-medium"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;