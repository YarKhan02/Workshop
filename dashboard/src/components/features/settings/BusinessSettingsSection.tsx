import React from 'react';
import { Building, Save } from 'lucide-react';
import { CURRENCY_OPTIONS, TIMEZONE_OPTIONS } from '../../../constants/settings';
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
        <h2 className="text-xl font-semibold text-slate-100">Workshop Information</h2>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => updateSetting('name', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => updateSetting('phone', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => updateSetting('email', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={settings.website}
            onChange={(e) => updateSetting('website', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Address
          </label>
          <textarea
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>
      </div>

      {/* Working Hours */}
      <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-lg font-medium text-slate-100 mb-4">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekdays.map((day) => (
            <div key={day} className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300 capitalize min-w-[80px]">
                {day}
              </span>
              <input
                type="text"
                value={settings.workingHours[day]}
                onChange={(e) => updateWorkingHours(day, e.target.value)}
                className="flex-1 ml-4 px-3 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                placeholder="e.g., 8:00 AM - 6:00 PM"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Regional Settings */}
      <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-lg font-medium text-slate-100 mb-4">Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
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

export default BusinessSettingsSection;
