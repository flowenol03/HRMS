import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

export const useAuthViewModel = () => {
  const auth = useAuth();
  const notifications = useNotifications();
  
  const login = async (username, password) => {
    try {
      const result = await auth.login(username, password);
      
      if (result.success) {
        // Add notification
        notifications.addNotification({
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${username}!`,
          module: 'AUTH'
        });
        
        return { success: true };
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = async () => {
    try {
      await auth.logout();
      
      notifications.addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
        module: 'AUTH'
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const getCurrentUser = () => {
    return auth.user;
  };
  
  const getUserRole = () => {
    return auth.user?.role || null;
  };
  
  const isAuthenticated = () => {
    return auth.isAuthenticated;
  };
  
  const hasPermission = (requiredRole) => {
    const userRole = getUserRole();
    const roleHierarchy = { admin: 3, hr: 2, employee: 1 };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };
  
  const canAccess = (module, action) => {
    const role = getUserRole();
    
    const permissions = {
      admin: {
        employee: ['create', 'read', 'update', 'delete'],
        attendance: ['read', 'update'],
        leave: ['read', 'approve', 'reject'],
        payroll: ['create', 'read', 'update', 'delete'],
        performance: ['create', 'read', 'update', 'delete'],
        settings: ['read', 'update']
      },
      hr: {
        employee: ['read', 'update'],
        attendance: ['read', 'update'],
        leave: ['read', 'approve', 'reject'],
        payroll: ['create', 'read', 'update'],
        performance: ['create', 'read', 'update'],
        settings: ['read']
      },
      employee: {
        employee: ['read'],
        attendance: ['create', 'read'],
        leave: ['create', 'read'],
        payroll: ['read'],
        performance: ['read', 'update'],
        settings: []
      }
    };
    
    return permissions[role]?.[module]?.includes(action) || false;
  };
  
  return {
    login,
    logout,
    getCurrentUser,
    getUserRole,
    isAuthenticated,
    hasPermission,
    canAccess
  };
};