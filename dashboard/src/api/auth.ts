import { apiClient } from './client';

export interface LoginData {
  username: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'staff';
  phone?: string;
  isActive: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'accountant' | 'staff';
  phone?: string;
  isActive?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'staff';
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

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
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  // Admin-only user management functions
  getUsers: async (): Promise<{ users: User[] }> => {
    const response = await apiClient.get('/auth/users');
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<{ message: string; user: User }> => {
    const response = await apiClient.post('/auth/users', data);
    return response.data;
  },

  updateUser: async (userId: number, data: UpdateUserData): Promise<{ message: string; user: User }> => {
    const response = await apiClient.put(`/auth/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/auth/users/${userId}`);
    return response.data;
  }
}; 