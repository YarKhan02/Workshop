import { apiClient } from './client';
import type { LoginData, CreateUserData, UpdateUserData, User } from '../types/user';
import type { ChangePasswordData } from '../types/settings';
import { useRef, useCallback } from 'react';

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}

export const authApi = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login/', data);
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

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password/', data);
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post(
      '/auth/token/refresh/',
      {},
      {
        withCredentials: true, // Ensure cookies are sent
      }
    );
    return response.data;
  },
}

export function useAuthSession() {
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Call this after login
  const setAccessToken = useCallback((token: string, expiresIn: number = 600) => {
    accessTokenRef.current = token;
    // Clear any previous timer
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    // Schedule silent refresh 1 minute before expiry
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const { token: newToken } = await authApi.refreshToken();
        setAccessToken(newToken, expiresIn);
      } catch (err) {
        accessTokenRef.current = null;
      }
    }, (expiresIn - 60) * 1000); // expiresIn in seconds
  }, []);

  // Call this on logout
  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    authApi.logout();
  }, []);

  // Optionally, expose accessTokenRef.current for API calls
  return {
    getAccessToken: () => accessTokenRef.current,
    setAccessToken,
    clearSession,
  };
}