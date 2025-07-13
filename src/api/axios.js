// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Ini HARUS menggunakan VITE_API_URL
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani respons error
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Hanya tambahkan logika redirect jika error 401 dan bukan saat login
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/login') {
      originalRequest._retry = true;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Bisa diaktifkan jika ingin redirect otomatis
    }
    return Promise.reject(error);
  }
);

export default apiClient;
