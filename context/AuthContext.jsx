'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      // Store token in localStorage for API calls
      localStorage.setItem('token', data.token);
      setUser(data.user);
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/agent/dashboard');
      }
    }
    return data;
  }

  async function signup(formData) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard');
    }
    return data;
  }

  async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore network errors
  }
  localStorage.removeItem('token');
  setUser(null);
  router.push('/login');
}
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);