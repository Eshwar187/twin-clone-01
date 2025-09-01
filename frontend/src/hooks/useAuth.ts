import { useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useAuth = () => {
  const setSession = useCallback((token: string, refreshToken?: string, user?: any) => {
    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      const ob = (user?.onboardingCompleted === true);
      localStorage.setItem('onboardingCompleted', ob ? 'true' : 'false');
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || 'Login failed');
    setSession(json.data.token, json.data.refreshToken, json.data.user);
    return json.data;
  }, [setSession]);

  const register = useCallback(async (name: string, email: string, password: string, confirmPassword: string, country?: string) => {
    const payload: any = { name, email, password, confirmPassword };
    if (country) payload.country = country;
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || 'Registration failed');
    const user = country ? { ...json.data.user, country } : json.data.user;
    // New users default to not completed onboarding
    setSession(json.data.token, json.data.refreshToken, { ...user, onboardingCompleted: false });
    return { ...json.data, user };
  }, [setSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const getToken = useCallback(() => {
    return localStorage.getItem('token') || '';
  }, []);

  const isAuthenticated = !!(localStorage.getItem('token'));

  const markOnboardingComplete = useCallback(() => {
    localStorage.setItem('onboardingCompleted', 'true');
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        u.onboardingCompleted = true;
        localStorage.setItem('user', JSON.stringify(u));
      } catch {}
    }
  }, []);

  return { login, register, logout, getToken, isAuthenticated, markOnboardingComplete };
};
