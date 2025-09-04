import axios from 'axios';

const API_BASE_URL = 'https://function.chatporter.com/function/config-store';
const TOKEN_URL = 'https://function.chatporter.com/function/workforce/auth/token';

// Axios instance and auth token handling
const api = axios.create({ baseURL: API_BASE_URL });

let accessToken: string | null = null;

const loadToken = () => {
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('config_store_token');
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }
};

loadToken();

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

export const setAuthToken = (token: string) => {
  accessToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('config_store_token', token);
  }
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  accessToken = null;
  try {
    delete api.defaults.headers.common['Authorization'];
  } catch {}
  if (typeof window !== 'undefined') {
    localStorage.removeItem('config_store_token');
  }
};

export interface ConfigDefinition {
  key: string;
  title: string;
  description?: string | null;
  schema: Record<string, any>;
}

export interface ConfigValue {
  value: any;
  version: number;
  updated_at: string; // ISO string
}

export const fetchDefinitions = async (): Promise<ConfigDefinition[]> => {
  const response = await api.get('/definitions');
  return response.data;
};

export const fetchConfigValue = async (
  key: string
): Promise<ConfigValue | null> => {
  try {
    const response = await api.get(`/config/${encodeURIComponent(key)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const saveConfigValue = async (
  key: string,
  value: any
): Promise<ConfigValue> => {
  const response = await api.post(`/config/${encodeURIComponent(key)}`, value);
  return response.data;
};

export const login = async (username: string, password: string, tenant?: string) => {
  const body = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
  });
  if (tenant && tenant.trim().length > 0) {
    body.append('tenant_id', tenant.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem('config_store_tenant', tenant.trim());
    }
  }
  const response = await axios.post(
    TOKEN_URL,
    body.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  const token = response.data?.access_token as string;
  if (!token) throw new Error('No access_token in auth response');
  setAuthToken(token);
  return response.data;
};
