import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
  subtitle?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 3 }) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg',
      green: 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg',
      purple: 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg',
      yellow: 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg',
      red: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg',
      gray: 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center">
            <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
              <stat.icon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
