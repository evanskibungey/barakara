const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('baraka_token');
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/** Safely extract rows from either a paginated envelope or a plain array response. */
export function extractRows<T>(data: PaginatedData<T> | T[] | undefined | null): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return (data as PaginatedData<T>).data ?? [];
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': '1',
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData — the browser adds it with the correct boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('baraka_token');
      document.cookie = 'baraka_token=; Max-Age=0; path=/';
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  return res.json();
}
