import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to clear authentication state cleanly
  const clearAuthState = useCallback(() => {
    localStorage.removeItem('cineza_token');
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  // Helper to clear stale auth errors
  const clearAuthError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch the current user given a token
  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getCurrentUser(authToken);
      
      if (data.success && data.user) {
        setUser(data.user);
        setToken(authToken);
      } else {
        clearAuthState();
      }
    } catch (err) {
      console.warn('Authentication token check failed:', err.message);
      // Clean cleanup on expired or invalid tokens without crashing the application
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  // Load token from localStorage on mount
  useEffect(() => {
    let active = true;
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('cineza_token');
      if (savedToken) {
        if (active) {
          await fetchCurrentUser(savedToken);
        }
      } else {
        if (active) {
          setLoading(false);
        }
      }
    };
    initializeAuth();
    return () => {
      active = false;
    };
  }, [fetchCurrentUser]);

  // Handle successful registration
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.registerUser(formData);
      
      if (data.success && data.token) {
        localStorage.setItem('cineza_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        throw new Error(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle successful login
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.loginUser(formData);
      
      if (data.success && data.token) {
        localStorage.setItem('cineza_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle successful Google/Social auth callback
  const handleAuthSuccess = useCallback(async (authToken) => {
    try {
      setLoading(true);
      setError(null);
      localStorage.setItem('cineza_token', authToken);
      setToken(authToken);
      await fetchCurrentUser(authToken);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [fetchCurrentUser]);

  // Handle logout
  const logout = useCallback(() => {
    clearAuthState();
  }, [clearAuthState]);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    register,
    login,
    logout,
    clearAuthError,
    fetchCurrentUser,
    handleAuthSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
