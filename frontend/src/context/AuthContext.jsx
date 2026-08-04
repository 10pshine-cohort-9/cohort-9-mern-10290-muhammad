import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'notes_app_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      setUser(res.data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  async function signup(payload) {
    const res = await api.signup(payload);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.data);
    return res;
  }

  async function login(payload) {
    const res = await api.login(payload);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.data);
    return res;
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }

  async function updateProfile(payload) {
    const res = await api.updateMe(payload);
    setUser(res.data);
    return res;
  }

  const value = { user, loading, signup, login, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
