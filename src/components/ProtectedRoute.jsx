// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => { 
  const { user, loading } = useAuth(); 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Memuat autentikasi...
      </div>
    );
  }

  if (!user) { 
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
