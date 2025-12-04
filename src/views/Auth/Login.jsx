import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import Toast from '../../components/notifications/Toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  
  const authViewModel = new AuthViewModel();
  const navigate = useNavigate();
  
  const defaultCredentials = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'hr1', password: 'hr123', role: 'hr' },
    { username: 'emp1', password: 'emp123', role: 'employee' }
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // For demo purposes, use local authentication
    // In production, this would use Firebase Auth
    const user = defaultCredentials.find(
      cred => cred.username === username && cred.password === password
    );
    
    if (user) {
      // Simulate successful login
      localStorage.setItem('hrms_user', JSON.stringify(user));
      
      setToast({
        message: 'Login successful! Redirecting...',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError('Invalid username or password');
      setToast({
        message: 'Invalid credentials',
        type: 'error'
      });
    }
    
    setLoading(false);
  };
  
  const handleDemoLogin = (cred) => {
    setUsername(cred.username);
    setPassword(cred.password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            HRMS Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to access your dashboard
          </p>
        </div>
        
        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Demo Credentials:
            </p>
            <div className="space-y-2">
              {defaultCredentials.map((cred) => (
                <button
                  key={cred.username}
                  type="button"
                  onClick={() => handleDemoLogin(cred)}
                  className="w-full text-left p-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {cred.role === 'admin' ? 'Administrator' : 
                     cred.role === 'hr' ? 'HR Manager' : 'Employee'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 mt-1">
                    Username: <span className="font-mono">{cred.username}</span> | 
                    Password: <span className="font-mono">{cred.password}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;