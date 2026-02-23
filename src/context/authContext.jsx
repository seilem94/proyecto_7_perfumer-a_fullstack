import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { authService } from '../api/authService';
import { STORAGE_KEYS } from '../utils/constants';

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token     = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && savedUser && savedUser !== 'undefined') {
        try {
          await authService.verifyToken();
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (err) {
          const status = err?.response?.status ?? err?.status;
          if (status === 401) {
            logout();
          } else {
            // Error de red o backend caído — confiar en el token local
            console.warn('verifyToken falló, manteniendo sesión local:', err);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    // La API responde con: { success, message, data: { user, token } }
    // Por eso accedemos a response.data.data
    const { user: userData, token } = response.data.data;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);

    // Misma estructura: { success, message, data: { user, token } }
    const { user: newUser, token } = response.data.data;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

    setUser(newUser);
    setIsAuthenticated(true);

    return newUser;
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};