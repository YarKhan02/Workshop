import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { BACKUP_FREQUENCY_OPTIONS } from '../../../constants/settings';
import ToggleSwitch from './ToggleSwitch';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';
import type { SystemSettings } from '../../../types/settings';

interface SystemSettingsProps {
  settings: SystemSettings;
  onSettingsChange: (settings: SystemSettings) => void;
  onSave: () => void;
  isLoading: boolean;
}

const SystemSettingsSection: React.FC<SystemSettingsProps> = ({
  settings,
  onSettingsChange,
  onSave,
  isLoading,
}) => {
  const { theme } = useTheme();
  
  const updateSetting = (field: keyof SystemSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const backupFrequencyOptions = BACKUP_FREQUENCY_OPTIONS;

  const systemOptions = [
    {
      key: 'maintenanceMode' as const,
      title: 'Maintenance Mode',
      description: 'Temporarily disable the system for maintenance',
      isDangerous: true
    },
    {
      key: 'debugMode' as const,
      title: 'Debug Mode',
      description: 'Enable detailed logging for troubleshooting',
      isDangerous: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-5 w-5 text-orange-400" />
        <h2 className={cn("text-xl font-semibold", theme.textPrimary)}>System Configuration</h2>
      </div>

      {/* Backup & Data */}
      <div>
        <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>Backup & Data Management</h3>
        <div className="space-y-4">
          {/* Auto Backup Toggle */}
          <div className={cn("flex items-center justify-between p-4 rounded-lg", theme.backgroundSecondary, theme.border)}>
            <div>
              <div className={cn("font-medium", theme.textPrimary)}>Auto Backup</div>
              <div className={cn("text-sm", theme.textSecondary)}>Automatically backup data at scheduled intervals</div>
            </div>
            <ToggleSwitch
              checked={settings.autoBackup}
              onChange={(checked) => updateSetting('autoBackup', checked)}
            />
          </div>

          {/* Backup Settings */}
          {settings.autoBackup && (
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg", theme.backgroundSecondary, theme.border)}>
              <div>
                <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
                  Backup Frequency
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                  className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
                >
                  {backupFrequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
                  Data Retention (days)
                </label>
                <input
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
                  className={cn("w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50", theme.components.input.base)}
                  min="1"
                  max="365"
                />
                <p className={cn("text-xs mt-1", theme.textSecondary)}>
                  How long to keep backup files (1-365 days)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Options */}
      <div className={cn("border-t pt-6", theme.border)}>
        <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>System Options</h3>
        <div className="space-y-4">
          {systemOptions.map((option) => (
            <div 
              key={option.key} 
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                option.isDangerous 
                  ? "bg-red-900/20 border-red-600/30" 
                  : cn(theme.backgroundSecondary, theme.border)
              )}
            >
              <div>
                <div className={cn(
                  "font-medium",
                  option.isDangerous ? "text-red-300" : theme.textPrimary
                )}>
                  {option.title}
                  {option.isDangerous && (
                    <span className="ml-2 text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded-full">
                      Caution
                    </span>
                  )}
                </div>
                <div className={cn("text-sm", theme.textSecondary)}>{option.description}</div>
              </div>
              <ToggleSwitch
                checked={settings[option.key]}
                onChange={(checked) => updateSetting(option.key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Warning for Maintenance Mode */}
      {settings.maintenanceMode && (
        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 font-medium mb-1">
            <SettingsIcon className="h-4 w-4" />
            System in Maintenance Mode
          </div>
          <p className="text-sm text-red-300">
            When maintenance mode is enabled, the system will be temporarily unavailable to users.
            Only administrators will be able to access the system.
          </p>
        </div>
      )}

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

export default SystemSettingsSection;
