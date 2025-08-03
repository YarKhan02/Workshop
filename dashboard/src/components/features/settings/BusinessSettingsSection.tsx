import React from 'react';
import { Building, Save } from 'lucide-react';
import { CURRENCY_OPTIONS, TIMEZONE_OPTIONS } from '../../../constants/settings';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';
import type { BusinessSettings, WorkingHours } from '../../../types/settings';

interface BusinessSettingsProps {
  settings: BusinessSettings;
  onSettingsChange: (settings: BusinessSettings) => void;
  onSave: () => void;
  isLoading: boolean;
}

const BusinessSettingsSection: React.FC<BusinessSettingsProps> = ({
  settings,
  onSettingsChange,
  onSave,
  isLoading,
}) => {
  const { theme } = useTheme();
  
  const updateSetting = (field: keyof BusinessSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const updateWorkingHours = (day: keyof WorkingHours, hours: string) => {
    onSettingsChange({
      ...settings,
      workingHours: { ...settings.workingHours, [day]: hours }
    });
  };

  const currencyOptions = CURRENCY_OPTIONS;
  const timezoneOptions = TIMEZONE_OPTIONS;

  const weekdays = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Building className="h-5 w-5 text-orange-400" />
        <h2 className={cn("text-xl font-semibold", theme.textPrimary)}>Workshop Information</h2>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Business Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => updateSetting('name', e.target.value)}
            className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
          />
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => updateSetting('phone', e.target.value)}
            className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
          />
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Email Address
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => updateSetting('email', e.target.value)}
            className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
          />
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Website
          </label>
          <input
            type="url"
            value={settings.website}
            onChange={(e) => updateSetting('website', e.target.value)}
            className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Address
          </label>
          <textarea
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            rows={3}
            className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
          />
        </div>
      </div>

      {/* Working Hours */}
      <div className={cn("border-t pt-6", theme.border)}>
        <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekdays.map((day) => (
            <div key={day} className="flex justify-between items-center">
              <span className={cn("text-sm font-medium capitalize min-w-[80px]", theme.textSecondary)}>
                {day}
              </span>
              <input
                type="text"
                value={settings.workingHours[day]}
                onChange={(e) => updateWorkingHours(day, e.target.value)}
                className={cn("flex-1 ml-4 px-3 py-1 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
                placeholder="e.g., 8:00 AM - 6:00 PM"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Regional Settings */}
      <div className={cn("border-t pt-6", theme.border)}>
        <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={cn("flex justify-end border-t pt-6", theme.border)}>
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

export default BusinessSettingsSection;
