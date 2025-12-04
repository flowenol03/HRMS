import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Camera
} from 'lucide-react';
import TextInput from '../../components/inputs/TextInput';
import { validateEmail, validatePhone } from '../../utils/validators';

const ProfileSettings = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // In a real app, fetch user profile data
    setFormData({
      fullName: user?.username || 'User',
      email: `${user?.username}@hrms.com` || '',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, City, State, ZIP',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !validatePhone(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (formData.currentPassword && formData.currentPassword.length < 6) {
      newErrors.currentPassword = 'Current password must be at least 6 characters';
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateProfileForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Profile updated successfully!');
      setErrors({});
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (!formData.currentPassword || !formData.newPassword) {
      setErrors({ password: 'Please fill all password fields' });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Password changed successfully!');
      setErrors({});
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information and security settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <Save className="text-green-600 dark:text-green-400" size={16} />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture & Info */}
        <div className="lg:col-span-1">
          <div className="card">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-4 right-0 p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Camera size={16} />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {formData.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'hr' ? 'HR Manager' : 'Employee'}
              </p>
            </div>

            {/* User Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                  <p className="font-medium">{formData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Form */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  name="fullName"
                  error={errors.fullName}
                  icon={User}
                  required
                />
                
                <TextInput
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  name="email"
                  error={errors.email}
                  icon={Mail}
                  required
                />
                
                <TextInput
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  name="phone"
                  error={errors.phone}
                  icon={Phone}
                />
              </div>
              
              <div>
                <TextInput
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, City, State, ZIP"
                  name="address"
                  error={errors.address}
                  icon={MapPin}
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary px-6 py-2"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Change Password
            </h3>
            
            {errors.password && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={handleChange}
                      name="currentPassword"
                      className={`
                        w-full pl-10 pr-10 py-2 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary-500
                        dark:focus:ring-primary-400
                        ${errors.currentPassword 
                          ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                      `}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleChange}
                      name="newPassword"
                      className={`
                        w-full pl-10 pr-10 py-2 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary-500
                        dark:focus:ring-primary-400
                        ${errors.newPassword 
                          ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                      `}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      name="confirmPassword"
                      className={`
                        w-full pl-10 pr-10 py-2 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary-500
                        dark:focus:ring-primary-400
                        ${errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-white
                      `}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary px-6 py-2"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;