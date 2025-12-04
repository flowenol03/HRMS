import React, { useState } from 'react';
import { useLeaveViewModel } from '../../viewmodels/LeaveViewModel';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const ApplyLeave = () => {
  const { handleApplyLeave, loading } = useLeaveViewModel();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave', description: 'For personal work or emergencies' },
    { value: 'sick', label: 'Sick Leave', description: 'For medical reasons' },
    { value: 'annual', label: 'Annual Leave', description: 'Planned vacation' },
    { value: 'maternity', label: 'Maternity Leave', description: 'For childbirth and recovery' },
    { value: 'paternity', label: 'Paternity Leave', description: 'For new fathers' },
    { value: 'unpaid', label: 'Unpaid Leave', description: 'Leave without pay' }
  ];
  
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // Inclusive of both start and end dates
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = await handleApplyLeave(formData);
    
    if (result.success) {
      setSuccess(true);
      setFormData({
        leaveType: 'casual',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    }
  };
  
  const totalDays = calculateDays();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Apply for Leave
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Submit a leave request for approval
        </p>
      </div>
      
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-green-600 dark:text-green-400" size={20} />
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                Leave application submitted successfully!
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your leave request has been sent for approval.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Form */}
        <div className="lg:col-span-2 card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Leave Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {leaveTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, leaveType: type.value }))}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      formData.leaveType === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
              {errors.leaveType && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.leaveType}</p>
              )}
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>
                )}
              </div>
            </div>
            
            {/* Duration Summary */}
            {totalDays > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Leave Days</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDays}</p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    <Clock size={24} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Leave *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className={`input-field ${errors.reason ? 'border-red-500' : ''}`}
                placeholder="Please provide details about your leave request..."
              />
              {errors.reason && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? 'Submitting...' : 'Submit Leave Request'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Leave Balance */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Leave Balance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Casual Leave</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">For personal work</p>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                12
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sick Leave</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">For medical reasons</p>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                10
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Annual Leave</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Planned vacation</p>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                15
              </div>
            </div>
          </div>
          
          {/* Important Notes */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Submit leave requests at least 3 days in advance
              </li>
              <li className="flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Attach medical certificates for sick leaves
              </li>
              <li className="flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Check with your manager before applying for long leaves
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;