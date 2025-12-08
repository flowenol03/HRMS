import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, dbService } from '../firebase/firebaseService';

// Create and export the context
export const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromDatabase = async (firebaseUser) => {
    if (!firebaseUser || !firebaseUser.email) return null;
    
    try {
      // Extract username from email (remove @domain)
      const emailParts = firebaseUser.email.split('@');
      const username = emailParts[0];
      
      // Query database for user by username
      const users = await dbService.query('users', 'username', username);
      
      if (users.length > 0) {
        const userData = users[0];
        return {
          ...userData,
          uid: firebaseUser.uid,
          email: firebaseUser.email
        };
      }
      
      // If not found by username, try by email
      const usersByEmail = await dbService.query('users', 'email', firebaseUser.email);
      if (usersByEmail.length > 0) {
        const userData = usersByEmail[0];
        return {
          ...userData,
          uid: firebaseUser.uid,
          email: firebaseUser.email
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user from database:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check localStorage first (for demo users)
    const storedUser = localStorage.getItem('hrms_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }

    // Firebase auth listener
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Load user data from database
        const userData = await loadUserFromDatabase(firebaseUser);
        
        if (userData) {
          setUser(userData);
          localStorage.setItem('hrms_user', JSON.stringify(userData));
        } else {
          // Create a minimal user object if not found in database
          const username = firebaseUser.email.split('@')[0];
          const minimalUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: username,
            role: 'employee', // Default role
            fullName: username
          };
          setUser(minimalUser);
          localStorage.setItem('hrms_user', JSON.stringify(minimalUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem('hrms_user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (username, password) => {
    try {
      // For demo users, check default credentials
      const defaultCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'hr1', password: 'hr123', role: 'hr' },
        { username: 'emp1', password: 'emp123', role: 'employee' }
      ];
      
      const demoUser = defaultCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (demoUser) {
        // Demo user login
        const userData = {
          uid: `demo-${username}`,
          email: `${username}@hrms.com`,
          username: username,
          role: demoUser.role,
          fullName: demoUser.role === 'admin' ? 'System Administrator' : 
                   demoUser.role === 'hr' ? 'HR Manager' : 'Employee'
        };
        
        setUser(userData);
        localStorage.setItem('hrms_user', JSON.stringify(userData));
        return { success: true };
      }
      
      // Try Firebase auth with database lookup
      const result = await authService.login(username, password);
      
      if (result.user) {
        // User will be set by the auth listener above
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid username or password' 
      };
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('hrms_user');
      setUser(null);
      
      // If it's a Firebase user, also logout from Firebase
      if (user && user.uid && !user.uid.startsWith('demo-')) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};