import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';
import type { SettingsTab } from '../../../types/settings';

interface TabNavigationProps {
  tabs: SettingsTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "border-b rounded-t-xl",
      theme.primary,
      theme.border
    )}>
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300",
                activeTab === tab.id
                  ? "border-orange-500 text-orange-400"
                  : cn("border-transparent hover:border-orange-500/50", theme.textSecondary, "hover:text-slate-200")
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;
