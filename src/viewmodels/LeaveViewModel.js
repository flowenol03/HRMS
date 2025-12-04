import { useState, useCallback, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import { LeaveModel } from '../models/LeaveModel';
import { validateDate } from '../utils/validators';

export const useLeaveViewModel = () => {
  const { data: leaves, loading, error, fetchData, create, update } = useFirebase('leaves');
  const { data: employees } = useFirebase('users');
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [fetchData]);
  
  const validateLeaveForm = (data) => {
    const errors = {};
    
    if (!data.leaveType) {
      errors.leaveType = 'Leave type is required';
    }
    
    if (!validateDate(data.startDate)) {
      errors.startDate = 'Valid start date is required';
    }
    
    if (!validateDate(data.endDate)) {
      errors.endDate = 'Valid end date is required';
    }
    
    if (new Date(data.startDate) > new Date(data.endDate)) {
      errors.endDate = 'End date cannot be before start date';
    }
    
    if (!data.reason?.trim()) {
      errors.reason = 'Reason is required';
    }
    
    return errors;
  };
  
  const handleApplyLeave = useCallback(async (leaveData) => {
    const errors = validateLeaveForm(leaveData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const employee = employees?.find(e => e.username === user.username);
      
      const leave = new LeaveModel({
        ...leaveData,
        employeeId: user.username,
        employeeName: employee?.fullName || user.username,
        status: 'pending'
      });
      
      await create(leave.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Leave Applied',
        message: `Your ${leave.leaveType} leave application has been submitted.`,
        module: 'LEAVE'
      });
      
      setIsModalOpen(false);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Application Failed',
        message: error.message,
        module: 'LEAVE'
      });
      
      return { success: false, error: error.message };
    }
  }, [user, employees, create, addNotification]);
  
  const handleApproveLeave = useCallback(async (leaveId, comments = '') => {
    try {
      await update(leaveId, {
        status: 'approved',
        approvedBy: user?.username,
        comments,
        updatedAt: new Date().toISOString()
      });
      
      const leave = leaves.find(l => l.id === leaveId);
      
      addNotification({
        type: 'success',
        title: 'Leave Approved',
        message: `${leave?.employeeName}'s leave has been approved.`,
        module: 'LEAVE'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Approval Failed',
        message: error.message,
        module: 'LEAVE'
      });
      
      return { success: false, error: error.message };
    }
  }, [user, leaves, update, addNotification]);
  
  const handleRejectLeave = useCallback(async (leaveId, comments = '') => {
    try {
      await update(leaveId, {
        status: 'rejected',
        approvedBy: user?.username,
        comments,
        updatedAt: new Date().toISOString()
      });
      
      const leave = leaves.find(l => l.id === leaveId);
      
      addNotification({
        type: 'warning',
        title: 'Leave Rejected',
        message: `${leave?.employeeName}'s leave has been rejected.`,
        module: 'LEAVE'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Rejection Failed',
        message: error.message,
        module: 'LEAVE'
      });
      
      return { success: false, error: error.message };
    }
  }, [user, leaves, update, addNotification]);
  
  const getEmployeeLeaves = useCallback((employeeId) => {
    return leaves.filter(leave => leave.employeeId === employeeId);
  }, [leaves]);
  
  const getPendingLeaves = useCallback(() => {
    return leaves.filter(leave => leave.status === 'pending');
  }, [leaves]);
  
  const getLeaveStats = useCallback((employeeId) => {
    const employeeLeaves = employeeId 
      ? leaves.filter(l => l.employeeId === employeeId)
      : leaves;
    
    const stats = {
      total: employeeLeaves.length,
      approved: employeeLeaves.filter(l => l.status === 'approved').length,
      rejected: employeeLeaves.filter(l => l.status === 'rejected').length,
      pending: employeeLeaves.filter(l => l.status === 'pending').length,
      byType: {}
    };
    
    employeeLeaves.forEach(leave => {
      stats.byType[leave.leaveType] = (stats.byType[leave.leaveType] || 0) + 1;
    });
    
    return stats;
  }, [leaves]);
  
  const handleSelectLeave = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
    setFormErrors({});
  };
  
  return {
    leaves,
    loading,
    error,
    formErrors,
    isModalOpen,
    selectedLeave,
    handleApplyLeave,
    handleApproveLeave,
    handleRejectLeave,
    getEmployeeLeaves,
    getPendingLeaves,
    getLeaveStats,
    handleSelectLeave,
    handleCloseModal,
    refresh: fetchData
  };
};