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
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import type { SettingsTab } from '../types/settings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');
  const { theme } = useTheme();
  
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
        <p className={cn("mt-1", theme.textSecondary)}>
          Configure your workshop operations and system settings
        </p>
        <div className="mt-2 px-3 py-1 bg-orange-600/20 text-orange-400 text-xs font-medium rounded-full inline-block">
          Administrator Access Only
        </div>
      </div>

      {/* Settings Panel */}
      <div className={cn(
        "rounded-xl shadow-2xl backdrop-blur-md",
        theme.backgroundSecondary,
        theme.border
      )}>
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
      <div className={cn(
        "rounded-lg p-4",
        theme.backgroundSecondary,
        theme.border
      )}>
        <div className="flex items-start gap-3">
          <SettingsIcon className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className={cn("font-medium mb-1", theme.textPrimary)}>Administrator Notice</h3>
            <p className={cn("text-sm", theme.textSecondary)}>
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