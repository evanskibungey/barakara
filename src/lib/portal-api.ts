import type { ApiResponse } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const PORTAL_TOKEN_KEY = 'baraka_portal_token';
export const PORTAL_USER_KEY  = 'baraka_portal_user';

export function getPortalToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PORTAL_TOKEN_KEY);
}

export function getPortalUser(): PortalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PORTAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPortalSession() {
  localStorage.removeItem(PORTAL_TOKEN_KEY);
  localStorage.removeItem(PORTAL_USER_KEY);
}

export interface PortalUser {
  id: number;
  name: string;
  phone: string;
  email?: string;
  member_id?: string;
  avatar_url?: string;
}

export async function portalFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getPortalToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': '1',
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearPortalSession();
    if (typeof window !== 'undefined') window.location.href = '/portal/login';
    throw new Error('Unauthorized');
  }

  return res.json();
}
