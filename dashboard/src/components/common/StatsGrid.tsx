// Generic StatsGrid Component - Reusable stats cards layout

import React from 'react';

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

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  gray: 'bg-gray-100 text-gray-600',
};

const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  loading = false, 
  columns = 4 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {[...Array(columns)].map((_, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-600/50 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-600/50 rounded w-16"></div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-xl">
                  <div className="w-6 h-6 bg-gray-600/50 rounded"></div>
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
        <div key={index} className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">{stat.title || stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              {stat.change && (
                <div className={`flex items-center mt-2 text-sm ${
                  stat.change.type === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <span>{stat.change.value}</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${
              stat.color ? colorClasses[stat.color] : 'bg-slate-100 text-slate-600'
            }`}>
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
