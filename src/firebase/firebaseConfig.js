// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN6OLGbG5pRoMPlsiHCtuWIoTg9YgzhrQ",
  authDomain: "hrms-dc2d7.firebaseapp.com",
  databaseURL: "https://hrms-dc2d7-default-rtdb.firebaseio.com",
  projectId: "hrms-dc2d7",
  storageBucket: "hrms-dc2d7.firebasestorage.app",
  messagingSenderId: "46876528304",
  appId: "1:46876528304:web:aec02eb8f174f3250eb575",
  measurementId: "G-Y2QX60Q0RW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics (only works in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize services
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
