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
  Mail,
  Phone
} from 'lucide-react';

// Mock components - replace with your actual components
const TextInput = ({ label, value, onChange, type = 'text', icon: Icon, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon size={18} className="text-gray-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
          rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:bg-gray-700 dark:text-white
          ${Icon ? 'pl-10' : ''}
        `}
        {...props}
      />
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
        rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        dark:bg-gray-700 dark:text-white
      "
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Button Components
const PrimaryButton = ({ children, loading, ...props }) => (
  <button
    className="
      bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 
      rounded-lg font-medium transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center space-x-2
    "
    disabled={loading}
    {...props}
  >
    {loading ? (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Saving...</span>
      </>
    ) : (
      children
    )}
  </button>
);

const SecondaryButton = ({ children, ...props }) => (
  <button
    className="
      px-6 py-2 border border-gray-300 dark:border-gray-600 
      rounded-lg font-medium text-gray-700 dark:text-gray-300 
      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
    "
    {...props}
  >
    {children}
  </button>
);

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
    lateThreshold: 15,
    
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
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyOnLeave: true,
    notifyOnPayroll: true,
    
    // General Settings
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    language: 'en'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeSection, setActiveSection] = useState('company');

  const sections = [
    { id: 'company', label: 'Company', icon: Building, color: 'text-green-600' },
    { id: 'attendance', label: 'Attendance', icon: Clock, color: 'text-yellow-600' },
    { id: 'leave', label: 'Leave', icon: Calendar, color: 'text-purple-600' },
    { id: 'payroll', label: 'Payroll', icon: DollarSign, color: 'text-pink-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-red-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-blue-600' },
    { id: 'general', label: 'General', icon: SettingsIcon, color: 'text-gray-600' }
  ];

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const sectionLabel = sections.find(s => s.id === activeSection)?.label;
      setSaveMessage(`${sectionLabel} settings saved successfully!`);
      
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setSaveMessage('All settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 2000);
  };

  const renderCompanySettings = () => (
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

  const renderAttendanceSettings = () => (
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
          onChange={(e) => handleChange('lateThreshold', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Overtime Rate"
          type="number"
          step="0.1"
          value={settings.overtimeRate}
          onChange={(e) => handleChange('overtimeRate', parseFloat(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Work Days
        </label>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <label key={day} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={settings.workDays.includes(day)}
                onChange={(e) => {
                  const newWorkDays = e.target.checked
                    ? [...settings.workDays, day]
                    : settings.workDays.filter(d => d !== day);
                  handleChange('workDays', newWorkDays);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{day.substring(0, 3)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLeaveSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Leave Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Casual Leave Limit"
          type="number"
          value={settings.casualLeaveLimit}
          onChange={(e) => handleChange('casualLeaveLimit', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Sick Leave Limit"
          type="number"
          value={settings.sickLeaveLimit}
          onChange={(e) => handleChange('sickLeaveLimit', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Annual Leave Limit"
          type="number"
          value={settings.annualLeaveLimit}
          onChange={(e) => handleChange('annualLeaveLimit', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Maternity Leave Limit"
          type="number"
          value={settings.maternityLeaveLimit}
          onChange={(e) => handleChange('maternityLeaveLimit', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Paternity Leave Limit"
          type="number"
          value={settings.paternityLeaveLimit}
          onChange={(e) => handleChange('paternityLeaveLimit', parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );

  const renderPayrollSettings = () => (
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
          onChange={(e) => handleChange('payrollDate', parseInt(e.target.value) || 1)}
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
          onChange={(e) => handleChange('pfPercentage', parseFloat(e.target.value) || 0)}
        />
        
        <TextInput
          label="ESI Percentage (%)"
          type="number"
          step="0.01"
          value={settings.esiPercentage}
          onChange={(e) => handleChange('esiPercentage', parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Security Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Password Expiry (days)"
          type="number"
          value={settings.passwordExpiryDays}
          onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 0)}
        />
        
        <TextInput
          label="Max Login Attempts"
          type="number"
          value={settings.maxLoginAttempts}
          onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div className="flex items-center space-x-3 p-4 border rounded-lg">
        <input
          type="checkbox"
          id="twoFactorAuth"
          checked={settings.twoFactorAuth}
          onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Enable Two-Factor Authentication
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Notification Settings
      </h3>
      
      <div className="space-y-4">
        {[
          { id: 'email', label: 'Email Notifications', key: 'emailNotifications' },
          { id: 'push', label: 'Push Notifications', key: 'pushNotifications' },
          { id: 'sms', label: 'SMS Notifications', key: 'smsNotifications' },
          { id: 'leave', label: 'Notify on Leave Applications', key: 'notifyOnLeave' },
          { id: 'payroll', label: 'Notify on Payroll Processing', key: 'notifyOnPayroll' }
        ].map(({ id, label, key }) => (
          <div key={id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <div className="relative">
              <input
                type="checkbox"
                id={id}
                checked={settings[key]}
                onChange={(e) => handleChange(key, e.target.checked)}
                className="sr-only"
              />
              <div className={`
                w-10 h-6 rounded-full transition-colors duration-200 ease-in-out
                ${settings[key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}>
                <div className={`
                  absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white 
                  transition-transform duration-200 ease-in-out
                  ${settings[key] ? 'translate-x-4' : ''}
                `}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        General Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          label="System Timezone"
          value={settings.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          options={[
            { value: 'UTC', label: 'UTC' },
            { value: 'IST', label: 'Indian Standard Time' },
            { value: 'EST', label: 'Eastern Standard Time' },
            { value: 'PST', label: 'Pacific Standard Time' }
          ]}
        />
        
        <SelectInput
          label="Date Format"
          value={settings.dateFormat}
          onChange={(e) => handleChange('dateFormat', e.target.value)}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
          ]}
        />
        
        <SelectInput
          label="Language"
          value={settings.language}
          onChange={(e) => handleChange('language', e.target.value)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }
          ]}
        />
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">System Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Database className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Database</p>
              <p className="font-medium">Firebase Realtime DB</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Users className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="font-medium">24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'company': return renderCompanySettings();
      case 'attendance': return renderAttendanceSettings();
      case 'leave': return renderLeaveSettings();
      case 'payroll': return renderPayrollSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'general': return renderGeneralSettings();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <Save className="text-green-600 dark:text-green-400" size={20} />
              <span className="font-medium text-green-800 dark:text-green-300">
                {saveMessage}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
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
                        transition-colors duration-200 text-left
                        ${isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : section.color} />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSaveAll}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving All...</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {renderSectionContent()}
              
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <SecondaryButton
                  onClick={() => {
                    // Reset current section to initial values
                    // You might want to implement a more specific reset logic
                    setSaveMessage('Reset not implemented');
                    setTimeout(() => setSaveMessage(''), 2000);
                  }}
                  className="mr-3"
                >
                  Reset Section
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleSave}
                  loading={isLoading}
                >
                  Save {sections.find(s => s.id === activeSection)?.label} Settings
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;