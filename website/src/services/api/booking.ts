import { apiClient } from './client';
import type {
  Service,
  TimeSlot,
  Booking,
  BookingCreateData,
  BookingFilters,
  Car
} from '../interfaces/booking';

// Services API
export const servicesAPI = {
  // Get all available services
  getServices: async (category?: string) => {
    const params = category ? { category } : {};
    return apiClient.get<Service[]>('/services/', params);
  },

  // Get service by ID
  getService: async (id: string) => {
    return apiClient.get<Service>(`/services/${id}/`);
  },
};

// Time Slots API
export const timeSlotsAPI = {
  // Get available time slots
  getAvailableTimeSlots: async (filters?: { date?: string; service?: string }) => {
    return apiClient.get<TimeSlot[]>('/time-slots/', filters);
  },

  // Get time slot by ID
  getTimeSlot: async (id: string) => {
    return apiClient.get<TimeSlot>(`/time-slots/${id}/`);
  },
};

// Cars API
export const carsAPI = {
  // Get user's cars
  getMyCars: async () => {
    return apiClient.get<Car[]>('/cars/');
  },

  // Add a new car
  addCar: async (carData: Omit<Car, 'id'>) => {
    return apiClient.post<Car>('/cars/', carData);
  },

  // Update car
  updateCar: async (id: string, carData: Partial<Car>) => {
    return apiClient.patch<Car>(`/cars/${id}/`, carData);
  },

  // Delete car
  deleteCar: async (id: string) => {
    return apiClient.delete(`/cars/${id}/`);
  },
};

// Bookings API
export const bookingsAPI = {
  // Create a new booking
  createBooking: async (bookingData: BookingCreateData) => {
    return apiClient.post<Booking>('/bookings/', bookingData);
  },

  // Get user's bookings
  getMyBookings: async (filters?: BookingFilters) => {
    return apiClient.get<Booking[]>('/bookings/my-bookings/', filters);
  },

  // Get booking by ID
  getBooking: async (id: string) => {
    return apiClient.get<Booking>(`/bookings/${id}/`);
  },

  // Update booking
  updateBooking: async (id: string, data: Partial<BookingCreateData>) => {
    return apiClient.patch<Booking>(`/bookings/${id}/`, data);
  },

  // Cancel booking
  cancelBooking: async (id: string, reason?: string) => {
    return apiClient.post<{ message: string }>(`/bookings/${id}/cancel/`, { reason });
  },

  // Reschedule booking
  rescheduleBooking: async (id: string, newTimeSlotId: string) => {
    return apiClient.post<Booking>(`/bookings/${id}/reschedule/`, { 
      time_slot: newTimeSlotId 
    });
  },
};

// Combined booking queries for easier use
export const bookingQueries = {
  services: {
    getAll: servicesAPI.getServices,
    getById: servicesAPI.getService,
  },
  timeSlots: {
    getAvailable: timeSlotsAPI.getAvailableTimeSlots,
    getById: timeSlotsAPI.getTimeSlot,
  },
  cars: {
    getMy: carsAPI.getMyCars,
    create: carsAPI.addCar,
    update: carsAPI.updateCar,
    delete: carsAPI.deleteCar,
  },
  bookings: {
    create: bookingsAPI.createBooking,
    getMy: bookingsAPI.getMyBookings,
    getById: bookingsAPI.getBooking,
    update: bookingsAPI.updateBooking,
    cancel: bookingsAPI.cancelBooking,
    reschedule: bookingsAPI.rescheduleBooking,
  },
};
