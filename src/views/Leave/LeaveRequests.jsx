import React, { useState, useEffect } from 'react';
import { useLeaveViewModel } from '../../viewmodels/LeaveViewModel';
import { useAuth } from '../../hooks/useAuth';
import { 
  Calendar, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const LeaveRequests = () => {
  const { 
    leaves,
    loading,
    handleApproveLeave,
    handleRejectLeave,
    getPendingLeaves,
    getLeaveStats
  } = useLeaveViewModel();
  
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  
  const isHR = user?.role === 'admin' || user?.role === 'hr';
  const pendingLeaves = getPendingLeaves();
  
  useEffect(() => {
    const filtered = leaves.filter(leave => {
      if (search && !leave.employeeName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter && leave.status !== statusFilter) {
        return false;
      }
      if (typeFilter && leave.leaveType !== typeFilter) {
        return false;
      }
      return true;
    });
    
    setFilteredLeaves(filtered);
    setStats(getLeaveStats());
  }, [leaves, search, statusFilter, typeFilter, getLeaveStats]);
  
  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'annual', label: 'Annual Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' }
  ];
  
  const statuses = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' }
  ];
  
  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };
  
  const getTypeBadge = (type) => {
    const colors = {
      casual: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      sick: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      annual: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      maternity: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      paternity: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      unpaid: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    
    const labels = {
      casual: 'Casual',
      sick: 'Sick',
      annual: 'Annual',
      maternity: 'Maternity',
      paternity: 'Paternity',
      unpaid: 'Unpaid'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {labels[type]}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leave Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employee leave requests and approvals
          </p>
        </div>
        
        {pendingLeaves.length > 0 && isHR && (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
            <Clock size={20} />
            <span className="font-medium">{pendingLeaves.length} pending requests</span>
          </div>
        )}
      </div>
      
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Leaves</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                <Calendar size={20} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="p-2 rounded-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-2 rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                <XCircle size={20} />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="p-2 rounded-lg text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          
          {/* Leave Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              {leaveTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
      
      {/* Leave Requests Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No leave requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search || typeFilter || statusFilter 
                ? 'Try adjusting your search or filters' 
                : 'No leave requests available'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredLeaves.length} of {leaves.length} requests
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
                    <th className="table-header">Leave Type</th>
                    <th className="table-header">Date Range</th>
                    <th className="table-header">Days</th>
                    <th className="table-header">Reason</th>
                    <th className="table-header">Status</th>
                    {isHR && <th className="table-header">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {leave.employeeName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {leave.employeeName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(leave.leaveType)}
                      </td>
                      <td className="table-cell">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </td>
                      <td className="table-cell">
                        {leave.totalDays || 1}
                      </td>
                      <td className="table-cell max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(leave.status)}
                      </td>
                      {isHR && leave.status === 'pending' && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveLeave(leave.id)}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30 rounded text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectLeave(leave.id)}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/30 rounded text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;