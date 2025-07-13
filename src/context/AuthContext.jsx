// src/context/AuthContext.jsx
import React, { createContext, useState } from "react"; // Hapus useEffect jika tidak digunakan
import { authService } from "../services/authService";
// import axios from 'axios'; // Hapus import axios jika tidak digunakan untuk csrf-cookie di sini

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hapus atau komentari bagian useEffect yang memanggil csrf-cookie dari sini
  // useEffect(() => {
  //   async function getCsrfCookie() {
  //     try {
  //       await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
  //       console.log('CSRF cookie obtained.');
  //     } catch (err) {
  //       console.error('Failed to get CSRF cookie:', err);
  //     }
  //   }
  //   getCsrfCookie();
  // }, []);

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
