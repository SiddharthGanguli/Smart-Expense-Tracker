// Import required functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";

// Your Firebase configuration (replace with your own credentials if different)
const firebaseConfig = {
  apiKey: "AIzaSyDL01r2Izau9RQxpP61GvHr1hpWyk3PTEc",
  authDomain: "expense-tracking-41db0.firebaseapp.com",
  databaseURL: "https://expense-tracking-41db0-default-rtdb.firebaseio.com",
  projectId: "expense-tracking-41db0",
  storageBucket: "expense-tracking-41db0.appspot.com",
  messagingSenderId: "256895616466",
  appId: "1:256895616466:web:af4cc4993494b6da8bf40b",
  measurementId: "G-NBJZCL2B39",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Export database and necessary database functions
export { database, ref, onValue, push, set, remove };
