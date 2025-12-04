import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const AttendanceTable = ({ 
  attendance,
  onUpdateStatus,
  showEmployee = true
}) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return CheckCircle;
      case 'absent': return XCircle;
      case 'late': return Clock;
      case 'half-day': return AlertCircle;
      case 'leave': return Calendar;
      default: return Clock;
    }
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

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    
    let hours = outHour - inHour;
    let minutes = outMin - inMin;
    
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            {showEmployee && <th className="table-header">Employee</th>}
            <th className="table-header">Date</th>
            <th className="table-header">Check In</th>
            <th className="table-header">Check Out</th>
            <th className="table-header">Hours</th>
            <th className="table-header">Status</th>
            {onUpdateStatus && <th className="table-header">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {attendance.map((record) => {
            const Icon = getStatusIcon(record.status);
            
            return (
              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {showEmployee && (
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
                )}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(record.date)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {record.checkIn ? formatTime(record.checkIn) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {record.checkOut ? formatTime(record.checkOut) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {calculateHours(record.checkIn, record.checkOut)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon size={16} className={getStatusColor(record.status)} />
                    {getStatusBadge(record.status)}
                  </div>
                </td>
                {onUpdateStatus && (
                  <td className="px-6 py-4">
                    <select
                      value={record.status}
                      onChange={(e) => onUpdateStatus(record.id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half-day">Half Day</option>
                      <option value="leave">Leave</option>
                    </select>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;