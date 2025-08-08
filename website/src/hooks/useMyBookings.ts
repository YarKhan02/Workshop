import { useState, useEffect, useCallback } from 'react';
import { MyBooking, MyBookingFilters } from '../services/interfaces/booking';
import { customerBookingsAPI } from '../services/api/customerBookings';
import { isAuthError } from '../utils/authErrorHandler';
import toast from 'react-hot-toast';

interface UseMyBookingsReturn {
  bookings: MyBooking[];
  loading: boolean;
  error: string | null;
  filters: MyBookingFilters;
  setFilters: (filters: MyBookingFilters) => void;
  refreshBookings: () => Promise<void>;
  rescheduleBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  rateBooking: (bookingId: string, rating: number) => Promise<void>;
}

export const useMyBookings = (): UseMyBookingsReturn => {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MyBookingFilters>({
    status: 'all'
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerBookingsAPI.getMyBookings(filters);
      
      if (response.data) {
        setBookings(Array.isArray(response.data) ? response.data : response.results || []);
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      
      // Check if this is an authentication error
      if (isAuthError(err)) {
        setError('Authentication failed. Please log in again.');
        // Auth error handler will automatically log out the user
      } else {
        setError(err.response?.data?.message || 'Failed to load bookings');
      }
      
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshBookings = useCallback(async () => {
    await fetchBookings();
  }, [fetchBookings]);

  const rescheduleBooking = useCallback(async (bookingId: string) => {
    try {
      const result = await customerBookingsAPI.rescheduleBooking(bookingId);
      if (result.success) {
        toast.success(result.message);
        await refreshBookings();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error('Failed to reschedule booking');
    }
  }, [refreshBookings]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const result = await customerBookingsAPI.cancelBooking(bookingId);
      if (result.success) {
        toast.success(result.message);
        await refreshBookings();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error('Failed to cancel booking');
    }
  }, [refreshBookings]);

  const rateBooking = useCallback(async (bookingId: string, rating: number = 5) => {
    try {
      const result = await customerBookingsAPI.rateBooking(bookingId, rating);
      if (result.success) {
        toast.success(result.message);
        await refreshBookings();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error rating booking:', error);
      toast.error('Failed to submit rating');
    }
  }, [refreshBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    filters,
    setFilters,
    refreshBookings,
    rescheduleBooking,
    cancelBooking,
    rateBooking
  };
};
