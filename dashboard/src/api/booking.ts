// dashboard/src/api/booking.ts
import { apiClient } from './client';

export interface BookingFilters {
  status?: string;
  customer?: string;
  service?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface BookingCreateData {
  customer: string;
  car: string;
  service?: string;
  service_code?: string;
  time_slot?: string;
  scheduled_date?: string; // For backward compatibility
  scheduled_time?: string; // For backward compatibility
  estimated_duration_minutes?: number;
  status?: string;
  customer_notes?: string;
  quoted_price?: number;
  discount_amount?: number;
  assigned_staff?: string;
}

export interface BookingUpdateData {
  time_slot?: string;
  scheduled_date?: string; // For backward compatibility
  scheduled_time?: string; // For backward compatibility
  estimated_duration_minutes?: number;
  status?: string;
  customer_notes?: string;
  staff_notes?: string;
  quoted_price?: number;
  discount_amount?: number;
  assigned_staff?: string;
}

export interface BookingStatusUpdate {
  status: string;
  notes?: string;
}

// Service API
export const serviceAPI = {
  // Get list of services
  getServices: async (category?: string) => {
    const response = await apiClient.get('/services/list/', {
      params: category ? { category } : {}
    });
    return response.data;
  },

  // Get detailed service information
  getServiceDetails: async () => {
    const response = await apiClient.get('/services/details/');
    return response.data;
  },

  // Get single service detail
  getServiceDetail: async (serviceId: string) => {
    const response = await apiClient.get(`/services/${serviceId}/detail/`);
    return response.data;
  }
};

// Booking API
export const bookingAPI = {
  // Get list of bookings with filters
  getBookings: async (filters: BookingFilters = {}) => {
    const response = await apiClient.get('/bookings/list/', {
      params: filters
    });
    return response.data;
  },

  // Get single booking detail
  getBookingDetail: async (bookingId: string) => {
    const response = await apiClient.get(`/bookings/${bookingId}/detail/`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData: BookingCreateData) => {
    const response = await apiClient.post('/bookings/create/', bookingData);
    return response.data;
  },

  // Update existing booking
  updateBooking: async (bookingId: string, bookingData: BookingUpdateData) => {
    const response = await apiClient.put(`/bookings/${bookingId}/update/`, bookingData);
    return response.data;
  },

  // Update booking status only
  updateBookingStatus: async (bookingId: string, statusData: BookingStatusUpdate) => {
    const response = await apiClient.patch(`/bookings/${bookingId}/status/`, statusData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, reason?: string) => {
    const response = await apiClient.delete(`/bookings/${bookingId}/cancel/`, {
      data: { reason }
    });
    return response.data;
  },

  // Get booking statistics
  getBookingStats: async () => {
    const response = await apiClient.get('/bookings/stats/');
    return response.data;
  },

  // Get customer cars (for booking creation)
  getCustomerCars: async (customerId: string) => {
    const response = await apiClient.get('/bookings/customer-cars/', {
      params: { customer_id: customerId }
    });
    return response.data;
  },

  // Get available time slots for a specific date
  getAvailableTimeSlots: async (date: string, excludeBookingId?: string) => {
    const params: any = { date };
    if (excludeBookingId) {
      params.exclude_booking = excludeBookingId;
    }
    const response = await apiClient.get('/bookings/available-slots/', {
      params
    });
    return response.data;
  }
};

// Booking hooks for React Query integration
export const bookingQueries = {
  // Query keys
  keys: {
    all: ['bookings'] as const,
    lists: () => [...bookingQueries.keys.all, 'list'] as const,
    list: (filters: BookingFilters) => [...bookingQueries.keys.lists(), filters] as const,
    details: () => [...bookingQueries.keys.all, 'detail'] as const,
    detail: (id: string) => [...bookingQueries.keys.details(), id] as const,
    stats: () => [...bookingQueries.keys.all, 'stats'] as const,
    services: () => ['services'] as const,
    servicesList: () => [...bookingQueries.keys.services(), 'list'] as const,
    customerCars: (customerId: string) => ['customer-cars', customerId] as const,
    availableTimeSlots: (date: string) => ['available-time-slots', date] as const,
  },

  // Query functions for use with React Query
  list: (filters: BookingFilters = {}) => ({
    queryKey: bookingQueries.keys.list(filters),
    queryFn: () => bookingAPI.getBookings(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  detail: (bookingId: string) => ({
    queryKey: bookingQueries.keys.detail(bookingId),
    queryFn: () => bookingAPI.getBookingDetail(bookingId),
    enabled: !!bookingId,
  }),

  stats: () => ({
    queryKey: bookingQueries.keys.stats(),
    queryFn: () => bookingAPI.getBookingStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  }),

  services: (category?: string) => ({
    queryKey: [...bookingQueries.keys.servicesList(), category],
    queryFn: () => serviceAPI.getServices(category),
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  customerCars: (customerId: string) => ({
    queryKey: bookingQueries.keys.customerCars(customerId),
    queryFn: () => bookingAPI.getCustomerCars(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  availableTimeSlots: (date: string, excludeBookingId?: string) => ({
    queryKey: bookingQueries.keys.availableTimeSlots(date),
    queryFn: () => bookingAPI.getAvailableTimeSlots(date, excludeBookingId),
    enabled: !!date,
    staleTime: 1000 * 60 * 2, // 2 minutes
  }),
};

export default bookingAPI;
