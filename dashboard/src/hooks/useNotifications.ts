// src/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getNotificationStats,
  markNotificationsAsRead,
  deleteNotification,
  createNotification,
  type NotificationFilters
} from '../api/notifications';

// Hook to fetch notifications
export const useNotifications = (filters: NotificationFilters = {}) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => getNotifications(filters),
    staleTime: 30000, // 30 seconds
  });
};

// Hook to fetch notification statistics
export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notification-stats'],
    queryFn: getNotificationStats,
    staleTime: 60000, // 1 minute
  });
};

// Hook to mark notifications as read
export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      // Invalidate and refetch notifications and stats
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};

// Hook to delete a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate and refetch notifications and stats
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};

// Hook to create a notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      // Invalidate and refetch notifications and stats
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });
};
