import React, { useState, useEffect } from 'react';
import { usePayrollViewModel } from '../../viewmodels/PayrollViewModel';
import { useAuth } from '../../hooks/useAuth';
import { 
  DollarSign, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const PayrollList = () => {
  const { 
    payroll,
    loading,
    handleDeletePayroll,
    handleGeneratePayslip,
    handleProcessPayment,
    generatingPdf,
    getPayrollStats
  } = usePayrollViewModel();
  
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [filteredPayroll, setFilteredPayroll] = useState([]);
  const [stats, setStats] = useState(null);
  
  const isHR = user?.role === 'admin' || user?.role === 'hr';
  
  useEffect(() => {
    const filtered = payroll.filter(item => {
      if (search && !item.employeeName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      if (monthFilter) {
        const paymentMonth = item.paymentDate?.substring(0, 7); // YYYY-MM
        if (paymentMonth !== monthFilter) return false;
      }
      return true;
    });
    
    setFilteredPayroll(filtered);
    setStats(getPayrollStats());
  }, [payroll, search, statusFilter, monthFilter, getPayrollStats]);
  
  const statuses = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'processed', label: 'Processed', color: 'blue' },
    { value: 'paid', label: 'Paid', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];
  
  const months = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, i, 1);
    const month = date.toISOString().substring(0, 7);
    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.push({ value: month, label });
  }
  
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
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payroll Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employee salaries and generate payslips
          </p>
        </div>
        
        {isHR && (
          <button className="btn-primary flex items-center space-x-2">
            <DollarSign size={20} />
            <span>Process Payroll</span>
          </button>
        )}
      </div>
      
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stats.totalAmount)}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.paid}
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
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.draft}
                </p>
              </div>
              <div className="p-2 rounded-lg text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                <XCircle size={20} />
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
          
          {/* Month Filter */}
          <div>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
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
      
      {/* Payroll Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPayroll.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No payroll records found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search || monthFilter || statusFilter 
                ? 'Try adjusting your search or filters' 
                : 'No payroll records available'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredPayroll.length} of {payroll.length} records
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
                    <th className="table-header">Period</th>
                    <th className="table-header">Payment Date</th>
                    <th className="table-header">Gross Salary</th>
                    <th className="table-header">Net Salary</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPayroll.map((item) => (
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
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        {formatDate(item.payPeriodStart)} - {formatDate(item.payPeriodEnd)}
                      </td>
                      <td className="table-cell">
                        {formatDate(item.paymentDate)}
                      </td>
                      <td className="table-cell font-medium">
                        {formatCurrency(item.grossSalary || 0)}
                      </td>
                      <td className="table-cell font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(item.netSalary || 0)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleGeneratePayslip(item.id)}
                            disabled={generatingPdf}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Generate Payslip"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {isHR && item.status === 'pending' && (
                            <button
                              onClick={() => handleProcessPayment(item.id)}
                              className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30 rounded font-medium"
                            >
                              Pay
                            </button>
                          )}
                          
                          {isHR && (
                            <>
                              <button
                                className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletePayroll(item.id, item.employeeName)}
                                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
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

export default PayrollList;