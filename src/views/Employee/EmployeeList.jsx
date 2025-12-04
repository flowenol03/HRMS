import React, { useState, useEffect } from 'react';
import { useEmployeeViewModel } from '../../viewmodels/EmployeeViewModel';
import { useAuth } from '../../hooks/useAuth';
import EmployeeTable from '../../components/tables/EmployeeTable';
import Modal from '../../components/modals/Modal';
import { Plus, Search, Filter, Download } from 'lucide-react';
import EmployeeForm from './EmployeeForm';

const EmployeeList = () => {
  const { 
    employees,
    loading,
    selectedEmployee,
    isModalOpen,
    handleSelect,
    handleDelete,
    handleCloseModal,
    getFilteredEmployees,
    setIsModalOpen
  } = useEmployeeViewModel();
  
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  
  useEffect(() => {
    const filtered = getFilteredEmployees({
      search,
      department: departmentFilter || undefined,
      status: statusFilter || undefined
    });
    setFilteredEmployees(filtered);
  }, [employees, search, departmentFilter, statusFilter, getFilteredEmployees]);
  
  const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];
  const statuses = ['active', 'inactive', 'probation', 'suspended'];
  
  const canEdit = user?.role === 'admin' || user?.role === 'hr';
  const canDelete = user?.role === 'admin';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all employees in the organization
          </p>
        </div>
        
        {canEdit && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Employee</span>
          </button>
        )}
      </div>
      
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
                placeholder="Search employees..."
                className="input-field pl-10"
              />
            </div>
          </div>
          
          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
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
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No employees found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search ? 'Try adjusting your search or filters' : 'Add your first employee to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
            
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={canEdit ? handleSelect : undefined}
              onDelete={canDelete ? handleDelete : undefined}
              onView={handleSelect}
            />
          </>
        )}
      </div>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
      >
        <EmployeeForm
          employee={selectedEmployee}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default EmployeeList;