// Settings API Service - Simplified for business settings and password change

import { apiClient } from './client';
import type {
  BusinessSettings,
  ChangePasswordData,
} from '../types/settings';

// ==================== SETTINGS API SERVICE ====================

export const settingsAPI = {
  // Get business settings
  getBusinessSettings: async (): Promise<BusinessSettings> => {
    const response = await apiClient.get('/settings/data/');
    return response.data;
  },

  // Update business settings
  updateBusinessSettings: async (settings: Partial<BusinessSettings>): Promise<BusinessSettings> => {
    const response = await apiClient.patch('/settings/update/', settings);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/settings/change-password/', {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword,
    });
    return response.data;
  },

  // Reset business settings to defaults
  resetBusinessSettings: async (): Promise<{ message: string; data: BusinessSettings }> => {
    const response = await apiClient.post('/settings/reset-business/');
    return response.data;
  },
};

// ==================== REACT QUERY CONFIGURATION ====================

export const settingsQueries = {
  // Query keys for React Query
  keys: {
    all: ['settings'] as const,
    business: () => [...settingsQueries.keys.all, 'business'] as const,
  },

  // Query functions
  businessSettings: () => ({
    queryKey: settingsQueries.keys.business(),
    queryFn: () => settingsAPI.getBusinessSettings(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  }),
};

// ==================== MUTATION CONFIGURATIONS ====================

export const settingsMutations = {
  updateBusiness: {
    mutationFn: (settings: Partial<BusinessSettings>) => 
      settingsAPI.updateBusinessSettings(settings),
  },

  changePassword: {
    mutationFn: (passwordData: ChangePasswordData) => 
      settingsAPI.changePassword(passwordData),
  },

  resetBusiness: {
    mutationFn: () => settingsAPI.resetBusinessSettings(),
  },
};

// Export types for convenience
export type { BusinessSettings, ChangePasswordData };
