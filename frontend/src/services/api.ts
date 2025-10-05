import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  twoFactor?: {
    secret: string;
    qrCode: string;
  };
}

export interface VaultItem {
  _id: string;
  userId: string;
  encryptedData: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
}

// Auth endpoints
export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', { email, password });
  return response.data;
};

export const login = async (email: string, password: string, twoFactorToken?: string): Promise<AuthResponse & { requiresTwoFactor?: boolean }> => {
  const response = await api.post('/auth/login', { email, password, twoFactorToken });
  return response.data;
};

// Vault endpoints
export const getVaultItems = async (): Promise<VaultItem[]> => {
  const response = await api.get('/vault');
  return response.data;
};

export const createVaultItem = async (encryptedData: string, iv: string): Promise<VaultItem> => {
  const response = await api.post('/vault', { encryptedData, iv });
  return response.data;
};

export const updateVaultItem = async (
  id: string,
  encryptedData: string,
  iv: string
): Promise<VaultItem> => {
  const response = await api.put(`/vault/${id}`, { encryptedData, iv });
  return response.data;
};

export const deleteVaultItem = async (id: string): Promise<void> => {
  await api.delete(`/vault/${id}`);
};

// 2FA endpoints
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
}

export const setup2FA = async (): Promise<TwoFactorSetup> => {
  const response = await api.post('/2fa/setup');
  return response.data;
};

export const verify2FA = async (token: string): Promise<void> => {
  await api.post('/2fa/verify', { token });
};

export const disable2FA = async (password: string): Promise<void> => {
  await api.post('/2fa/disable', { password });
};

export const get2FAStatus = async (): Promise<{ enabled: boolean }> => {
  const response = await api.get('/2fa/status');
  return response.data;
};

export default api;
