// src/components/LoginPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoBPS from "../assets/LogoBPS1.png"; // Menggunakan LogoBPS1.png dari assets, pastikan nama file Anda sesuai
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginAction, user, loading, error, clearError } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/publications");
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email dan password harus diisi!");
      return;
    }

    try {
      await loginAction(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md text-center"> 
        <img
          src={logoBPS}
          alt="Logo BPS"
          className="mx-auto h-16 w-auto mb-6" 
        />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-500 text-sm mb-6">Silakan masuk untuk melanjutkan</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only">Email</label> 
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label className="sr-only">Password</label> 
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm" 
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
