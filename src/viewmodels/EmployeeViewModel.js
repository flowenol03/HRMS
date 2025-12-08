// src/viewmodels/EmployeeViewModel.js
import { useState, useEffect, useCallback } from 'react';
import { dbService } from '../firebase/firebaseService';

export const useEmployeeViewModel = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch employees from Firebase (users collection)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employeeList = await dbService.getAll('users'); // Changed to 'users'
        // Filter out system users if needed
        const filteredEmployees = employeeList.filter(user => 
          user.role && ['admin', 'hr', 'employee'].includes(user.role)
        );
        setEmployees(filteredEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Real-time listener for users
  useEffect(() => {
    const unsubscribe = dbService.listen('users', (userList) => {
      // Filter for employee users only
      const employeeList = userList.filter(user => 
        user.role && ['admin', 'hr', 'employee'].includes(user.role)
      );
      setEmployees(employeeList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getEmployeeById = useCallback((id) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  const getEmployeeByUsername = useCallback((username) => {
    return employees.find(emp => emp.username === username);
  }, [employees]);

  const handleCreate = async (employeeData) => {
    try {
      // Prepare employee data for database
      const employeeToSave = {
        ...employeeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: employeeData.status || 'active',
        joinDate: employeeData.joinDate || new Date().toISOString()
      };

      // Save to Realtime Database under users collection
      await dbService.create('users', employeeToSave);
      
      return { success: true };
    } catch (error) {
      console.error('Error creating employee:', error);
      return { success: false, error: error.message };
    }
  };

  const handleUpdate = async (id, employeeData) => {
    try {
      const employeeToUpdate = {
        ...employeeData,
        updatedAt: new Date().toISOString()
      };

      await dbService.update(`users/${id}`, employeeToUpdate);
      return { success: true };
    } catch (error) {
      console.error('Error updating employee:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDelete = async (id) => {
    try {
      await dbService.delete(`users/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return { success: false, error: error.message };
    }
  };

  const getFilteredEmployees = useCallback((filters = {}) => {
    let filtered = [...employees];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.fullName?.toLowerCase().includes(searchTerm) ||
        emp.email?.toLowerCase().includes(searchTerm) ||
        emp.username?.toLowerCase().includes(searchTerm) ||
        emp.department?.toLowerCase().includes(searchTerm) ||
        emp.designation?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.department && filters.department !== '') {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }

    if (filters.status && filters.status !== '') {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }

    if (filters.role && filters.role !== '') {
      filtered = filtered.filter(emp => emp.role === filters.role);
    }

    return filtered;
  }, [employees]);

  // Get unique departments for filter dropdown
  const getDepartments = useCallback(() => {
    const departments = employees.map(emp => emp.department).filter(Boolean);
    return [...new Set(departments)];
  }, [employees]);

  return {
    employees,
    loading,
    selectedEmployee,
    isModalOpen,
    setSelectedEmployee,
    setIsModalOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    getEmployeeById,
    getEmployeeByUsername,
    getFilteredEmployees,
    getDepartments,
    handleSelect: setSelectedEmployee,
    handleCloseModal: () => {
      setIsModalOpen(false);
      setSelectedEmployee(null);
    }
  };
};