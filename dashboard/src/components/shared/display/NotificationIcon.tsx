import React from 'react';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import type { Notification } from '../../types/notification';

interface NotificationIconProps {
  type: Notification['type'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  type, 
  size = 'md',
  className = "" 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-5 w-5';
    }
  };

  const getIcon = () => {
    const iconClasses = `${getSizeClasses()} ${className}`;
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClasses} text-green-400`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-400`} />;
      case 'error':
        return <XCircleIcon className={`${iconClasses} text-red-400`} />;
      case 'booking':
        return <CalendarDaysIcon className={`${iconClasses} text-blue-400`} />;
      case 'system':
        return <CogIcon className={`${iconClasses} text-purple-400`} />;
      default:
        return <InformationCircleIcon className={`${iconClasses} text-blue-400`} />;
    }
  };

  return getIcon();
};

export default NotificationIcon;
