import React, { useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  Calendar
} from 'lucide-react';

// Common Components
import { PageHeader, StatsGrid, SearchBar } from '../components/common';

// Hooks
import {
  useNotifications,
  useNotificationStats,
  useMarkNotificationsAsRead,
  useDeleteNotification
} from '../hooks/useNotifications';

// Types
import type { NotificationFilters } from '../api/notifications';

const Notifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters] = useState<NotificationFilters>({
    search: '',
    page: 1,
    limit: 20
  });

  // API hooks
  const { data: notificationsResponse, isLoading: loadingNotifications } = useNotifications(filters);
  const { data: statsResponse } = useNotificationStats();
  const markAsReadMutation = useMarkNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Extract data from responses
  const notifications = notificationsResponse?.results || [];
  const stats = statsResponse || { total: 0, unread: 0, urgent: 0, booking: 0, payment: 0, system: 0 };

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Prepare stats data
  const statsData = [
    {
      label: "Total Notifications",
      value: stats.total,
      icon: <Bell className="h-8 w-8" />,
      color: "blue" as const,
    },
    {
      label: "Unread",
      value: stats.unread,
      icon: <Bell className="h-8 w-8" />,
      color: "orange" as const,
      change: stats.unread > 0 ? { value: `+${stats.unread}`, type: "increase" as const } : undefined,
    },
    {
      label: "Urgent",
      value: stats.urgent,
      icon: <AlertTriangle className="h-8 w-8" />,
      color: "red" as const,
    },
    {
      label: "Bookings",
      value: stats.booking,
      icon: <Calendar className="h-8 w-8" />,
      color: "green" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Notifications"
        subtitle="Manage your system notifications and alerts"
        actionButton={{
          label: 'Mark All Read',
          icon: Check,
          onClick: handleMarkAllAsRead,
          variant: 'secondary',
        }}
      />

      {/* Stats */}
      <StatsGrid stats={statsData} columns={4} />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search notifications..."
      />

      {/* Notifications List */}
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Notifications</h3>
          
          {loadingNotifications ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.isRead
                      ? 'bg-gray-800/30 border-gray-600/30'
                      : 'bg-blue-900/20 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-white">{notification.title}</h4>
                        {notification.priority === 'urgent' && (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Mark as read"
                          disabled={markAsReadMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete notification"
                        disabled={deleteNotificationMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
