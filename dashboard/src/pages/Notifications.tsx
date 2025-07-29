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

// Mock data for now since useNotifications hook might not be implemented
const mockStats = {
  total: 15,
  unread: 3,
  urgent: 1,
  booking: 2
};

const mockNotifications = [
  {
    id: '1',
    title: 'New Booking Request',
    message: 'John Doe has requested a service booking for tomorrow.',
    type: 'booking',
    priority: 'normal',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of $150 received for Invoice #INV-001.',
    type: 'payment',
    priority: 'normal',
    isRead: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Urgent: Equipment Maintenance',
    message: 'Workshop equipment requires immediate attention.',
    type: 'system',
    priority: 'urgent',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

const Notifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = mockNotifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete notification:', id);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  // Prepare stats data
  const statsData = [
    {
      title: "Total Notifications",
      value: mockStats.total,
      icon: Bell,
      color: "blue" as const,
    },
    {
      title: "Unread",
      value: mockStats.unread,
      icon: Bell,
      color: "orange" as const,
      change: { value: "+2", type: "increase" as const },
    },
    {
      title: "Urgent",
      value: mockStats.urgent,
      icon: AlertTriangle,
      color: "red" as const,
    },
    {
      title: "Bookings",
      value: mockStats.booking,
      icon: Calendar,
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
      <StatsGrid stats={statsData} />

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
          
          {filteredNotifications.length === 0 ? (
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
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete notification"
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
