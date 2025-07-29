import React from 'react';
import type { Notification } from '../../types/notification';

interface PriorityBadgeProps {
  priority: Notification['priority'];
  size?: 'sm' | 'md';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  return (
    <span 
      className={`
        ${getPriorityColor()} 
        ${getSizeClasses()} 
        rounded-full font-medium border backdrop-blur-sm
      `}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
