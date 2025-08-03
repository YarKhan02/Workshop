import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { NotificationIcon, PriorityBadge } from '../../shared/display';
import type { Notification } from '../../../types/notification';
import { format, formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-6 hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 last:border-b-0 ${
        isSelected ? 'bg-orange-500/10' : ''
      } ${!notification.isRead ? 'bg-gradient-to-r from-orange-500/5 to-transparent' : ''}`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-1 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500/50"
        />
        
        <div className="flex-shrink-0 mt-1">
          <NotificationIcon type={notification.type} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className={`font-medium ${
              notification.isRead ? 'text-gray-300' : 'text-white'
            }`}>
              {notification.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <PriorityBadge priority={notification.priority} size="sm" />
              
              {!notification.isRead && (
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              )}
            </div>
          </div>
          
          <p className={`text-sm mb-3 ${
            notification.isRead ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{format(notification.createdAt, 'MMM dd, yyyy HH:mm')}</span>
              <span>•</span>
              <span>{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <button
                  onClick={onMarkAsRead}
                  className="p-1 rounded hover:bg-gray-600/50 transition-colors"
                  title="Mark as read"
                >
                  <CheckIcon className="h-4 w-4 text-gray-400 hover:text-green-400" />
                </button>
              )}
              
              <button
                onClick={onDelete}
                className="p-1 rounded hover:bg-red-500/20 transition-colors"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
