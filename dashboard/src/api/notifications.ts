// src/api/notifications.ts
import { apiClient } from './client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  notificationType: 'booking' | 'payment' | 'system' | 'reminder' | 'alert';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  bookingId?: string;
  invoiceId?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
  booking: number;
  payment: number;
  system: number;
}

export interface NotificationFilters {
  search?: string;
  type?: string;
  priority?: string;
  is_read?: string;
  page?: number;
  limit?: number;
}

export interface NotificationResponse {
  results: Notification[];
  count?: number;
  next?: string;
  previous?: string;
}

export interface NotificationStatsResponse {
  total: number;
  unread: number;
  urgent: number;
  booking: number;
  payment: number;
  system: number;
}

// Get notifications with optional filters
export const getNotifications = async (filters: NotificationFilters = {}): Promise<NotificationResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await apiClient.get(`/notifications/list/?${params.toString()}`);
  return response.data;
};

// Get notification statistics
export const getNotificationStats = async (): Promise<NotificationStatsResponse> => {
  const response = await apiClient.get('/notifications/stats/');
  return response.data;
};

// Mark notifications as read
export const markNotificationsAsRead = async (notificationIds?: string[]): Promise<{ message: string; updated_count: number }> => {
  const response = await apiClient.post('/notifications/mark-read/', {
    notification_ids: notificationIds || []
  });
  return response.data;
};

// Delete a notification
export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/notifications/${id}/delete/`);
  return response.data;
};

// Create a notification (for admin use)
export const createNotification = async (notification: Partial<Notification>): Promise<{ data: Notification; message: string }> => {
  const response = await apiClient.post('/notifications/create/', notification);
  return response.data;
};
