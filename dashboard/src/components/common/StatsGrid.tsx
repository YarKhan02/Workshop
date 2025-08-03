// Generic StatsGrid Component - Reusable stats cards layout

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/themeUtils';

export interface StatItem {
  title?: string;
  label?: string; // Alternative to title
  value: string | number;
  icon: React.ComponentType<{ className?: string }> | React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'yellow' | 'gray';
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
}

interface StatsGridProps {
  stats: StatItem[];
  loading?: boolean;
  columns?: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  loading = false, 
  columns = 4 
}) => {
  const { theme } = useTheme();
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'green': return 'bg-green-500/20 text-green-400';
      case 'red': return 'bg-red-500/20 text-red-400';
      case 'purple': return 'bg-purple-500/20 text-purple-400';
      case 'orange': return 'bg-orange-500/20 text-orange-400';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400';
      case 'gray': return cn(theme.surface, theme.textSecondary);
      default: return cn(theme.surface, theme.textSecondary);
    }
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {[...Array(columns)].map((_, index) => (
          <div key={index} className={cn(
            theme.components.card.base,
            "p-6"
          )}>
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className={cn(
                    "h-4 rounded w-24 mb-2",
                    theme.surface
                  )}></div>
                  <div className={cn(
                    "h-8 rounded w-16",
                    theme.surface
                  )}></div>
                </div>
                <div className={cn(
                  "p-3 rounded-xl",
                  theme.surface
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded",
                    theme.surface
                  )}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {stats.map((stat, index) => (
        <div key={index} className={cn(
          theme.components.card.base,
          "p-6 min-w-0 flex-1"
        )}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-sm font-medium mb-1 truncate",
                theme.textSecondary
              )}>{stat.title || stat.label}</p>
              <p className={cn(
                "text-2xl font-bold truncate",
                theme.textPrimary
              )}>{stat.value}</p>
              {stat.change && (
                <div className="flex items-center mt-2">
                  <span className="text-green-400 font-semibold text-base">{stat.change.value}</span>
                </div>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-lg flex-shrink-0",
              getColorClasses(stat.color)
            )}>
              {React.isValidElement(stat.icon) ? stat.icon : 
               typeof stat.icon === 'function' ? 
                React.createElement(stat.icon, { className: "h-8 w-8" }) : 
                stat.icon
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
