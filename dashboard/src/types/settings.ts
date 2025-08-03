export interface WorkingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface BusinessSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingHours: WorkingHours;
  currency: 'PKR' | 'USD' | 'EUR' | 'GBP';
  timezone: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingAlerts: boolean;
  lowStockAlerts: boolean;
  paymentReminders: boolean;
}

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: 'en' | 'hi' | 'es' | 'fr';
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
}

export interface SystemSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number;
  maintenanceMode: boolean;
  debugMode: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type SettingsSectionType = 'Business' | 'User' | 'Notification' | 'Password' | 'System';
