import apiClient from './client';
import { type ApiResponse, type LoginData, type RegisterData, type User, type AuthResponse } from './types';

export type { LoginData, RegisterData, User, AuthResponse };

export const authApi = {
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  me: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const saveAuth = (response: AuthResponse) => {
  localStorage.setItem('auth_token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
};

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};