/**
 * Authentication Context
 * Global state for authentication
 */

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore admin profile from localStorage (non-sensitive display data only)
    const currentAdmin = authService.getCurrentAdmin();
    if (currentAdmin) {
      setAdmin(currentAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setAdmin(response.data.admin);
    return response;
  };

  const refreshProfile = async () => {
    const response = await authService.getProfile();
    if (response?.data) {
      setAdmin(response.data);
      localStorage.setItem('admin', JSON.stringify(response.data));
    }
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    refreshProfile,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
