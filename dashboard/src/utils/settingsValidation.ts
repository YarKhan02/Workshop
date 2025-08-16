import type { BusinessSettings, UserSettings, SystemSettings, ChangePasswordData } from '../types/settings';

export const validateBusinessSettings = (settings: BusinessSettings): string[] => {
  const errors: string[] = [];
  
  if (!settings.name.trim()) {
    errors.push('Business name is required');
  }
  
  if (!settings.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!settings.phone.trim()) {
    errors.push('Phone number is required');
  }
  
  if (!settings.address.trim()) {
    errors.push('Address is required');
  }
  
  return errors;
};

export const validateUserSettings = (settings: UserSettings): string[] => {
  const errors: string[] = [];
  
  if (!settings.name.trim()) {
    errors.push('Name is required');
  }
  
  if (!settings.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!settings.phone.trim()) {
    errors.push('Phone number is required');
  }
  
  return errors;
};

export const validateSystemSettings = (settings: SystemSettings): string[] => {
  const errors: string[] = [];
  
  if (settings.autoBackup && settings.dataRetention < 1) {
    errors.push('Data retention must be at least 1 day');
  }
  
  if (settings.autoBackup && settings.dataRetention > 365) {
    errors.push('Data retention cannot exceed 365 days');
  }
  
  return errors;
};

export const validatePasswordData = (data: ChangePasswordData): string[] => {
  const errors: string[] = [];
  
  if (!data.currentPassword.trim()) {
    errors.push('Current password is required');
  }
  
  if (!data.newPassword.trim()) {
    errors.push('New password is required');
  } else if (data.newPassword.length < 8) {
    errors.push('New password must be at least 8 characters long');
  }
  
  if (!data.confirmPassword.trim()) {
    errors.push('Please confirm your new password');
  } else if (data.newPassword !== data.confirmPassword) {
    errors.push('New passwords do not match');
  }
  
  if (data.currentPassword === data.newPassword) {
    errors.push('New password must be different from current password');
  }
  
  return errors;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic validation for Pakistani phone numbers
  const pkPhoneRegex = /^(\+92|92|0)?[0-9]{10}$/;
  return pkPhoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits and add Pakistani country code if needed
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('92')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+92${cleaned.substring(1)}`;
  } else if (cleaned.length === 10) {
    return `+92${cleaned}`;
  }
  
  return phone; // Return original if we can't format it
};
