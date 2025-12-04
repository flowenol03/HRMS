import { useState, useCallback, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import { PayrollModel } from '../models/PayrollModel';
import { generatePayslip } from '../utils/pdfUtils';
import { validateSalary, validateDate } from '../utils/validators';

export const usePayrollViewModel = () => {
  const { data: payroll, loading, error, fetchData, create, update, remove } = useFirebase('payroll');
  const { data: employees } = useFirebase('users');
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [fetchData]);
  
  const validatePayrollForm = (data) => {
    const errors = {};
    
    if (!data.employeeId) {
      errors.employeeId = 'Employee is required';
    }
    
    if (!validateSalary(data.basicSalary)) {
      errors.basicSalary = 'Valid basic salary is required';
    }
    
    if (!validateDate(data.payPeriodStart)) {
      errors.payPeriodStart = 'Valid start date is required';
    }
    
    if (!validateDate(data.payPeriodEnd)) {
      errors.payPeriodEnd = 'Valid end date is required';
    }
    
    if (!validateDate(data.paymentDate)) {
      errors.paymentDate = 'Valid payment date is required';
    }
    
    if (new Date(data.payPeriodStart) > new Date(data.payPeriodEnd)) {
      errors.payPeriodEnd = 'End date cannot be before start date';
    }
    
    return errors;
  };
  
  const handleCreatePayroll = useCallback(async (payrollData) => {
    const errors = validatePayrollForm(payrollData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const employee = employees?.find(e => e.username === payrollData.employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      const payrollModel = new PayrollModel({
        ...payrollData,
        employeeName: employee.fullName,
        tax: payrollData.tax || 0
      });
      
      payrollModel.recalculateTax();
      
      await create(payrollModel.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Payroll Created',
        message: `Payroll for ${employee.fullName} has been created.`,
        module: 'PAYROLL'
      });
      
      setIsModalOpen(false);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message,
        module: 'PAYROLL'
      });
      
      return { success: false, error: error.message };
    }
  }, [employees, create, addNotification]);
  
  const handleUpdatePayroll = useCallback(async (id, updates) => {
    const errors = validatePayrollForm(updates);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const payrollModel = new PayrollModel(updates);
      payrollModel.recalculateTax();
      
      await update(id, payrollModel.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Payroll Updated',
        message: 'Payroll details have been updated.',
        module: 'PAYROLL'
      });
      
      setIsModalOpen(false);
      setSelectedPayroll(null);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
        module: 'PAYROLL'
      });
      
      return { success: false, error: error.message };
    }
  }, [update, addNotification]);
  
  const handleDeletePayroll = useCallback(async (id, employeeName) => {
    try {
      await remove(id);
      
      addNotification({
        type: 'success',
        title: 'Payroll Deleted',
        message: `Payroll for ${employeeName} has been deleted.`,
        module: 'PAYROLL'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.message,
        module: 'PAYROLL'
      });
      
      return { success: false, error: error.message };
    }
  }, [remove, addNotification]);
  
  const handleGeneratePayslip = useCallback(async (payrollId) => {
    setGeneratingPdf(true);
    
    try {
      const payrollItem = payroll.find(p => p.id === payrollId);
      if (!payrollItem) {
        throw new Error('Payroll not found');
      }
      
      const employee = employees?.find(e => e.username === payrollItem.employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      const company = {
        name: 'HRMS Corporation',
        address: '123 Business Street, Corporate City, CC 12345',
        phone: '+1 (555) 123-4567',
        email: 'hr@hrmscorp.com'
      };
      
      const pdfDoc = generatePayslip(employee, payrollItem, company);
      
      pdfDoc.save(`payslip-${employee.fullName}-${payrollItem.payPeriodStart}.pdf`);
      
      addNotification({
        type: 'success',
        title: 'Payslip Generated',
        message: `Payslip for ${employee.fullName} has been downloaded.`,
        module: 'PAYROLL'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: error.message,
        module: 'PAYROLL'
      });
      
      return { success: false, error: error.message };
    } finally {
      setGeneratingPdf(false);
    }
  }, [payroll, employees, addNotification]);
  
  const handleProcessPayment = useCallback(async (id) => {
    try {
      await update(id, {
        status: 'paid',
        updatedAt: new Date().toISOString()
      });
      
      const payrollItem = payroll.find(p => p.id === id);
      
      addNotification({
        type: 'success',
        title: 'Payment Processed',
        message: `Payment for ${payrollItem?.employeeName} has been processed.`,
        module: 'PAYROLL'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Processing Failed',
        message: error.message,
        module: 'PAYROLL'
      });
      
      return { success: false, error: error.message };
    }
  }, [payroll, update, addNotification]);
  
  const getEmployeePayroll = useCallback((employeeId) => {
    return payroll.filter(p => p.employeeId === employeeId);
  }, [payroll]);
  
  const getPayrollStats = useCallback(() => {
    const stats = {
      total: payroll.length,
      paid: payroll.filter(p => p.status === 'paid').length,
      pending: payroll.filter(p => p.status === 'pending').length,
      draft: payroll.filter(p => p.status === 'draft').length,
      totalAmount: payroll
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.netSalary || 0), 0),
      byMonth: {}
    };
    
    payroll.forEach(p => {
      const month = p.paymentDate?.substring(0, 7); // YYYY-MM
      if (month) {
        stats.byMonth[month] = (stats.byMonth[month] || 0) + (p.netSalary || 0);
      }
    });
    
    return stats;
  }, [payroll]);
  
  const handleSelectPayroll = (payrollItem) => {
    setSelectedPayroll(payrollItem);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayroll(null);
    setFormErrors({});
  };
  
  return {
    payroll,
    loading,
    error,
    selectedPayroll,
    isModalOpen,
    formErrors,
    generatingPdf,
    handleCreatePayroll,
    handleUpdatePayroll,
    handleDeletePayroll,
    handleGeneratePayslip,
    handleProcessPayment,
    getEmployeePayroll,
    getPayrollStats,
    handleSelectPayroll,
    handleCloseModal,
    refresh: fetchData
  };
};