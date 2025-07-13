// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import axios from 'axios'; // Pastikan ini diimpor jika digunakan untuk csrf-cookie

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Bagian untuk mendapatkan CSRF cookie (pastikan sudah disesuaikan dengan solusi yang bekerja untuk Anda)
  useEffect(() => {
    async function getCsrfCookie() {
      try {
        // Contoh: menggunakan axios langsung jika sanctum/csrf-cookie tidak di /api
        // await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
        // Jika Anda mengikuti modul, ini mungkin dipanggil otomatis oleh Sanctum atau axios.js
        console.log('CSRF cookie mechanism might be implicit or called elsewhere.');
      } catch (err) {
        console.error('Failed to get CSRF cookie in AuthContext useEffect:', err);
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
      setToken(response.token); // Sesuaikan dengan nama key token dari backend Anda
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token); // Sesuaikan dengan nama key token dari backend Anda
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
      await authService.logout(); // Panggil fungsi logout dari service layer
      setUser(null); // Bersihkan user state
      setToken(null); // Bersihkan token state
      localStorage.removeItem("user"); // Hapus dari localStorage
      localStorage.removeItem("token"); // Hapus dari localStorage
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
