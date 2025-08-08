import { apiClient } from '../api';
import { MyBooking, MyBookingFilters, BookingActionResponse } from '../interfaces/booking';

export const customerBookingsAPI = {
  async getMyBookings(filters?: MyBookingFilters) {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.dateFrom) {
      params.append('date_from', filters.dateFrom);
    }
    if (filters?.dateTo) {
      params.append('date_to', filters.dateTo);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/customer/my-bookings/?${queryString}` : '/customer/my-bookings/';

    return apiClient.get<MyBooking[]>(url);
  },

  async getBookingDetails(bookingId: string) {
    return apiClient.get<MyBooking>(`/customer/my-bookings/${bookingId}/`);
  },

  async rescheduleBooking(bookingId: string, newDate?: string, newTime?: string): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/customer/my-bookings/${bookingId}/reschedule/`, {
        new_date: newDate,
        new_time: newTime
      });
      return {
        success: true,
        message: 'Reschedule request submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reschedule booking'
      };
    }
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/customer/my-bookings/${bookingId}/cancel/`, {
        cancellation_reason: reason
      });
      return {
        success: true,
        message: 'Booking cancelled successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel booking'
      };
    }
  },

  async rateBooking(bookingId: string, rating: number, review?: string): Promise<BookingActionResponse> {
    try {
      const response = await apiClient.post(`/customer/my-bookings/${bookingId}/rate/`, {
        rating,
        review
      });
      return {
        success: true,
        message: 'Rating submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit rating'
      };
    }
  }
};
