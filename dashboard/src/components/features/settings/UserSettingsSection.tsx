import React from 'react';
import { User, Save } from 'lucide-react';
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '../../../constants/settings';
import type { UserSettings } from '../../../types/settings';

interface UserSettingsProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onSave: () => void;
  isLoading: boolean;
}

const UserSettingsSection: React.FC<UserSettingsProps> = ({
  settings,
  onSettingsChange,
  onSave,
  isLoading,
}) => {
  const updateSetting = (field: keyof UserSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const languageOptions = LANGUAGE_OPTIONS;
  const themeOptions = THEME_OPTIONS;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-orange-400" />
        <h2 className="text-xl font-semibold text-slate-100">User Preferences</h2>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={settings.firstName}
            onChange={(e) => updateSetting('firstName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={settings.lastName}
            onChange={(e) => updateSetting('lastName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email
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
            Phone
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
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => updateSetting('theme', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

export default UserSettingsSection;
