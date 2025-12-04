import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployeeViewModel } from '../../viewmodels/EmployeeViewModel';
import { useAttendanceViewModel } from '../../viewmodels/AttendanceViewModel';
import { useLeaveViewModel } from '../../viewmodels/LeaveViewModel';
import { usePayrollViewModel } from '../../viewmodels/PayrollViewModel';
import { usePerformanceViewModel } from '../../viewmodels/PerformanceViewModel';
import ProfileCard from '../../components/cards/ProfileCard';
import AttendanceTable from '../../components/tables/AttendanceTable';
import PayrollTable from '../../components/tables/PayrollTable';
import PerformanceTable from '../../components/tables/PerformanceTable';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Clock,
  TrendingUp,
  User
} from 'lucide-react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { employees, getEmployeeById } = useEmployeeViewModel();
  const { attendance, getEmployeeAttendance } = useAttendanceViewModel();
  const { leaves, getEmployeeLeaves } = useLeaveViewModel();
  const { payroll, getEmployeePayroll } = usePayrollViewModel();
  const { performances, getEmployeePerformance } = usePerformanceViewModel();
  
  const [employee, setEmployee] = useState(null);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [employeePayroll, setEmployeePayroll] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const emp = getEmployeeById(id);
    setEmployee(emp);
    
    if (emp) {
      setEmployeeAttendance(getEmployeeAttendance(emp.username));
      setEmployeeLeaves(getEmployeeLeaves(emp.username));
      setEmployeePayroll(getEmployeePayroll(emp.username));
      setEmployeePerformance(getEmployeePerformance(emp.username));
    }
  }, [id, employees, getEmployeeById, getEmployeeAttendance, getEmployeeLeaves, getEmployeePayroll, getEmployeePerformance]);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Employee not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The employee you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/employees')}
          className="btn-primary"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leaves', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ProfileCard employee={employee} />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendance (This Month)</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {employeeAttendance.filter(a => a.status === 'present').length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                    <Clock size={20} />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Leaves</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {employeeLeaves.length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                    <Calendar size={20} />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Salary</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ₹{employeePayroll.length > 0 
                        ? Math.round(employeePayroll.reduce((sum, p) => sum + p.netSalary, 0) / employeePayroll.length).toLocaleString('en-IN')
                        : '0'}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20">
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Performance</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {employeePerformance.length > 0 
                        ? (employeePerformance.reduce((sum, p) => sum + p.overallScore, 0) / employeePerformance.length).toFixed(1)
                        : '0.0'}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'attendance':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Attendance Records
            </h3>
            {employeeAttendance.length > 0 ? (
              <AttendanceTable 
                attendance={employeeAttendance}
                showEmployee={false}
              />
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No attendance records found</p>
              </div>
            )}
          </div>
        );
      
      case 'leaves':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Leave History
            </h3>
            {employeeLeaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="table-header">Type</th>
                      <th className="table-header">Date Range</th>
                      <th className="table-header">Days</th>
                      <th className="table-header">Reason</th>
                      <th className="table-header">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {employeeLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            leave.leaveType === 'casual' ? 'bg-blue-100 text-blue-800' :
                            leave.leaveType === 'sick' ? 'bg-green-100 text-green-800' :
                            leave.leaveType === 'annual' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {leave.leaveType?.charAt(0).toUpperCase() + leave.leaveType?.slice(1)}
                          </span>
                        </td>
                        <td className="table-cell">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="table-cell">{leave.totalDays || 1}</td>
                        <td className="table-cell max-w-xs truncate">{leave.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No leave records found</p>
              </div>
            )}
          </div>
        );
      
      case 'payroll':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payroll History
            </h3>
            {employeePayroll.length > 0 ? (
              <PayrollTable 
                payroll={employeePayroll}
                showEmployee={false}
              />
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No payroll records found</p>
              </div>
            )}
          </div>
        );
      
      case 'performance':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Reviews
            </h3>
            {employeePerformance.length > 0 ? (
              <PerformanceTable 
                performances={employeePerformance}
                showEmployee={false}
              />
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No performance reviews found</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Employee ID: {employee.username} • {employee.designation}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/employees/edit/${id}`)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit size={16} />
          <span>Edit Employee</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default EmployeeDetail;