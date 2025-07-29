import type { Notification, NotificationFilter } from '../types/notification';

// Mock API service - replace with real API calls later
class NotificationAPI {
  private static instance: NotificationAPI;
  private notifications: Notification[] = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): NotificationAPI {
    if (!NotificationAPI.instance) {
      NotificationAPI.instance = new NotificationAPI();
    }
    return NotificationAPI.instance;
  }

  private initializeMockData() {
    // Initialize with some mock notifications for demo
    this.notifications = [
      {
        id: '1',
        title: 'New Booking Request',
        message: 'John Smith has requested a full detail service for his BMW X5',
        type: 'booking',
        isRead: false,
        priority: 'high',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        actionUrl: '/bookings',
        actionLabel: 'View Booking',
        metadata: {
          customerId: 'customer-1',
          bookingId: 'booking-1'
        }
      },
      {
        id: '2',
        title: 'Low Inventory Alert',
        message: 'Car wax supplies are running low (2 units remaining)',
        type: 'warning',
        isRead: false,
        priority: 'medium',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actionUrl: '/inventory',
        actionLabel: 'Check Inventory',
        metadata: {
          productId: 'product-1'
        }
      },
      {
        id: '3',
        title: 'Daily Report Ready',
        message: 'Your daily performance report for today is now available',
        type: 'info',
        isRead: true,
        priority: 'low',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        actionUrl: '/analytics',
        actionLabel: 'View Report'
      },
      {
        id: '4',
        title: 'System Maintenance',
        message: 'Scheduled system maintenance will occur tonight at 2:00 AM',
        type: 'system',
        isRead: false,
        priority: 'urgent',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        metadata: {
          maintenanceWindow: '2:00 AM - 4:00 AM'
        }
      },
      {
        id: '5',
        title: 'Payment Received',
        message: 'Payment of $150 received from Sarah Johnson',
        type: 'success',
        isRead: true,
        priority: 'medium',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
        actionUrl: '/billing',
        actionLabel: 'View Payment',
        metadata: {
          customerId: 'customer-2',
          amount: 150
        }
      }
    ];
  }

  async fetchNotifications(): Promise<Notification[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.notifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAsRead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      notification.updatedAt = new Date();
    }
  }

  async markAllAsRead(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.updatedAt = new Date();
      }
    });
  }

  async deleteNotification(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  async addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  filterNotifications(notifications: Notification[], filter: NotificationFilter): Notification[] {
    return notifications.filter(notification => {
      if (filter.type && notification.type !== filter.type) return false;
      if (filter.isRead !== undefined && notification.isRead !== filter.isRead) return false;
      if (filter.priority && notification.priority !== filter.priority) return false;
      if (filter.dateFrom && notification.createdAt < filter.dateFrom) return false;
      if (filter.dateTo && notification.createdAt > filter.dateTo) return false;
      return true;
    });
  }

  // Helper method to simulate real-time notifications
  simulateNewNotification(): Notification {
    const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'urgent'];
    
    const mockMessages = [
      { title: 'New customer registered', message: 'A new customer has signed up for services', type: 'info' as const },
      { title: 'Service completed', message: 'Full detail service completed for vehicle #123', type: 'success' as const },
      { title: 'Appointment reminder', message: 'You have an appointment in 30 minutes', type: 'warning' as const },
      { title: 'Equipment malfunction', message: 'Pressure washer #2 needs maintenance', type: 'error' as const },
      { title: 'New booking request', message: 'Customer wants to book premium wash service', type: 'booking' as const },
      { title: 'System update available', message: 'A new system update is ready to install', type: 'system' as const }
    ];

    const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

    return {
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: randomMessage.title,
      message: randomMessage.message,
      type: randomMessage.type,
      isRead: false,
      priority: randomPriority,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

export const notificationAPI = NotificationAPI.getInstance();
