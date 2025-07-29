export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'system';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    userId?: string;
    bookingId?: string;
    customerId?: string;
    carId?: string;
    [key: string]: any;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
    booking: number;
    system: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface NotificationFilter {
  type?: Notification['type'];
  isRead?: boolean;
  priority?: Notification['priority'];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  stats: NotificationStats;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  filterNotifications: (filter: NotificationFilter) => Notification[];
}
