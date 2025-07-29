import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  count?: number;
  isActive?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  count = 3, // Default to showing some notifications
  isActive = false 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/notifications');
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-slate-400 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
      title="View Notifications"
    >
      {/* Bell Icon */}
      <Bell 
        className={`h-5 w-5 ${isActive ? 'fill-current' : ''} ${
          isActive && count > 0 ? 'animate-pulse' : ''
        }`} 
      />
      
      {/* Notification Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
      
      {/* Pulse effect for active notifications */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-ping rounded-full bg-red-400 opacity-75"></span>
      )}
    </button>
  );
};

export default NotificationBell;
