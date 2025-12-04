import React, { useState, useEffect } from 'react';
import { usePerformanceViewModel } from '../../viewmodels/PerformanceViewModel';
import { useAuth } from '../../hooks/useAuth';
import { 
  BarChart3, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const PerformanceList = () => {
  const { 
    performances,
    loading,
    handleAcknowledge,
    handleComplete,
    getPerformanceStats
  } = usePerformanceViewModel();
  
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredPerformances, setFilteredPerformances] = useState([]);
  const [stats, setStats] = useState(null);
  
  const isHR = user?.role === 'admin' || user?.role === 'hr';
  
  useEffect(() => {
    const filtered = performances.filter(item => {
      if (search && !item.employeeName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
    
    setFilteredPerformances(filtered);
    setStats(getPerformanceStats());
  }, [performances, search, statusFilter, getPerformanceStats]);
  
  const statuses = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'in-review', label: 'In Review', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'acknowledged', label: 'Acknowledged', color: 'purple' }
  ];
  
  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'in-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      acknowledged: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };
  
  const getPerformanceBadge = (score) => {
    if (score >= 4.5) return { label: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    if (score >= 4) return { label: 'Very Good', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
    if (score >= 3) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    if (score >= 2) return { label: 'Needs Improvement', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' };
    return { label: 'Poor', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage employee performance reviews
          </p>
        </div>
        
        {isHR && (
          <button className="btn-primary flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>New Review</span>
          </button>
        )}
      </div>
      
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.averageScore.toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-lg text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalReviews}
                </p>
              </div>
              <div className="p-2 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.highestScore.toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lowest Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.lowestScore.toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                <TrendingDown size={20} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by employee name..."
                className="input-field pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Performance Reviews Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPerformances.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No performance reviews found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search || statusFilter 
                ? 'Try adjusting your search or filters' 
                : 'No performance reviews available'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredPerformances.length} of {performances.length} reviews
              </p>
              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="table-header">Employee</th>
                    <th className="table-header">Review Period</th>
                    <th className="table-header">Review Date</th>
                    <th className="table-header">Overall Score</th>
                    <th className="table-header">Performance</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPerformances.map((review) => {
                    const performance = getPerformanceBadge(review.overallScore);
                    
                    return (
                      <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                By: {review.reviewerName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          {review.reviewPeriod}
                        </td>
                        <td className="table-cell">
                          {formatDate(review.reviewDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(review.overallScore / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {review.overallScore.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${performance.color}`}>
                            {performance.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(review.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {isHR && (
                              <button
                                className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                            )}
                            
                            {user?.role === 'employee' && review.status === 'completed' && (
                              <button
                                onClick={() => handleAcknowledge(review.id)}
                                className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30 rounded font-medium"
                              >
                                Acknowledge
                              </button>
                            )}
                            
                            {isHR && review.status === 'in-review' && (
                              <button
                                onClick={() => handleComplete(review.id)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default PerformanceList;