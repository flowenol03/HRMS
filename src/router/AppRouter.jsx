import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import { initializeDatabase } from '../firebase/firebaseService';
import { useAuth } from '../hooks/useAuth';

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

// Private Route Component - Moved OUTSIDE AppRouter
const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Role-based route helper - Moved OUTSIDE AppRouter
const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Initialize database on app start
initializeDatabase().catch(console.error);

const AppRouter = () => {
  return (
    <AuthProvider>
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
                <Route index element={<Navigate to="/dashboard" replace />} />
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
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppRouter;