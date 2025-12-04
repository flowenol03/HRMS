import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import { initializeDatabase } from '../firebase/firebaseService';

// Views
import Login from '../views/Auth/Login';
import Dashboard from '../views/Dashboard/Dashboard';
import EmployeeList from '../views/Employee/EmployeeList';
import AttendanceList from '../views/Attendance/AttendanceList';
import CheckInCheckOut from '../views/Attendance/CheckInCheckOut';
import LeaveRequests from '../views/Leave/LeaveRequests';
import ApplyLeave from '../views/Leave/ApplyLeave';
import PayrollList from '../views/Payroll/PayrollList';
import PerformanceList from '../views/Performance/PerformanceList';
import DashboardLayout from '../layout/DashboardLayout';

// Private Route Component
const PrivateRoute = ({ children, requiredRole = null }) => {
  const user = JSON.parse(localStorage.getItem('hrms_user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Role-based route helper
const RoleRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('hrms_user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Initialize database on app start
initializeDatabase().catch(console.error);

const AppRouter = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Employee Management */}
              <Route path="employees" element={
                <RoleRoute roles={['admin', 'hr']}>
                  <EmployeeList />
                </RoleRoute>
              } />
              
              {/* Attendance */}
              <Route path="attendance" element={
                <RoleRoute roles={['admin', 'hr', 'employee']}>
                  <AttendanceList />
                </RoleRoute>
              } />
              
              <Route path="check-in-out" element={
                <RoleRoute roles={['admin', 'hr', 'employee']}>
                  <CheckInCheckOut />
                </RoleRoute>
              } />
              
              {/* Leave Management */}
              <Route path="leave" element={
                <RoleRoute roles={['admin', 'hr', 'employee']}>
                  <LeaveRequests />
                </RoleRoute>
              } />
              
              <Route path="apply-leave" element={
                <RoleRoute roles={['admin', 'hr', 'employee']}>
                  <ApplyLeave />
                </RoleRoute>
              } />
              
              {/* Payroll */}
              <Route path="payroll" element={
                <RoleRoute roles={['admin', 'hr', 'employee']}>
                  <PayrollList />
                </RoleRoute>
              } />
              
              {/* Performance */}
              <Route path="performance" element={
                <RoleRoute roles={['admin', 'hr', 'employee']}>
                  <PerformanceList />
                </RoleRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default AppRouter;