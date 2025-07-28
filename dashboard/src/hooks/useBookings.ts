// ==================== BOOKING HOOKS ====================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingQueries, bookingAPI, type BookingFilters, type BookingCreateData } from '../api/booking';

// ==================== HOOKS ====================

/**
 * Hook to fetch bookings with filters
 */
export const useBookings = (filters: BookingFilters) => {
  return useQuery(bookingQueries.list(filters));
};

/**
 * Hook to fetch booking statistics
 */
export const useBookingStats = () => {
  return useQuery(bookingQueries.stats());
};

/**
 * Hook to fetch a single booking by ID
 */
export const useBooking = (bookingId: string | null) => {
  return useQuery({
    ...bookingQueries.detail(bookingId!),
    enabled: !!bookingId,
  });
};

/**
 * Hook to create a new booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingData: BookingCreateData) => bookingAPI.createBooking(bookingData),
    onSuccess: () => {
      // Invalidate and refetch bookings list and stats
      queryClient.invalidateQueries({ queryKey: bookingQueries.keys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueries.keys.stats() });
      
      toast.success('Pit stop scheduled successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to schedule pit stop';
      toast.error(errorMessage);
      console.error('Error creating booking:', error);
    },
  });
};

/**
 * Hook to update an existing booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: Partial<BookingCreateData> }) => 
      bookingAPI.updateBooking(bookingId, data),
    onSuccess: (updatedBooking, { bookingId }) => {
      // Update the specific booking in cache
      queryClient.setQueryData(bookingQueries.keys.detail(bookingId), updatedBooking);
      
      // Invalidate bookings list and stats
      queryClient.invalidateQueries({ queryKey: bookingQueries.keys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueries.keys.stats() });
      
      toast.success('Appointment updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update appointment';
      toast.error(errorMessage);
      console.error('Error updating booking:', error);
    },
  });
};

/**
 * Hook to cancel a booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) => 
      bookingAPI.cancelBooking(bookingId, reason),
    onSuccess: (_, { bookingId }) => {
      // Remove the booking from cache
      queryClient.removeQueries({ queryKey: bookingQueries.keys.detail(bookingId) });
      
      // Invalidate bookings list and stats
      queryClient.invalidateQueries({ queryKey: bookingQueries.keys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueries.keys.stats() });
      
      toast.success('Appointment cancelled successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to cancel appointment';
      toast.error(errorMessage);
      console.error('Error cancelling booking:', error);
    },
  });
};
