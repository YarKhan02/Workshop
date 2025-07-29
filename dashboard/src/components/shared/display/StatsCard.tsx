import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'default' | 'primary' | 'danger' | 'warning' | 'success' | 'info';
  hasAlert?: boolean;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'default',
  hasAlert = false,
  delay = 0 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-orange-400';
      case 'danger':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${getColorClasses()}`}>{value}</p>
        </div>
        <div className="relative">
          <div className={getColorClasses()}>{icon}</div>
          {hasAlert && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
