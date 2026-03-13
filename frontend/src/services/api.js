/**
 * Axios Instance Configuration
 * Centralized API client
 */

import axios from 'axios';

const PROD_API_URL = 'https://nmn-production.up.railway.app/api';
const isNmnProductionHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'www.nmnhas.org.np' || window.location.hostname === 'nmnhas.org.np');

const API_URL = import.meta.env.VITE_API_URL || (isNmnProductionHost ? PROD_API_URL : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Attach token via Authorization header (cross-domain fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
      return Promise.reject(error.response.data);
    }

    // Normalize network-level failures to a user-friendly message
    return Promise.reject({
      success: false,
      message: 'Cannot reach server. Please check internet connection and try again.',
    });
  }
);

export default api;
