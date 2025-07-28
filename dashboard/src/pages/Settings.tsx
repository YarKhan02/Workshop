import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building, 
  User, 
  Bell, 
  Save,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

interface BusinessSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  currency: string;
  timezone: string;
}

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    bookingAlerts: boolean;
    lowStockAlerts: boolean;
    paymentReminders: boolean;
  };
}

interface SystemSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number;
  maintenanceMode: boolean;
  debugMode: boolean;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    name: 'Car Detailing Pro',
    address: '123 Main Street, City, State 12345',
    phone: '+91 98765 43210',
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
  });

  // User Settings
  const { user } = useAuth();
  
  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'User',
    email: user?.email || 'admin@cardetailing.com',
    phone: user?.phone || '+91 98765 43210',
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true,
      bookingAlerts: true,
      lowStockAlerts: true,
      paymentReminders: true
    }
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 30,
    maintenanceMode: false,
    debugMode: false
  });

  const handleSave = async (section: string) => {
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

  const handleChangePassword = async () => {
    // Validate passwords
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (changePasswordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword
      });
      
      toast.success('Password changed successfully');
      setChangePasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'business', label: 'Business', icon: Building },
    { id: 'user', label: 'User', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'system', label: 'System', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Command Center
        </h1>
        <p className="text-gray-400 mt-1">Configure your racing garage operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md">
        <div className="border-b border-gray-600/30">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-orange-500/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Building className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-gray-100">Garage Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessSettings.name}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={businessSettings.website}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(businessSettings.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                      <input
                        type="text"
                        value={hours}
                        onChange={(e) => setBusinessSettings(prev => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, [day]: e.target.value }
                        }))}
                        className="w-32 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={businessSettings.currency}
                      onChange={(e) => setBusinessSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PKR">Pakistani Rupee (₨)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={businessSettings.timezone}
                      onChange={(e) => setBusinessSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Business')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* User Settings */}
          {activeTab === 'user' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">User Preferences</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userSettings.firstName}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userSettings.lastName}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={userSettings.phone}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={userSettings.language}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={userSettings.theme}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'auto' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('User')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Email Notifications</div>
                        <div className="text-sm text-gray-500">Receive notifications via email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.notifications.email}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">SMS Notifications</div>
                        <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.notifications.sms}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sms: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Push Notifications</div>
                        <div className="text-sm text-gray-500">Receive notifications in the browser</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.notifications.push}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, push: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Booking Alerts</div>
                        <div className="text-sm text-gray-500">New bookings and schedule changes</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.notifications.bookingAlerts}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, bookingAlerts: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Low Stock Alerts</div>
                        <div className="text-sm text-gray-500">Inventory items running low</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.notifications.lowStockAlerts}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, lowStockAlerts: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Payment Reminders</div>
                        <div className="text-sm text-gray-500">Overdue payments and reminders</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userSettings.notifications.paymentReminders}
                          onChange={(e) => setUserSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, paymentReminders: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Notification')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Password Change */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              </div>

              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={changePasswordData.currentPassword}
                      onChange={(e) => setChangePasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={changePasswordData.newPassword}
                      onChange={(e) => setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={changePasswordData.confirmPassword}
                      onChange={(e) => setChangePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading || !changePasswordData.currentPassword || !changePasswordData.newPassword || !changePasswordData.confirmPassword}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <SettingsIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">System Configuration</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Backup & Data</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Auto Backup</div>
                        <div className="text-sm text-gray-500">Automatically backup data</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.autoBackup}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={systemSettings.backupFrequency}
                          onChange={(e) => setSystemSettings(prev => ({ 
                            ...prev, 
                            backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Retention (days)
                        </label>
                        <input
                          type="number"
                          value={systemSettings.dataRetention}
                          onChange={(e) => setSystemSettings(prev => ({ 
                            ...prev, 
                            dataRetention: parseInt(e.target.value) 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Maintenance Mode</div>
                        <div className="text-sm text-gray-500">Temporarily disable the system for maintenance</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Debug Mode</div>
                        <div className="text-sm text-gray-500">Enable detailed logging for troubleshooting</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.debugMode}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, debugMode: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('System')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 