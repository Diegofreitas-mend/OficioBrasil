import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api.js';

const TOKEN_KEY = 'oficio_brasil_token';
const STUDENT_KEY = 'oficio_brasil_student';
const AuthContext = createContext(null);

function readStored() {
  try {
    const raw = sessionStorage.getItem(STUDENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(readStored);

  const persist = useCallback((token, st) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(STUDENT_KEY, JSON.stringify(st));
    setStudent(st);
  }, []);

  const login = useCallback(async (email, senha) => {
    const { token, student: st } = await api.post('/auth/login', { email, senha });
    persist(token, st);
    return st;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const { token, student: st } = await api.post('/auth/register', payload);
    persist(token, st);
    return st;
  }, [persist]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(STUDENT_KEY);
    setStudent(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      student,
      isAuthenticated: !!student,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
