import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Building,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Shield,
  Bell,
  Globe,
  Database,
  Mail
} from 'lucide-react';
import TextInput from '../../components/inputs/TextInput';
import SelectInput from '../../components/inputs/SelectInput';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';

const SystemConfig = () => {
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: 'HRMS Corporation',
    companyAddress: '123 Business Street, Corporate City, CC 12345',
    companyEmail: 'hr@hrmscorp.com',
    companyPhone: '+1 (555) 123-4567',
    companyWebsite: 'https://hrmscorp.com',
    
    // Attendance Settings
    workStartTime: '09:00',
    workEndTime: '17:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    overtimeRate: 1.5,
    lateThreshold: 15, // minutes
    
    // Leave Settings
    casualLeaveLimit: 12,
    sickLeaveLimit: 10,
    annualLeaveLimit: 15,
    maternityLeaveLimit: 180,
    paternityLeaveLimit: 15,
    
    // Payroll Settings
    payrollCycle: 'monthly',
    payrollDate: 25,
    taxYearStart: 'April 1',
    taxYearEnd: 'March 31',
    pfPercentage: 12,
    esiPercentage: 3.25,
    
    // Security Settings
    passwordExpiryDays: 90,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyOnLeave: true,
    notifyOnPayroll: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeSection, setActiveSection] = useState('company');

  const sections = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'general', label: 'General', icon: SettingsIcon }
  ];

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setSettings(prev => {
      const currentArray = [...prev[field]];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveMessage(`${sections.find(s => s.id === section)?.label} settings saved successfully!`);
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveMessage('All settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'company':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Company Name"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                icon={Building}
              />
              
              <TextInput
                label="Company Email"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => handleChange('companyEmail', e.target.value)}
                icon={Mail}
              />
              
              <TextInput
                label="Company Phone"
                value={settings.companyPhone}
                onChange={(e) => handleChange('companyPhone', e.target.value)}
                icon={Phone}
              />
              
              <TextInput
                label="Company Website"
                value={settings.companyWebsite}
                onChange={(e) => handleChange('companyWebsite', e.target.value)}
                icon={Globe}
              />
            </div>
            
            <TextInput
              label="Company Address"
              value={settings.companyAddress}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              multiline
              rows={3}
            />
          </div>
        );
      
      case 'attendance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Attendance Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Work Start Time"
                type="time"
                value={settings.workStartTime}
                onChange={(e) => handleChange('workStartTime', e.target.value)}
              />
              
              <TextInput
                label="Work End Time"
                type="time"
                value={settings.workEndTime}
                onChange={(e) => handleChange('workEndTime', e.target.value)}
              />
              
              <TextInput
                label="Late Threshold (minutes)"
                type="number"
                value={settings.lateThreshold}
                onChange={(e) => handleChange('lateThreshold', e.target.value)}
              />
              
              <TextInput
                label="Overtime Rate"
                type="number"
                step="0.1"
                value={settings.overtimeRate}
                onChange={(e) => handleChange('overtimeRate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.workDays.includes(day)}
                      onChange={(e) => handleArrayChange('workDays', day, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{day.substring(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'leave':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Leave Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Casual Leave Limit"
                type="number"
                value={settings.casualLeaveLimit}
                onChange={(e) => handleChange('casualLeaveLimit', e.target.value)}
              />
              
              <TextInput
                label="Sick Leave Limit"
                type="number"
                value={settings.sickLeaveLimit}
                onChange={(e) => handleChange('sickLeaveLimit', e.target.value)}
              />
              
              <TextInput
                label="Annual Leave Limit"
                type="number"
                value={settings.annualLeaveLimit}
                onChange={(e) => handleChange('annualLeaveLimit', e.target.value)}
              />
              
              <TextInput
                label="Maternity Leave Limit"
                type="number"
                value={settings.maternityLeaveLimit}
                onChange={(e) => handleChange('maternityLeaveLimit', e.target.value)}
              />
              
              <TextInput
                label="Paternity Leave Limit"
                type="number"
                value={settings.paternityLeaveLimit}
                onChange={(e) => handleChange('paternityLeaveLimit', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'payroll':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payroll Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="Payroll Cycle"
                value={settings.payrollCycle}
                onChange={(e) => handleChange('payrollCycle', e.target.value)}
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'biweekly', label: 'Bi-weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'bimonthly', label: 'Bi-monthly' }
                ]}
              />
              
              <TextInput
                label="Payroll Date (day of month)"
                type="number"
                min="1"
                max="31"
                value={settings.payrollDate}
                onChange={(e) => handleChange('payrollDate', e.target.value)}
              />
              
              <TextInput
                label="Tax Year Start"
                value={settings.taxYearStart}
                onChange={(e) => handleChange('taxYearStart', e.target.value)}
              />
              
              <TextInput
                label="Tax Year End"
                value={settings.taxYearEnd}
                onChange={(e) => handleChange('taxYearEnd', e.target.value)}
              />
              
              <TextInput
                label="PF Percentage (%)"
                type="number"
                step="0.01"
                value={settings.pfPercentage}
                onChange={(e) => handleChange('pfPercentage', e.target.value)}
              />
              
              <TextInput
                label="ESI Percentage (%)"
                type="number"
                step="0.01"
                value={settings.esiPercentage}
                onChange={(e) => handleChange('esiPercentage', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Password Expiry (days)"
                type="number"
                value={settings.passwordExpiryDays}
                onChange={(e) => handleChange('passwordExpiryDays', e.target.value)}
              />
              
              <TextInput
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              />
              
              <TextInput
                label="Max Login Attempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Two-Factor Authentication
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Notify on Leave Applications</span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnLeave}
                  onChange={(e) => handleChange('notifyOnLeave', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Notify on Payroll Processing</span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnPayroll}
                  onChange={(e) => handleChange('notifyOnPayroll', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>
        );
      
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              General Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Timezone
                </label>
                <SelectInput
                  value="UTC"
                  onChange={() => {}}
                  options={[
                    { value: 'UTC', label: 'UTC' },
                    { value: 'IST', label: 'Indian Standard Time' },
                    { value: 'EST', label: 'Eastern Standard Time' },
                    { value: 'PST', label: 'Pacific Standard Time' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <SelectInput
                  value="DD/MM/YYYY"
                  onChange={() => {}}
                  options={[
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <SelectInput
                  value="en"
                  onChange={() => {}}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' }
                  ]}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Configuration
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure system settings and preferences
        </p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <Save className="text-green-600 dark:text-green-400" size={16} />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">
                {saveMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors text-left
                      ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveAll}
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save All Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderSectionContent()}
            
            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <SecondaryButton
                onClick={() => setActiveSection(sections[0].id)}
                className="mr-3"
              >
                Reset
              </SecondaryButton>
              <PrimaryButton
                onClick={() => handleSave(activeSection)}
                loading={isLoading}
              >
                Save {sections.find(s => s.id === activeSection)?.label} Settings
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;