// Import new API structure
import { apiClient } from './api/client';
import { bookingQueries, servicesAPI as bookingServicesAPI, carsAPI, bookingsAPI } from './api/booking';
import { servicesAPI } from './api/services';

// Re-export from new API structure
export { apiClient };
export { bookingQueries, carsAPI, bookingsAPI };
export { servicesAPI };
export { bookingServicesAPI };

// Re-export types
export type {
  Car, 
  Booking, 
  BookingData, 
  BookingCreateData,
  BookingFilters 
} from './interfaces/booking';

// Re-export utility functions
export { 
  formatCurrency, 
  formatDate, 
  formatTime, 
  handleApiError,
  validateCarData,
  getBookingStatusColor,
  getBookingStatusBgColor
} from '../utils/bookingUtils';

// Legacy class wrapper for backward compatibility
class ApiService {
  // Authentication
  async login(email: string, password: string) {
    return apiClient.post<{ access: string; refresh: string; user: any }>('/auth/login/', {
      email,
      password,
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return apiClient.post<{ access: string; refresh: string; user: any }>('/auth/register/', userData);
  }

  async logout() {
    return apiClient.post<{}>('/auth/logout/');
  }

  async getProfile() {
    return apiClient.get<any>('/auth/profile/');
  }

  async updateProfile(data: any) {
    return apiClient.patch<any>('/auth/profile/', data);
  }

  // Services
  async getServices() {
    return servicesAPI.getServices();
  }

  async getService(id: string) {
    return servicesAPI.getService(id);
  }

  // Bookings
  async createBooking(bookingData: any) {
    return bookingsAPI.createBooking(bookingData);
  }

  async getMyBookings() {
    return bookingsAPI.getMyBookings();
  }

  async getBooking(id: string) {
    return bookingsAPI.getBooking(id);
  }

  async updateBooking(id: string, data: any) {
    return bookingsAPI.updateBooking(id, data);
  }

  async cancelBooking(id: string, reason?: string) {
    return bookingsAPI.cancelBooking(id, reason);
  }

  async rescheduleBooking(id: string, newDate: string) {
    return bookingsAPI.rescheduleBooking(id, newDate);
  }

  // Cars
  async getMyCars() {
    return carsAPI.getMyCars();
  }

  async addCar(carData: any) {
    return carsAPI.addCar(carData);
  }

  async updateCar(id: string, carData: any) {
    return carsAPI.updateCar(id, carData);
  }

  async deleteCar(id: string) {
    return carsAPI.deleteCar(id);
  }

  // Invoices (not yet implemented in new structure)
  async getMyInvoices() {
    return apiClient.get<any[]>('/invoices/');
  }

  async getInvoice(id: string) {
    return apiClient.get<any>(`/invoices/${id}/`);
  }

  async downloadInvoice(id: string) {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/invoices/${id}/download/`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
    
    return response.blob();
  }

  // Notifications (not yet implemented in new structure)
  async getNotifications() {
    return apiClient.get<any[]>('/notifications/');
  }

  async markNotificationAsRead(id: string) {
    return apiClient.post<any>(`/notifications/${id}/read/`);
  }
}

// Create and export a singleton instance for backward compatibility
export const apiService = new ApiService();