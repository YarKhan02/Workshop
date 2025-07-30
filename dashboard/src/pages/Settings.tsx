import React, { useState } from 'react';
import { Building, User, Bell, Lock, Settings as SettingsIcon } from 'lucide-react';

// Components
import TabNavigation from '../components/features/settings/TabNavigation';
import BusinessSettingsSection from '../components/features/settings/BusinessSettingsSection';
import UserSettingsSection from '../components/features/settings/UserSettingsSection';
import NotificationSettingsSection from '../components/features/settings/NotificationSettingsSection';
import PasswordChangeSection from '../components/features/settings/PasswordChangeSection';
import SystemSettingsSection from '../components/features/settings/SystemSettingsSection';

// Hooks & Types
import { useSettings } from '../hooks/useSettings';
import type { SettingsTab } from '../types/settings';

/**
 * Admin Settings Page
 * 
 * This is the main settings interface for administrators only.
 * It provides comprehensive control over:
 * - Workshop/Business configuration
 * - User profile management
 * - Notification preferences
 * - Password/Security settings
 * - System configuration
 * 
 * Note: This interface is exclusively for admin users and includes
 * system-level controls that regular users should not access.
 */
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');
  
  const {
    businessSettings,
    userSettings,
    systemSettings,
    setBusinessSettings,
    setUserSettings,
    setSystemSettings,
    handleSave,
    handlePasswordChange,
    isLoading
  } = useSettings();

  // Admin-only tabs - includes system configuration
  const tabs: SettingsTab[] = [
    { id: 'business', label: 'Workshop', icon: Building },
    { id: 'user', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'password', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Admin Command Center
        </h1>
        <p className="text-slate-400 mt-1">
          Configure your workshop operations and system settings
        </p>
        <div className="mt-2 px-3 py-1 bg-orange-600/20 text-orange-400 text-xs font-medium rounded-full inline-block">
          Administrator Access Only
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 rounded-xl shadow-2xl border border-slate-700/30 backdrop-blur-md">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="p-6">
          {/* Workshop Settings */}
          {activeTab === 'business' && (
            <BusinessSettingsSection
              settings={businessSettings}
              onSettingsChange={setBusinessSettings}
              onSave={() => handleSave('Business')}
              isLoading={isLoading}
            />
          )}

          {/* Admin Profile Settings */}
          {activeTab === 'user' && (
            <UserSettingsSection
              settings={userSettings}
              onSettingsChange={setUserSettings}
              onSave={() => handleSave('User')}
              isLoading={isLoading}
            />
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <NotificationSettingsSection
              settings={userSettings}
              onSettingsChange={setUserSettings}
              onSave={() => handleSave('Notification')}
              isLoading={isLoading}
            />
          )}

          {/* Security Settings */}
          {activeTab === 'password' && (
            <PasswordChangeSection
              onPasswordChange={handlePasswordChange}
              isLoading={isLoading}
            />
          )}

          {/* System Administration */}
          {activeTab === 'system' && (
            <SystemSettingsSection
              settings={systemSettings}
              onSettingsChange={setSystemSettings}
              onSave={() => handleSave('System')}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Admin Notice */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <SettingsIcon className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Administrator Notice</h3>
            <p className="text-slate-400 text-sm">
              These settings control critical aspects of your workshop system. Changes to system 
              configuration may affect all users. Please ensure you understand the implications 
              before modifying system-level settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 