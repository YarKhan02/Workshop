import React from 'react';
import { motion } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationItem from './NotificationItem';
import type { Notification } from '../../../types/notification';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string, selected: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  selectedIds,
  onSelect,
  onMarkAsRead,
  onDelete,
  delay = 0
}) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl overflow-hidden"
      >
        <div className="p-8 text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
          Loading notifications...
        </div>
      </motion.div>
    );
  }

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl overflow-hidden"
      >
        <div className="p-8 text-center text-gray-400">
          <BellIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No notifications found</p>
          <p className="text-sm">Check back later for new updates</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 backdrop-blur-md border border-gray-700/30 rounded-xl overflow-hidden"
    >
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isSelected={selectedIds.includes(notification.id)}
          onSelect={(selected) => onSelect(notification.id, selected)}
          onMarkAsRead={() => onMarkAsRead(notification.id)}
          onDelete={() => onDelete(notification.id)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default NotificationList;
