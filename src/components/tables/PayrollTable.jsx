import React from 'react';
import { DollarSign, Eye, Edit, Trash2, CheckCircle, Clock, Download } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const PayrollTable = ({ 
  payroll,
  onView,
  onEdit,
  onDelete,
  onGeneratePayslip,
  onProcessPayment,
  generatingPdf = false
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      processed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="table-header">Employee</th>
            <th className="table-header">Period</th>
            <th className="table-header">Payment Date</th>
            <th className="table-header">Basic Salary</th>
            <th className="table-header">Gross Salary</th>
            <th className="table-header">Net Salary</th>
            <th className="table-header">Status</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {payroll.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.employeeName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.employeeName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {item.employeeId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatDate(item.payPeriodStart)} - {formatDate(item.payPeriodEnd)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatDate(item.paymentDate)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatCurrency(item.basicSalary)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-white font-medium">
                  {formatCurrency(item.grossSalary)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(item.netSalary)}
                </div>
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(item.status)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onGeneratePayslip?.(item.id)}
                    disabled={generatingPdf}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:opacity-70 transition-opacity"
                    title="Generate Payslip"
                  >
                    {generatingPdf ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                  
                  <button
                    onClick={() => onView?.(item)}
                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:opacity-70 transition-opacity"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:opacity-70 transition-opacity"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  
                  {onProcessPayment && item.status === 'pending' && (
                    <button
                      onClick={() => onProcessPayment(item.id)}
                      className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30 rounded font-medium"
                    >
                      Pay Now
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:opacity-70 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;