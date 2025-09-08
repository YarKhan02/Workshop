import { apiClient } from './client';
import type {
  Booking,
  BookingCreateData,
  BookingFilters,
  Car,
  AvailableDate
} from '../interfaces/booking';
import { Service } from './services';

// Services API
export const servicesAPI = {
  // Get all available services
  getServices: async (category?: string) => {
    const params = category ? { category } : {};
    return apiClient.get<Service[]>('/services/list/', params);
  },

  // Get service by ID
  getService: async (id: string) => {
    return apiClient.get<Service>(`/services/${id}/`);
  },
};

// Cars API
export const carsAPI = {
  // Get user's cars
  getMyCars: async (customerId?: string) => {
    const params = customerId ? { customer_id: customerId } : {};
    return apiClient.get<Car[]>('/cars/by-customer/', params);
  },

  // Add a new car
  addCar: async (carData: Omit<Car, 'id'>) => {
    return apiClient.post<Car>('/cars/add-car/', carData);
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
  // Get available dates for next N days
  getAvailableDates: async (startDate?: string, days: number = 14) => {
    const params: any = { days };
    if (startDate) params.start_date = startDate;
    return apiClient.get<AvailableDate[]>('/bookings/available-dates/', params);
  },

  // Create a new booking
  createBooking: async (bookingData: BookingCreateData) => {
    return apiClient.post<Booking>('/bookings/create-customer/', bookingData);
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

  // Reschedule booking (just change date now)
  rescheduleBooking: async (id: string, newDate: string) => {
    return apiClient.post<Booking>(`/bookings/${id}/reschedule/`, { 
      date: newDate 
    });
  },
};

// Combined booking queries for easier use
export const bookingQueries = {
  services: {
    getAll: servicesAPI.getServices,
    getById: servicesAPI.getService,
  },
  dates: {
    getAvailable: bookingsAPI.getAvailableDates,
  },
  cars: {
    getMy: (customerId?: string) => carsAPI.getMyCars(customerId),
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
