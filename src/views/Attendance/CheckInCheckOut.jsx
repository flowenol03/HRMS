import React from 'react';
import { useAttendanceViewModel } from '../../viewmodels/AttendanceViewModel';
import { useAuth } from '../../hooks/useAuth';
import { Clock, CheckCircle, XCircle, History } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const CheckInCheckOut = () => {
  const { 
    todayAttendance,
    checkInTime,
    checkOutTime,
    handleCheckIn,
    handleCheckOut,
    loading,
    getEmployeeAttendance
  } = useAttendanceViewModel();
  
  const { user } = useAuth();
  
  const employeeAttendance = getEmployeeAttendance(user?.username);
  const recentAttendance = employeeAttendance.slice(-5).reverse();
  
  const isCheckedIn = !!checkInTime;
  const isCheckedOut = !!checkOutTime;
  const canCheckIn = !isCheckedIn;
  const canCheckOut = isCheckedIn && !isCheckedOut;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daily Attendance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Check in and check out for today
        </p>
      </div>
      
      {/* Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check In/Out Card */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Attendance
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(new Date())}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Check In Button */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${canCheckIn ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Check In</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isCheckedIn ? `You checked in at ${formatTime(checkInTime)}` : 'Start your workday'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCheckIn}
                disabled={!canCheckIn || loading}
                className={`px-6 py-2 rounded-lg font-medium ${
                  canCheckIn 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                {loading ? 'Processing...' : 'Check In'}
              </button>
            </div>
            
            {/* Check Out Button */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${canCheckOut ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Check Out</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isCheckedOut ? `You checked out at ${formatTime(checkOutTime)}` : 'End your workday'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCheckOut}
                disabled={!canCheckOut || loading}
                className={`px-6 py-2 rounded-lg font-medium ${
                  canCheckOut 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                {loading ? 'Processing...' : 'Check Out'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isCheckedIn ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <CheckCircle size={16} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Checked In</span>
              </div>
              <span className={`font-medium ${isCheckedIn ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                {isCheckedIn ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isCheckedOut ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <XCircle size={16} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Checked Out</span>
              </div>
              <span className={`font-medium ${isCheckedOut ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                {isCheckedOut ? 'Yes' : 'No'}
              </span>
            </div>
            
            {todayAttendance && (
              <>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Status</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    todayAttendance.status === 'present' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : todayAttendance.status === 'late'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {todayAttendance.status?.charAt(0).toUpperCase() + todayAttendance.status?.slice(1)}
                  </div>
                </div>
                
                {todayAttendance.notes && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                    <p className="text-sm text-gray-900 dark:text-white">{todayAttendance.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Attendance History */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Attendance
          </h2>
          <History className="text-gray-400" size={20} />
        </div>
        
        {recentAttendance.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    record.status === 'present' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                    record.status === 'absent' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(record.date)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {record.checkIn ? formatTime(record.checkIn) : 'No check in'} • 
                      {record.checkOut ? formatTime(record.checkOut) : 'No check out'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  record.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInCheckOut;