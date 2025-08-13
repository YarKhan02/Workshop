import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsQueries, settingsMutations } from '../api/settings';
import type { BusinessSettings, ChangePasswordData } from '../types/settings';

export const useSettings = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [localBusinessSettings, setLocalBusinessSettings] = useState<BusinessSettings | null>(null);

  // Get business settings
  const {
    data: businessSettings,
    isLoading: loadingBusinessSettings,
    error: businessSettingsError
  } = useQuery(settingsQueries.businessSettings());

  // Update local state when API data changes
  useEffect(() => {
    if (businessSettings) {
      setLocalBusinessSettings(businessSettings);
    }
  }, [businessSettings]);

  // Update business settings mutation
  const updateBusinessMutation = useMutation({
    ...settingsMutations.updateBusiness,
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueries.keys.business() });
      toast.success('Business settings updated successfully');
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error('Failed to update business settings:', error);
      toast.error(error.response?.data?.error || 'Failed to update business settings');
      setIsLoading(false);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    ...settingsMutations.changePassword,
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error('Failed to change password:', error);
      setIsLoading(false);
      
      // Handle different error response formats
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors with details
        if (errorData.details && typeof errorData.details === 'object') {
          // Extract first validation error message
          const firstFieldErrors = Object.values(errorData.details)[0];
          if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
            toast.error(firstFieldErrors[0]);
            return;
          }
        }
        
        // Handle simple error message
        if (errorData.error) {
          toast.error(errorData.error);
          return;
        }
      }
      
      // Fallback error message
      toast.error('Failed to change password. Please try again.');
    },
  });

  const handleSave = async (section: 'Business' | 'Password') => {
    if (section === 'Business' && localBusinessSettings) {
      // Save the current form data to the backend
      updateBusinessSettings(localBusinessSettings);
    }
  };

  const handlePasswordChange = async (passwordData: ChangePasswordData) => {
    await changePasswordMutation.mutateAsync(passwordData);
  };

  const updateBusinessSettings = (settings: Partial<BusinessSettings>) => {
    updateBusinessMutation.mutate(settings);
  };

  return {
    // Data - use local state for form editing, fallback to API data
    businessSettings: localBusinessSettings || businessSettings,
    
    // Loading states
    isLoading: isLoading || loadingBusinessSettings || updateBusinessMutation.isPending || changePasswordMutation.isPending,
    
    // Setters (for form state management)
    setBusinessSettings: (settings: BusinessSettings) => {
      setLocalBusinessSettings(settings);
    },
    
    // Handlers
    handleSave,
    handlePasswordChange,
    updateBusinessSettings,
    
    // Errors
    businessSettingsError,
  };
};
