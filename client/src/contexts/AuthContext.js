'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
          setToken(savedToken);
          await fetchCurrentUser(savedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Fetch current user
  const fetchCurrentUser = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error('Fetch user error:', error);
      throw error;
    }
  };

  // Register user
  const register = async (name, email, password, passwordConfirm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToken(data.data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', data.data.token);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', data.data.token);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data.data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Delete all user data
  const deleteAllData = async (password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/data`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete data');
      }

      toast.success('All data deleted successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Delete profile
  const deleteProfile = async (password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete profile');
      }

      // Clear auth state
      logout();
      toast.success('Account deleted successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        deleteAllData,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
