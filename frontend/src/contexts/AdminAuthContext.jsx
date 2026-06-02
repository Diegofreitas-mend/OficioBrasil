import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api.js';

const TOKEN_KEY = 'oficio_brasil_admin_token';
const ADMIN_KEY = 'oficio_brasil_admin';
const AdminAuthContext = createContext(null);

function readStored() {
  try {
    const raw = sessionStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(readStored);

  const login = useCallback(async (email, senha) => {
    const { token, admin: a } = await api.post('/admin/login', { email, senha });
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_KEY, JSON.stringify(a));
    setAdmin(a);
    return a;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth precisa estar dentro de <AdminAuthProvider>');
  return ctx;
}
