import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        localStorage.setItem('securebank_user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        return response.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        localStorage.setItem('securebank_user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        return response.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
