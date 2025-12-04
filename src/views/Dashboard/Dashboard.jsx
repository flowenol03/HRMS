import React from 'react';
import { useDashboardViewModel } from '../../viewmodels/DashboardViewModel';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import { 
  Users,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateUtils';

const Dashboard = () => {
  const { stats, recentActivities, getRoleBasedData, user } = useDashboardViewModel();
  const roleBasedData = getRoleBasedData();
  
  const analyticsCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'primary',
      change: '+12%',
      changeType: 'positive',
      description: 'From last month'
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: CheckCircle,
      color: 'green',
      change: '+5%',
      changeType: 'positive',
      description: 'Attendance rate'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      color: 'orange',
      change: '-3%',
      changeType: 'negative',
      description: 'Awaiting approval'
    },
    {
      title: 'Total Payroll',
      value: `₹${stats.totalPayroll.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'purple',
      change: '+8%',
      changeType: 'positive',
      description: 'This month'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}
        </p>
      </div>
      
      {/* Employee Dashboard */}
      {user?.role === 'employee' && roleBasedData.employee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Info Card */}
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {roleBasedData.employee.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {roleBasedData.employee.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {roleBasedData.employee.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {roleBasedData.employee.designation}
                </p>
              </div>
            </div>
          </div>
          
          {/* Attendance Status */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Attendance
            </h2>
            {roleBasedData.todayAttendance ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Check In:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {roleBasedData.todayAttendance.checkIn || 'Not checked in'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Check Out:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {roleBasedData.todayAttendance.checkOut || 'Not checked out'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    roleBasedData.todayAttendance.status === 'present' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {roleBasedData.todayAttendance.status?.charAt(0).toUpperCase() + roleBasedData.todayAttendance.status?.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No attendance record for today
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <AnalyticsCard key={index} {...card} />
        ))}
      </div>
      
      {/* Recent Activities */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activities
        </h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'attendance' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                    activity.type === 'leave' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                    'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  }`}>
                    {activity.type === 'attendance' && <Clock size={16} />}
                    {activity.type === 'leave' && <Calendar size={16} />}
                    {activity.type === 'payroll' && <DollarSign size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(activity.date)} at {activity.time}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.type === 'attendance' ? 'Attendance' :
                   activity.type === 'leave' ? 'Leave' : 'Payroll'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activities
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;