import React from 'react';
import { User, Save, Palette } from 'lucide-react';
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '../../../constants/settings';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/themeUtils';
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
  const { currentTheme, setTheme, theme } = useTheme();
  
  const updateSetting = (field: keyof UserSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleThemeChange = (newTheme: string) => {
    // Store theme selection in settings state, don't apply immediately
    updateSetting('theme', newTheme);
  };

  const handleSave = () => {
    // Apply theme change when saving
    if (settings.theme && settings.theme !== currentTheme) {
      setTheme(settings.theme as any);
    }
    // Call the original save function
    onSave();
  };

  const languageOptions = LANGUAGE_OPTIONS;
  const themeOptions = THEME_OPTIONS;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-orange-400" />
        <h2 className={cn("text-xl font-semibold", theme.textPrimary)}>User Preferences</h2>
      </div>

      {/* Personal Information */}
      <div className={cn("rounded-lg p-6", theme.backgroundSecondary)}>
        <h3 className={cn("text-lg font-semibold mb-4", theme.textPrimary)}>Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              First Name
            </label>
            <input
              type="text"
              value={settings.firstName}
              onChange={(e) => updateSetting('firstName', e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            />
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Last Name
            </label>
            <input
              type="text"
              value={settings.lastName}
              onChange={(e) => updateSetting('lastName', e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            />
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Email
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
              Phone
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className={cn("rounded-lg p-6", theme.backgroundSecondary)}>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-orange-400" />
          <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Theme
            </label>
            <select
              value={settings.theme || currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
            >
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {settings.theme && settings.theme !== currentTheme && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-orange-400">
                  Theme change pending - click Save to apply
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={cn("flex justify-end pt-6", theme.border)} style={{ borderTop: '1px solid' }}>
        <button
          onClick={handleSave}
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
