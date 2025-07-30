import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  Calendar,
  DollarSign,
  X,
  Eye
} from 'lucide-react';

// Hooks
import {
  useNotifications,
  useMarkNotificationsAsRead,
  useDeleteNotification
} from '../../../hooks/useNotifications';

// Types
import type { NotificationFilters } from '../../../api/notifications';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isOpen, 
  onClose, 
  position = 'right'
}) => {
  const filters: NotificationFilters = {
    page: 1,
    limit: 10 // Show only recent 10 in dropdown
  };

  // API hooks
  const { data: notificationsResponse, isLoading } = useNotifications(filters);
  const markAsReadMutation = useMarkNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Extract data from responses
  const notifications = notificationsResponse?.results || [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync([id]);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAsReadMutation.mutateAsync([]);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_created':
      case 'booking_updated':
      case 'booking_cancelled':
        return <Calendar className="h-4 w-4 text-blue-400" />;
      case 'invoice_created':
      case 'invoice_due':
      case 'payment_received':
        return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'system':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'service':
        return <Check className="h-4 w-4 text-purple-400" />;
      case 'customer':
        return <Check className="h-4 w-4 text-blue-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute top-full mt-2 w-96 max-h-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 notification-dropdown ${
        position === 'right' ? 'left-full ml-2' : 'right-full mr-2'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-300" />
          <span className="font-medium text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              title="Mark all as read"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600/50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-gray-400 text-sm text-center">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Bell className="h-12 w-12 text-gray-500 mb-3" />
            <p className="text-gray-400 text-sm text-center">No notifications</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.slice(0, 8).map((notification) => (
              <div
                key={notification.id}
                className={`group relative p-3 rounded-lg mb-2 transition-all duration-200 hover:bg-gray-700/30 ${
                  !notification.isRead 
                    ? 'bg-blue-900/20 border-l-2 border-blue-400' 
                    : 'bg-gray-800/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notificationType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white text-sm truncate">
                          {notification.title}
                        </h4>
                        {notification.priority === 'urgent' && (
                          <AlertTriangle className="h-3 w-3 text-red-400 flex-shrink-0" />
                        )}
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-xs line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {formatTime(notification.createdAt)}
                      </span>
                      
                      {/* Action buttons - only show on hover */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors rounded"
                            title="Mark as read"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length > 8 && (
              <div className="text-center py-3 border-t border-gray-700/50 mt-2">
                <Link 
                  to="/notifications"
                  onClick={onClose}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View all notifications ({notifications.length})
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
