import React from 'react';
import { 
  Edit, 
  Trash2, 
  MoreVertical,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const EmployeeTable = ({ 
  employees,
  onEdit,
  onDelete,
  onView,
  onStatusChange
}) => {
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      probation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };
  
  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      hr: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      employee: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    
    const labels = {
      admin: 'Admin',
      hr: 'HR',
      employee: 'Employee'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="table-header">Employee</th>
            <th className="table-header">Role</th>
            <th className="table-header">Department</th>
            <th className="table-header">Designation</th>
            <th className="table-header">Status</th>
            <th className="table-header">Join Date</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {employee.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {employee.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {getRoleBadge(employee.role)}
              </td>
              <td className="table-cell">
                {employee.department}
              </td>
              <td className="table-cell">
                {employee.designation}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(employee.status)}
              </td>
              <td className="table-cell">
                {formatDate(employee.joinDate)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onView?.(employee)}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit?.(employee)}
                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onStatusChange?.(employee)}
                    className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="Change Status"
                  >
                    {employee.status === 'active' ? (
                      <UserX size={16} />
                    ) : (
                      <UserCheck size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete?.(employee)}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;