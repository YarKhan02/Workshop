// API Configuration and Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
  results?: T;
  count?: number;
  next?: string;
  previous?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
}

interface BookingData {
  service: string;
  car: {
    make: string;
    model: string;
    year: string;
    license_plate: string;
    color?: string;
  };
  time_slot: {
    id: string;
    date: string;
    time: string;
  };
  customer_notes?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
  features: string[];
  is_active: boolean;
}

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_concurrent_bookings: number;
}

interface Booking {
  id: string;
  service: Service;
  car: any;
  time_slot: TimeSlot;
  customer_notes?: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'API request failed');
      }

      return {
        data: data.results || data,
        status: response.status,
        message: data.message,
        count: data.count,
        next: data.next,
        previous: data.previous
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ access: string; refresh: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.request<{ access: string; refresh: string; user: any }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request<{}>('/auth/logout/', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request<any>('/auth/profile/');
  }

  async updateProfile(data: any) {
    return this.request<any>('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Services
  async getServices() {
    return this.request<Service[]>('/services');
  }

  async getService(id: string) {
    return this.request<Service>(`/services/${id}`);
  }

  // Time Slots
  async getAvailableTimeSlots(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<TimeSlot[]>(`/time-slots${query}`);
  }

  // Bookings
  async createBooking(bookingData: BookingData) {
    return this.request<{ id: string; booking: any }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings() {
    return this.request<any[]>('/bookings/my-bookings');
  }

  async getBooking(id: string) {
    return this.request<any>(`/bookings/${id}`);
  }

  async updateBooking(id: string, data: Partial<BookingData>) {
    return this.request<any>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: string, reason?: string) {
    return this.request<any>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async rescheduleBooking(id: string, newTimeSlotId: string) {
    return this.request<any>(`/bookings/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ time_slot: newTimeSlotId }),
    });
  }

  // Cars
  async getMyCars() {
    return this.request<any[]>('/cars');
  }

  async addCar(carData: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    color?: string;
  }) {
    return this.request<any>('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id: string, carData: any) {
    return this.request<any>(`/cars/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id: string) {
    return this.request<any>(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoices
  async getMyInvoices() {
    return this.request<any[]>('/invoices');
  }

  async getInvoice(id: string) {
    return this.request<any>(`/invoices/${id}`);
  }

  async downloadInvoice(id: string) {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/invoices/${id}/download`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
    
    return response.blob();
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  ApiResponse,
  BookingData,
  Service,
  TimeSlot,
};

// Helper function for handling API errors
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Helper function for formatting currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function for formatting dates
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function for formatting time
export const formatTime = (timeString: string) => {
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
