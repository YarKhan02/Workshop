import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Notification, NotificationStats, NotificationFilter, NotificationContextType } from '../types/notification';
import { notificationAPI } from '../api/notifications';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from notifications
  const stats: NotificationStats = React.useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    
    const byType = {
      info: notifications.filter(n => n.type === 'info').length,
      success: notifications.filter(n => n.type === 'success').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      error: notifications.filter(n => n.type === 'error').length,
      booking: notifications.filter(n => n.type === 'booking').length,
      system: notifications.filter(n => n.type === 'system').length,
    };

    const byPriority = {
      low: notifications.filter(n => n.priority === 'low').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      high: notifications.filter(n => n.priority === 'high').length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
    };

    return { total, unread, byType, byPriority };
  }, [notifications]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationAPI.fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true, updatedAt: new Date() }
            : notification
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          isRead: true, 
          updatedAt: new Date() 
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }, []);

  // Add new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNotification = await notificationAPI.addNotification(notification);
      setNotifications(prev => [newNotification, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add notification');
    }
  }, []);

  // Filter notifications
  const filterNotifications = useCallback((filter: NotificationFilter): Notification[] => {
    return notificationAPI.filterNotifications(notifications, filter);
  }, [notifications]);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Simulate real-time notifications (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of new notification every 30 seconds
      if (Math.random() < 0.1) {
        const newNotification = notificationAPI.simulateNewNotification();
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    stats,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    filterNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
