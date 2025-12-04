import { useState, useCallback, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import { PerformanceModel } from '../models/PerformanceModel';

export const usePerformanceViewModel = () => {
  const { data: performances, loading, error, fetchData, create, update } = useFirebase('performances');
  const { data: employees } = useFirebase('users');
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [fetchData]);
  
  const validatePerformanceForm = (data) => {
    const errors = {};
    
    if (!data.employeeId) {
      errors.employeeId = 'Employee is required';
    }
    
    if (!data.reviewPeriod) {
      errors.reviewPeriod = 'Review period is required';
    }
    
    if (!data.reviewDate) {
      errors.reviewDate = 'Review date is required';
    }
    
    // Validate ratings (1-5)
    const ratings = data.ratings || {};
    Object.values(ratings).forEach(rating => {
      if (rating < 1 || rating > 5) {
        errors.ratings = 'All ratings must be between 1 and 5';
      }
    });
    
    if (!data.feedback?.trim()) {
      errors.feedback = 'Feedback is required';
    }
    
    return errors;
  };
  
  const handleCreatePerformance = useCallback(async (performanceData) => {
    const errors = validatePerformanceForm(performanceData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const employee = employees?.find(e => e.username === performanceData.employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      const reviewer = user;
      
      const performance = new PerformanceModel({
        ...performanceData,
        employeeName: employee.fullName,
        reviewerId: reviewer.username,
        reviewerName: reviewer.fullName || reviewer.username,
        status: 'in-review'
      });
      
      await create(performance.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Performance Review Created',
        message: `Performance review for ${employee.fullName} has been created.`,
        module: 'PERFORMANCE'
      });
      
      setIsModalOpen(false);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message,
        module: 'PERFORMANCE'
      });
      
      return { success: false, error: error.message };
    }
  }, [employees, user, create, addNotification]);
  
  const handleUpdatePerformance = useCallback(async (id, updates) => {
    const errors = validatePerformanceForm(updates);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    
    try {
      const performance = new PerformanceModel(updates);
      
      await update(id, performance.toFirebase());
      
      addNotification({
        type: 'success',
        title: 'Performance Review Updated',
        message: 'Performance review has been updated.',
        module: 'PERFORMANCE'
      });
      
      setIsModalOpen(false);
      setSelectedPerformance(null);
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
        module: 'PERFORMANCE'
      });
      
      return { success: false, error: error.message };
    }
  }, [update, addNotification]);
  
  const handleAcknowledge = useCallback(async (id) => {
    try {
      await update(id, {
        status: 'acknowledged',
        updatedAt: new Date().toISOString()
      });
      
      addNotification({
        type: 'success',
        title: 'Review Acknowledged',
        message: 'You have acknowledged the performance review.',
        module: 'PERFORMANCE'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Acknowledgement Failed',
        message: error.message,
        module: 'PERFORMANCE'
      });
      
      return { success: false, error: error.message };
    }
  }, [update, addNotification]);
  
  const handleComplete = useCallback(async (id) => {
    try {
      await update(id, {
        status: 'completed',
        updatedAt: new Date().toISOString()
      });
      
      addNotification({
        type: 'success',
        title: 'Review Completed',
        message: 'Performance review has been marked as completed.',
        module: 'PERFORMANCE'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Completion Failed',
        message: error.message,
        module: 'PERFORMANCE'
      });
      
      return { success: false, error: error.message };
    }
  }, [update, addNotification]);
  
  const getEmployeePerformance = useCallback((employeeId) => {
    return performances.filter(p => p.employeeId === employeeId);
  }, [performances]);
  
  const getPerformanceStats = useCallback((employeeId) => {
    const employeePerformances = employeeId 
      ? performances.filter(p => p.employeeId === employeeId)
      : performances;
    
    if (employeePerformances.length === 0) {
      return {
        averageScore: 0,
        totalReviews: 0,
        highestScore: 0,
        lowestScore: 0,
        recentReviews: []
      };
    }
    
    const scores = employeePerformances.map(p => p.overallScore);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    return {
      averageScore: Math.round(averageScore * 100) / 100,
      totalReviews: employeePerformances.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      recentReviews: employeePerformances
        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
        .slice(0, 5)
    };
  }, [performances]);
  
  const handleSelectPerformance = (performance) => {
    setSelectedPerformance(performance);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerformance(null);
    setFormErrors({});
  };
  
  return {
    performances,
    loading,
    error,
    selectedPerformance,
    isModalOpen,
    formErrors,
    handleCreatePerformance,
    handleUpdatePerformance,
    handleAcknowledge,
    handleComplete,
    getEmployeePerformance,
    getPerformanceStats,
    handleSelectPerformance,
    handleCloseModal,
    refresh: fetchData
  };
};