import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopmentOnly",
  authDomain: "hrms-development.firebaseapp.com",
  databaseURL: "https://hrms-development-default-rtdb.firebaseio.com",
  projectId: "hrms-development",
  storageBucket: "hrms-development.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:dummyappidfordevelopment"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;