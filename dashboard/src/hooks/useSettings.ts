import { useState } from 'react';
import toast from 'react-hot-toast';
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

  // Load settings from localStorage or use defaults
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('workshop-business-settings');
    return saved ? JSON.parse(saved) : DEFAULT_BUSINESS_SETTINGS;
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('workshop-user-settings');
    const defaultUserSettings = {
      firstName: user?.username?.split(' ')[0] || user?.username || 'Admin',
      lastName: user?.username?.split(' ')[1] || 'User',
      email: user?.email || 'admin@cardetailing.com',
      ...DEFAULT_USER_SETTINGS
    };
    return saved ? { ...defaultUserSettings, ...JSON.parse(saved) } : defaultUserSettings;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('workshop-system-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_SETTINGS;
  });

  const handleSave = async (section: SettingsSectionType) => {
    setIsLoading(true);
    try {
      // Since there's no backend, save all settings to localStorage
      if (section === 'User') {
        localStorage.setItem('workshop-user-settings', JSON.stringify(userSettings));
        toast.success('Profile updated successfully');
      } else if (section === 'Business') {
        localStorage.setItem('workshop-business-settings', JSON.stringify(businessSettings));
        toast.success('Business settings saved successfully');
      } else if (section === 'System') {
        localStorage.setItem('workshop-system-settings', JSON.stringify(systemSettings));
        toast.success('System settings saved successfully');
      } else {
        // For other sections like notifications
        localStorage.setItem(`workshop-${section.toLowerCase()}-settings`, JSON.stringify(userSettings));
        toast.success(`${section} settings saved successfully`);
      }
      
      // Small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
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
      // Since there's no backend, simulate password change
      // In a real app, this would validate current password and update it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store password change timestamp for demo purposes
      localStorage.setItem('workshop-last-password-change', new Date().toISOString());
      
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error('Failed to change password');
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
