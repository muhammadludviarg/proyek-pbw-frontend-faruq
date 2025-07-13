// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import axios from 'axios'; // Pastikan axios diimpor

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PENTING: Meminta CSRF cookie dari URL publik Sanctum yang tidak ada prefix /api
  useEffect(() => {
    async function getCsrfCookie() {
      try {
        // Gunakan URL Railway langsung untuk sanctum/csrf-cookie
        // Contoh: 'https://proyek-pbw-backend-faruq-production.up.railway.app/sanctum/csrf-cookie'
        await axios.get('https://proyek-pbw-backend-faruq-production.up.railway.app/sanctum/csrf-cookie', { withCredentials: true }); // GANTI DENGAN URL RAILWAY ANDA + /sanctum/csrf-cookie
        console.log('CSRF cookie obtained.');
      } catch (err) {
        console.error('Failed to get CSRF cookie:', err);
      }
    }
    getCsrfCookie();
  }, []);

  const loginAction = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setToken(response.token); // SESUAIKAN DENGAN NAMA KEY TOKEN DARI BACKEND ANDA
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token); // SESUAIKAN DENGAN NAMA KEY TOKEN DARI BACKEND ANDA
      return response;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutAction = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      console.error('Logout error:', error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginAction, logoutAction, loading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
