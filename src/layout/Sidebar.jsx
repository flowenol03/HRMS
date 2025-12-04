import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'hr', 'employee'] },
    { path: '/employees', label: 'Employees', icon: <Users size={20} />, roles: ['admin', 'hr'] },
    { path: '/attendance', label: 'Attendance', icon: <Clock size={20} />, roles: ['admin', 'hr', 'employee'] },
    { path: '/leave', label: 'Leave', icon: <Calendar size={20} />, roles: ['admin', 'hr', 'employee'] },
    { path: '/payroll', label: 'Payroll', icon: <DollarSign size={20} />, roles: ['admin', 'hr', 'employee'] },
    { path: '/performance', label: 'Performance', icon: <BarChart3 size={20} />, roles: ['admin', 'hr', 'employee'] },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} />, roles: ['admin', 'hr'] },
  ];
  
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || 'employee')
  );
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40
        h-screen w-64 bg-white dark:bg-gray-800
        shadow-lg transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HR</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">HRMS</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === 'admin' ? 'Administrator' : 
             user?.role === 'hr' ? 'HR Manager' : 'Employee'}
          </p>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                {user?.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'Admin' : 
                 user?.role === 'hr' ? 'HR Manager' : 'Employee'}
              </p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;