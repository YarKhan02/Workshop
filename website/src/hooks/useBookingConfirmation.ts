import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingQueries } from '../services/api/booking';
import toast from 'react-hot-toast';
import type { Booking } from '../services/interfaces/booking';

export const useBookingConfirmation = (bookingId: string | null) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      navigate('/book');
      return;
    }

    fetchBooking(bookingId);
  }, [bookingId, navigate]);

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingQueries.bookings.getById(id);
      setBooking(response.data || null);
    } catch (err) {
      const errorMessage = 'Failed to load booking details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshBooking = () => {
    if (bookingId) {
      fetchBooking(bookingId);
    }
  };

  return {
    booking,
    loading,
    error,
    refreshBooking,
  };
};

export default useBookingConfirmation;
