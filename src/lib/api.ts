import { Platform } from 'react-native';

import { API_CONSUMER_PREFIX } from '@/constants/isi-plaza';
import type {
  ApiErrorBody,
  BusinessCategory,
  ConsumerAuthResponse,
  ConsumerBanner,
  ConsumerUser,
  CountryFilterOption,
  PaginatedSellers,
  SellerDetail,
  SellerInteractionType,
  SellerListItem,
  SocialLoginBody,
} from '@/types/api';

/** En emulador Android, 127.0.0.1 es el propio emulador; el host es 10.0.2.2 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
  let url = fromEnv.replace(/\/$/, '');

  if (Platform.OS === 'android' && /\/\/127\.0\.0\.1|\/\/localhost\b/.test(url)) {
    url = url.replace('127.0.0.1', '10.0.2.2').replace('localhost', '10.0.2.2');
  }

  return url;
}

const BASE_URL = resolveBaseUrl();

function consumerUrl(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${API_CONSUMER_PREFIX}/${normalized}`;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

type DataEnvelope<T> = { data: T };

function hasDataEnvelope<T>(value: unknown): value is DataEnvelope<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    Array.isArray((value as DataEnvelope<T>).data)
  );
}

function unwrapList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (hasDataEnvelope<T>(json)) return json.data;
  return [];
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = consumerUrl(path);
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    const hint =
      Platform.OS === 'android'
        ? ' ¿Backend en marcha? En emulador Android usa EXPO_PUBLIC_API_URL=http://10.0.2.2:8000'
        : ' ¿Backend en marcha? (php artisan serve)';
    throw new Error(`No se pudo conectar al servidor.${hint}`);
  }

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const err = (await response.json()) as ApiErrorBody;
      if (err.message) message = err.message;
      else if (err.errors) {
        message = Object.values(err.errors).flat().join(', ');
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export type SellersQuery = {
  country?: string;
  state?: string;
  business_category_id?: number;
  per_page?: number;
  page?: number;
};

export const consumerApi = {
  socialLogin: (body: SocialLoginBody) =>
    request<ConsumerAuthResponse>('auth/social', { method: 'POST', body }),

  logout: (token: string) => request<void>('logout', { method: 'POST', token }),

  me: (token: string) => request<ConsumerUser>('me', { token }),

  getBusinessCategories: async () => {
    const json = await request<BusinessCategory[] | DataEnvelope<BusinessCategory[]>>(
      'business-categories',
    );
    return unwrapList<BusinessCategory>(json);
  },

  getBanners: async () => {
    const json = await request<ConsumerBanner[] | DataEnvelope<ConsumerBanner[]>>('banners');
    return unwrapList<ConsumerBanner>(json);
  },

  clickBanner: (bannerId: number) =>
    request<void>(`banners/${bannerId}/click`, { method: 'POST' }),

  getCountries: async () => {
    const json = await request<CountryFilterOption[] | DataEnvelope<CountryFilterOption[]>>(
      'filters/countries',
    );
    return unwrapList<CountryFilterOption>(json);
  },

  getStates: async (country: string) => {
    const json = await request<string[] | DataEnvelope<string[]> | { country: string; data: string[] }>(
      `filters/states?country=${encodeURIComponent(country)}`,
    );
    if (Array.isArray(json)) return json;
    if (hasDataEnvelope<string>(json)) return json.data;
    if (typeof json === 'object' && json !== null && 'data' in json && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  },

  getSellers: (query: SellersQuery = {}, token?: string | null) => {
    const params = new URLSearchParams();
    if (query.country) params.set('country', query.country);
    if (query.state) params.set('state', query.state);
    if (query.business_category_id != null) {
      params.set('business_category_id', String(query.business_category_id));
    }
    if (query.per_page != null) params.set('per_page', String(query.per_page));
    if (query.page != null) params.set('page', String(query.page));
    const qs = params.toString();
    return request<PaginatedSellers>(`sellers${qs ? `?${qs}` : ''}`, { token });
  },

  getSeller: (id: number, token?: string | null) =>
    request<SellerDetail>(`sellers/${id}`, { token }),

  recordInteraction: (sellerId: number, eventType: SellerInteractionType, token?: string | null) =>
    request<void>(`sellers/${sellerId}/interactions`, {
      method: 'POST',
      body: { event_type: eventType },
      token,
    }),

  getFavorites: async (token: string) => {
    const json = await request<SellerListItem[] | DataEnvelope<SellerListItem[]>>('favorites', {
      token,
    });
    return unwrapList<SellerListItem>(json);
  },

  addFavorite: (sellerId: number, token: string) =>
    request<void>(`favorites/${sellerId}`, { method: 'POST', token }),

  removeFavorite: (sellerId: number, token: string) =>
    request<void>(`favorites/${sellerId}`, { method: 'DELETE', token }),
};

export function getApiBaseUrl(): string {
  return BASE_URL;
}
