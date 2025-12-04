import React, { useState, useEffect } from 'react';
import { UserModel } from '../../models/UserModel';
import { useEmployeeViewModel } from '../../viewmodels/EmployeeViewModel';
import { validateEmployeeForm } from '../../utils/validators';

const EmployeeForm = ({ employee, onClose }) => {
  const { handleCreate, handleUpdate } = useEmployeeViewModel();
  const [formData, setFormData] = useState(new UserModel());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (employee) {
      setFormData(new UserModel(employee));
    }
  }, [employee]);
  
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
    
    const validationErrors = validateEmployeeForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    
    if (employee) {
      // Update existing employee
      await handleUpdate(employee.id, formData);
    } else {
      // Create new employee
      await handleCreate(formData);
    }
    
    setLoading(false);
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john.doe@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
        
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`input-field ${errors.username ? 'border-red-500' : ''}`}
            placeholder="johndoe"
          />
        </div>
        
        {/* Password (only for new employees) */}
        {!employee && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Minimum 6 characters
            </p>
          </div>
        )}
        
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            {UserModel.getRoles().map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`input-field ${errors.department ? 'border-red-500' : ''}`}
          >
            <option value="">Select Department</option>
            {UserModel.getDepartments().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>
          )}
        </div>
        
        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Designation *
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={`input-field ${errors.designation ? 'border-red-500' : ''}`}
          >
            <option value="">Select Designation</option>
            {UserModel.getDesignations().map(desig => (
              <option key={desig} value={desig}>{desig}</option>
            ))}
          </select>
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.designation}</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        {/* Bank Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bank Account Number
          </label>
          <input
            type="text"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            className="input-field"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        
        {/* Basic Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Basic Salary *
          </label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className={`input-field ${errors.basicSalary ? 'border-red-500' : ''}`}
            placeholder="50000"
          />
          {errors.basicSalary && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.basicSalary}</p>
          )}
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="probation">Probation</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
            rows="3"
            placeholder="123 Main Street, City, State, ZIP"
          />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;