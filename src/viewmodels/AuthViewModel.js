import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { UserModel } from '../models/UserModel';

export class AuthViewModel {
  constructor() {
    this.auth = useAuth();
    this.notifications = useNotifications();
  }
  
  async login(username, password) {
    try {
      const result = await this.auth.login(username, password);
      
      if (result.success) {
        // Add notification
        this.notifications.addNotification({
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
  }
  
  async logout() {
    try {
      await this.auth.logout();
      
      this.notifications.addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
        module: 'AUTH'
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  getCurrentUser() {
    return this.auth.user;
  }
  
  getUserRole() {
    return this.auth.user?.role || null;
  }
  
  isAuthenticated() {
    return this.auth.isAuthenticated;
  }
  
  hasPermission(requiredRole) {
    const userRole = this.getUserRole();
    const roleHierarchy = { admin: 3, hr: 2, employee: 1 };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
  
  canAccess(module, action) {
    const role = this.getUserRole();
    
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
  }
}