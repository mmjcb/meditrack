import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create the Auth context
const AuthContext = createContext();

// AuthProvider to wrap your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      await signOut(auth); 
      setUser(null);       
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
