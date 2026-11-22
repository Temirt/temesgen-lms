import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lms_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lms_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / verify token and user on mount
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/user');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('lms_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('lms_token', receivedToken);
    localStorage.setItem('lms_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('lms_token', receivedToken);
    localStorage.setItem('lms_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout').catch(() => {});
      }
    } finally {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('lms_user', JSON.stringify(updatedUser));
  };

  const hasRole = (role) => {
    return user?.role?.toLowerCase() === role?.toLowerCase();
  };

  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        isAdmin,
        isInstructor,
        isStudent,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
