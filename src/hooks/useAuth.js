//src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Tambahkan console.log di sini untuk melihat status user
  console.log('useAuth: user status', context?.user); 
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};