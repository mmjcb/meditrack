// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services you will likely use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmfBjQNpkNbU0CqdMGMMbPjrNVNwIG7DY",
  authDomain: "meditrack-7c53a.firebaseapp.com",
  projectId: "meditrack-7c53a",
  storageBucket: "meditrack-7c53a.firebasestorage.app",
  messagingSenderId: "398250856662",
  appId: "1:398250856662:web:ad8475e24c6be8f27ff977",
  measurementId: "G-STDD2RVHHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export app if needed
export default app;
