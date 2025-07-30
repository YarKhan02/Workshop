import type { BusinessSettings, UserSettings, SystemSettings } from '../types/settings';

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  name: 'Car Detailing Pro',
  address: '123 Main Street, City, State 12345',
  phone: '+92 300 1234567',
  email: 'info@cardetailing.com',
  website: 'https://cardetailing.com',
  workingHours: {
    monday: '8:00 AM - 8:00 PM',
    tuesday: '8:00 AM - 8:00 PM',
    wednesday: '8:00 AM - 8:00 PM',
    thursday: '8:00 AM - 8:00 PM',
    friday: '8:00 AM - 8:00 PM',
    saturday: '8:00 AM - 6:00 PM',
    sunday: 'Closed'
  },
  currency: 'PKR',
  timezone: 'Asia/Karachi'
};

export const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'firstName' | 'lastName' | 'email'> = {
  phone: '+92 300 1234567',
  language: 'en',
  theme: 'dark',
  notifications: {
    email: true,
    sms: false,
    push: true,
    bookingAlerts: true,
    lowStockAlerts: true,
    paymentReminders: true
  }
};

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  autoBackup: true,
  backupFrequency: 'daily',
  dataRetention: 30,
  maintenanceMode: false,
  debugMode: false
};

export const CURRENCY_OPTIONS = [
  { value: 'PKR', label: 'Pakistani Rupee (₨)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
] as const;

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Karachi', label: 'Asia/Karachi (PKT)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
] as const;

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] as const;

export const BACKUP_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;
