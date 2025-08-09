import { apiClient } from './client';
import type { LoginData, CreateUserData, UpdateUserData, User } from '../types/user';
import type { ChangePasswordData } from '../types/settings';

export interface LoginResponse {
  message: string;
  user: User;
  role: string;
}

export interface ProfileResponse {
  user: User;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user?: User;
  role?: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/admin/login/', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout/');
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get('/auth/profile/');
    return response.data;
  },

  // Check auth status using cookies
  getAuthStatus: async (): Promise<AuthStatusResponse> => {
    const response = await apiClient.get('/auth/admin/status/');
    return response.data;
  },

  // Refresh access token using refresh cookie
  refreshToken: async (): Promise<{ token: string; type: string }> => {
    const response = await apiClient.post('/auth/token/refresh/');
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password/', data);
    return response.data;
  },
}