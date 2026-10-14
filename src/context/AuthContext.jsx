/* ==========================================================================
   AUTH CONTEXT (FRONTEND DEMO AUTHENTICATION)
   Local session persistence, VIP profile management, guest quick-login
   ========================================================================== */

import React, { createContext, useContext, useState } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());

  const login = (email, password = '') => {
    // Demo authentication accepting any credentials or admin
    const isAdmin = email.toLowerCase().includes('admin');
    const userData = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].toUpperCase() || 'VIP CLIENT',
      email,
      role: isAdmin ? 'ADMIN' : 'VIP CLIENT',
      tier: 'Allocation Member #094',
      memberSince: '2025',
      atelierNode: 'Zurich Atelier'
    };
    storage.setUser(userData);
    setUser(userData);
    return userData;
  };

  const loginAsGuest = () => {
    return login('guest.collector@supercar.atelier');
  };

  const loginAsAdmin = () => {
    return login('admin@supercar.atelier');
  };

  const register = (name, email, password) => {
    const userData = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: name.toUpperCase(),
      email,
      role: 'VIP CLIENT',
      tier: 'Allocation Reserve #112',
      memberSince: new Date().getFullYear().toString(),
      atelierNode: 'Monaco Private Office'
    };
    storage.setUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    storage.setUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      loginAsGuest,
      loginAsAdmin,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
