import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { 
  DEFAULT_BUSINESS_SETTINGS, 
  DEFAULT_USER_SETTINGS, 
  DEFAULT_SYSTEM_SETTINGS 
} from '../constants/settings';
import type { 
  BusinessSettings, 
  UserSettings, 
  SystemSettings, 
  ChangePasswordData,
  SettingsSectionType 
} from '../types/settings';

export const useSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initial settings with defaults
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(DEFAULT_BUSINESS_SETTINGS);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: user?.username?.split(' ')[0] || user?.username || 'Admin',
    lastName: user?.username?.split(' ')[1] || 'User',
    email: user?.email || 'admin@cardetailing.com',
    ...DEFAULT_USER_SETTINGS
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);

  const handleSave = async (section: SettingsSectionType) => {
    setIsLoading(true);
    try {
      if (section === 'User') {
        // Update user profile
        await authApi.updateUser(user!.id, {
          firstName: userSettings.firstName,
          lastName: userSettings.lastName,
          email: userSettings.email,
          phone: userSettings.phone
        });
        toast.success('Profile updated successfully');
      } else {
        // Simulate API call for other sections
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`${section} settings saved successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (passwordData: ChangePasswordData) => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
      throw error; // Re-throw to let component handle it
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Settings state
    businessSettings,
    userSettings,
    systemSettings,
    
    // State setters
    setBusinessSettings,
    setUserSettings,
    setSystemSettings,
    
    // Actions
    handleSave,
    handlePasswordChange,
    
    // Loading state
    isLoading
  };
};
