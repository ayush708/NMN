/**
 * Axios Instance Configuration
 * Centralized API client
 */

import axios from 'axios';

// Prefer an explicit build-time `VITE_API_URL`, otherwise use a same-origin `/api`
// when the app is served from the public site. Fall back to localhost for dev.
const API_URL = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' &&
      (window.location.hostname === 'www.nmnhas.org.np' || window.location.hostname === 'nmnhas.org.np')
      ? '/api'
      : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
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
