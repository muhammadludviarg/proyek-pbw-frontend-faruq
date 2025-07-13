//src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Dapatkan user dari AuthContext

  // Jika user tidak login, redirect ke login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika user sudah login, tampilkan children (komponen yang dibungkus)
  return children;
};

export default ProtectedRoute;