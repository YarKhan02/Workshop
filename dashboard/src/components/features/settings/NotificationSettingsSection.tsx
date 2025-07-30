import React from 'react';
import { Bell, Save } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import type { UserSettings, NotificationPreferences } from '../../../types/settings';

interface NotificationSettingsProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onSave: () => void;
  isLoading: boolean;
}

const NotificationSettingsSection: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingsChange,
  onSave,
  isLoading,
}) => {
  const updateNotificationSetting = (field: keyof NotificationPreferences, value: boolean) => {
    onSettingsChange({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
  };

  const notificationChannels = [
    {
      key: 'email' as const,
      title: 'Email Notifications',
      description: 'Receive notifications via email'
    },
    {
      key: 'sms' as const,
      title: 'SMS Notifications',
      description: 'Receive notifications via SMS'
    },
    {
      key: 'push' as const,
      title: 'Push Notifications',
      description: 'Receive notifications in the browser'
    }
  ];

  const notificationTypes = [
    {
      key: 'bookingAlerts' as const,
      title: 'Booking Alerts',
      description: 'New bookings and schedule changes'
    },
    {
      key: 'lowStockAlerts' as const,
      title: 'Low Stock Alerts',
      description: 'Inventory items running low'
    },
    {
      key: 'paymentReminders' as const,
      title: 'Payment Reminders',
      description: 'Overdue payments and reminders'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5 text-orange-400" />
        <h2 className="text-xl font-semibold text-slate-100">Notification Preferences</h2>
      </div>

      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-medium text-slate-100 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {notificationChannels.map((channel) => (
            <div key={channel.key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <div>
                <div className="font-medium text-slate-200">{channel.title}</div>
                <div className="text-sm text-slate-400">{channel.description}</div>
              </div>
              <ToggleSwitch
                checked={settings.notifications[channel.key]}
                onChange={(checked) => updateNotificationSetting(channel.key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notification Types */}
      <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-lg font-medium text-slate-100 mb-4">Notification Types</h3>
        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <div>
                <div className="font-medium text-slate-200">{type.title}</div>
                <div className="text-sm text-slate-400">{type.description}</div>
              </div>
              <ToggleSwitch
                checked={settings.notifications[type.key]}
                onChange={(checked) => updateNotificationSetting(type.key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t border-slate-700/50 pt-6">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsSection;
