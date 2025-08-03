import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useNotificationStats } from '../../../hooks/useNotifications';

interface NotificationBellProps {
  isActive?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  isActive = false 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  
  // Use real API data for unread count
  const { data: statsResponse } = useNotificationStats();
  const stats = statsResponse || { total: 0, unread: 0, urgent: 0, booking: 0, payment: 0, system: 0 };
  const unreadCount = stats.unread;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside the entire component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleClick}
        className="relative p-2 text-slate-400 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
        title="View Notifications"
      >
        {/* Bell Icon */}
        <Bell 
          className={`h-5 w-5 ${isActive ? 'fill-current' : ''} ${
            isActive && unreadCount > 0 ? 'animate-pulse' : ''
          }`} 
        />
        
        {/* Notification Badge - only show if there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Pulse effect for active notifications - only show if there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 animate-ping rounded-full bg-red-400 opacity-75"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      <NotificationDropdown 
        isOpen={isDropdownOpen}
        onClose={handleCloseDropdown}
        position="right"
      />
    </div>
  );
};

export default NotificationBell;
