import { useState, useCallback } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useNotifications } from '../hooks/useNotifications';
import { UserModel } from '../models/UserModel';
import { validateEmployeeForm } from '../utils/validators';

export const useEmployeeViewModel = () => {
  const { data: employees, loading, error, fetchData, create, update, remove } = useFirebase('users');
  const { addNotification } = useNotifications();
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const loadEmployees = useCallback(async () => {
    try {
      await fetchData();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error Loading Employees',
        message: error.message,
        module: 'EMPLOYEE'
      });
    }
  }, [fetchData, addNotification]);
  
  const handleCreate = async (employeeData) => {
    const errors = validateEmployeeForm(employeeData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const employee = new UserModel(employeeData);
      await create(employee.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Employee Created',
        message: `${employee.fullName} has been added successfully.`,
        module: 'EMPLOYEE'
      });
      
      setIsModalOpen(false);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Create Failed',
        message: error.message,
        module: 'EMPLOYEE'
      });
      
      return { success: false, error: error.message };
    }
  };
  
  const handleUpdate = async (id, updates) => {
    const errors = validateEmployeeForm(updates);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const employee = new UserModel(updates);
      await update(id, employee.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Employee Updated',
        message: `${employee.fullName}'s details have been updated.`,
        module: 'EMPLOYEE'
      });
      
      setIsModalOpen(false);
      setSelectedEmployee(null);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
        module: 'EMPLOYEE'
      });
      
      return { success: false, error: error.message };
    }
  };
  
  const handleDelete = async (id, employeeName) => {
    try {
      await remove(id);
      
      addNotification({
        type: 'success',
        title: 'Employee Deleted',
        message: `${employeeName} has been removed from the system.`,
        module: 'EMPLOYEE'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.message,
        module: 'EMPLOYEE'
      });
      
      return { success: false, error: error.message };
    }
  };
  
  const handleSelect = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setFormErrors({});
  };
  
  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id);
  };
  
  const getFilteredEmployees = (filters = {}) => {
    let filtered = [...employees];
    
    if (filters.department) {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }
    
    if (filters.status) {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.fullName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.designation.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };
  
  return {
    employees,
    loading,
    error,
    selectedEmployee,
    isModalOpen,
    formErrors,
    loadEmployees,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSelect,
    handleCloseModal,
    getEmployeeById,
    getFilteredEmployees,
    setIsModalOpen
  };
};