import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function getToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('accessToken');
}

function onUnauthorized() {
  try {
    toast({ title: 'Session expired', description: 'Please log in again.', variant: 'destructive' as any });
  } catch {}
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Keep user profile for currency if desired, but safest to clear
    // localStorage.removeItem('user');
  } catch {}
  try {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  } catch {}
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!API_URL) throw new Error('VITE_API_URL is not configured');
  const url = `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token && !headers['Authorization']) headers['Authorization'] = `Bearer ${token}`;
  // If body is present and no content-type, default to JSON
  const hasBody = (init.body != null);
  if (hasBody && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const resp = await fetch(url, { ...init, headers });
  if (resp.status === 401) {
    onUnauthorized();
  }
  return resp;
}

export const api = {
  fetch: apiFetch,
  get: (path: string, init: RequestInit = {}) => apiFetch(path, { ...init, method: 'GET' }),
  post: (path: string, body?: any, init: RequestInit = {}) =>
    apiFetch(path, { ...init, method: 'POST', body: body != null ? JSON.stringify(body) : init.body }),
  patch: (path: string, body?: any, init: RequestInit = {}) =>
    apiFetch(path, { ...init, method: 'PATCH', body: body != null ? JSON.stringify(body) : init.body }),
  delete: (path: string, init: RequestInit = {}) => apiFetch(path, { ...init, method: 'DELETE' }),
};
