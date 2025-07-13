// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // KEMBALIKAN KE INI
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

// Interceptor untuk menangani respons error (biarkan ini dulu, ini tidak merusak login)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/login') {
      originalRequest._retry = true;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Mungkin ini yang menyebabkan redirect tak terduga, bisa dikomentari dulu
    }
    return Promise.reject(error);
  }
);

export default apiClient;
