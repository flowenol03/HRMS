import { database, auth } from './firebaseConfig';
import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  push, 
  query, 
  orderByChild, 
  equalTo,
  onValue
} from 'firebase/database';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// User Management
export const authService = {
  login: async (username, password) => {
    const email = `${username}@hrms.com`;
    return await signInWithEmailAndPassword(auth, email, password);
  },
  
  logout: async () => {
    return await signOut(auth);
  },
  
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
  
  getCurrentUser: () => {
    return auth.currentUser;
  }
};

// Database CRUD Operations
export const dbService = {
  // Create
  create: (path, data) => {
    const newRef = push(ref(database, path));
    return set(newRef, { ...data, id: newRef.key });
  },
  
  // Read single
  get: async (path) => {
    const snapshot = await get(ref(database, path));
    return snapshot.exists() ? snapshot.val() : null;
  },
  
  // Read list
  getAll: async (path) => {
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  },
  
  // Query
  query: async (path, field, value) => {
    const q = query(ref(database, path), orderByChild(field), equalTo(value));
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  },
  
  // Update
  update: (path, data) => {
    return update(ref(database, path), data);
  },
  
  // Delete
  delete: (path) => {
    return remove(ref(database, path));
  },
  
  // Real-time listener
  listen: (path, callback) => {
    const dbRef = ref(database, path);
    return onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        callback(items);
      } else {
        callback([]);
      }
    });
  }
};

// Initial Data Setup
export const initializeDatabase = async () => {
  const initialData = {
    users: {
      "admin": {
        username: "admin",
        email: "admin@hrms.com",
        password: "admin123",
        role: "admin",
        fullName: "System Administrator",
        department: "IT",
        designation: "Admin",
        createdAt: new Date().toISOString()
      },
      "hr1": {
        username: "hr1",
        email: "hr1@hrms.com",
        password: "hr123",
        role: "hr",
        fullName: "HR Manager",
        department: "Human Resources",
        designation: "HR Manager",
        createdAt: new Date().toISOString()
      },
      "emp1": {
        username: "emp1",
        email: "emp1@hrms.com",
        password: "emp123",
        role: "employee",
        fullName: "John Employee",
        department: "Sales",
        designation: "Sales Executive",
        createdAt: new Date().toISOString()
      }
    }
  };
  
  try {
    // Check if users exist
    const users = await dbService.getAll('users');
    if (users.length === 0) {
      for (const [key, user] of Object.entries(initialData.users)) {
        await set(ref(database, `users/${key}`), user);
      }
      console.log('Initial database setup completed');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};