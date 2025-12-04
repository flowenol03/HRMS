import React, { useState, useEffect } from 'react';
import { useAttendanceViewModel } from '../../viewmodels/AttendanceViewModel';
import { useAuth } from '../../hooks/useAuth';
import { 
  Calendar, 
  Search, 
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const AttendanceList = () => {
  const { 
    attendance,
    loading,
    getAttendanceSummary,
    updateAttendanceStatus
  } = useAttendanceViewModel();
  
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const filtered = attendance.filter(item => {
      if (search && !item.employeeName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (dateFilter && item.date !== dateFilter) {
        return false;
      }
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
    
    setFilteredAttendance(filtered);
    
    // Calculate summary for today
    const todaySummary = getAttendanceSummary('', new Date().getMonth() + 1, new Date().getFullYear());
    setSummary(todaySummary);
  }, [attendance, search, dateFilter, statusFilter, getAttendanceSummary]);
  
  const statuses = [
    { value: 'present', label: 'Present', icon: CheckCircle, color: 'green' },
    { value: 'absent', label: 'Absent', icon: XCircle, color: 'red' },
    { value: 'late', label: 'Late', icon: Clock, color: 'orange' },
    { value: 'half-day', label: 'Half Day', icon: AlertCircle, color: 'yellow' },
    { value: 'leave', label: 'On Leave', icon: Calendar, color: 'blue' }
  ];
  
  const getStatusIcon = (status) => {
    const statusInfo = statuses.find(s => s.value === status);
    return statusInfo ? statusInfo.icon : CheckCircle;
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'text-green-600 dark:text-green-400';
      case 'absent': return 'text-red-600 dark:text-red-400';
      case 'late': return 'text-orange-600 dark:text-orange-400';
      case 'half-day': return 'text-yellow-600 dark:text-yellow-400';
      case 'leave': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  const getStatusBadge = (status) => {
    const colors = {
      present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      late: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'half-day': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      leave: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };
  
  const canUpdateStatus = user?.role === 'admin' || user?.role === 'hr';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track and manage employee attendance
        </p>
      </div>
      
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statuses.map((status) => (
            <div key={status.value} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {status.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {summary[status.value] || 0}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status.value)} bg-white dark:bg-gray-800`}>
                  <status.icon size={20} />
                </div>
              </div>
            </div>
          ))}
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
          
          {/* Date Filter */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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
      
      {/* Attendance Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No attendance records found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search || dateFilter || statusFilter 
                ? 'Try adjusting your search or filters' 
                : 'No attendance records available'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAttendance.length} of {attendance.length} records
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
                    <th className="table-header">Date</th>
                    <th className="table-header">Check In</th>
                    <th className="table-header">Check Out</th>
                    <th className="table-header">Hours</th>
                    <th className="table-header">Status</th>
                    {canUpdateStatus && <th className="table-header">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAttendance.map((record) => {
                    const Icon = getStatusIcon(record.status);
                    const hours = record.checkIn && record.checkOut 
                      ? `${((new Date(`2000-01-01T${record.checkOut}:00`) - new Date(`2000-01-01T${record.checkIn}:00`)) / (1000 * 60 * 60)).toFixed(1)}h`
                      : '-';
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {record.employeeName?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.employeeName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          {formatDate(record.date)}
                        </td>
                        <td className="table-cell">
                          {record.checkIn ? formatTime(record.checkIn) : '-'}
                        </td>
                        <td className="table-cell">
                          {record.checkOut ? formatTime(record.checkOut) : '-'}
                        </td>
                        <td className="table-cell">
                          {hours}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Icon size={16} className={getStatusColor(record.status)} />
                            {getStatusBadge(record.status)}
                          </div>
                        </td>
                        {canUpdateStatus && (
                          <td className="px-6 py-4">
                            <select
                              value={record.status}
                              onChange={(e) => updateAttendanceStatus(record.id, e.target.value)}
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                            >
                              {statuses.map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        )}
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

export default AttendanceList;