import { useState, useEffect, useCallback } from 'react';
import { bookingQueries } from '../services/api/booking';
import type {
  Car,
  Booking,
  BookingData,
  BookingCreateData,
  BookingFilters,
} from '../services/interfaces/booking';
import type { Service } from '../services/api/services';

export const useServices = (category?: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingQueries.services.getAll(category);
      setServices(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
};

// Hook for managing user's cars
export const useCars = (customerId?: string) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingQueries.cars.getMy(customerId);
      setCars(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const addCar = useCallback(async (carData: Omit<Car, 'id'>) => {
    try {
      setError(null);
      const response = await bookingQueries.cars.create(carData);
      if (response.data) {
        setCars(prev => [...prev, response.data!]);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add car';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateCar = useCallback(async (id: string, carData: Partial<Car>) => {
    try {
      setError(null);
      const response = await bookingQueries.cars.update(id, carData);
      if (response.data) {
        setCars(prev => prev.map(car => car.id === id ? response.data! : car));
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update car';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteCar = useCallback(async (id: string) => {
    try {
      setError(null);
      await bookingQueries.cars.delete(id);
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete car';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    addCar,
    updateCar,
    deleteCar,
    refetch: fetchCars,
  };
};

// Hook for managing bookings
export const useBookings = (filters?: BookingFilters) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingQueries.bookings.getMy(filters);
      setBookings(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createBooking = useCallback(async (bookingData: BookingCreateData) => {
    try {
      setError(null);
      const response = await bookingQueries.bookings.create(bookingData);
      if (response.data) {
        setBookings(prev => [response.data!, ...prev]);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const cancelBooking = useCallback(async (id: string, reason?: string) => {
    try {
      setError(null);
      await bookingQueries.bookings.cancel(id, reason);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const rescheduleBooking = useCallback(async (id: string, newDate: string) => {
    try {
      setError(null);
      const response = await bookingQueries.bookings.reschedule(id, newDate);
      if (response.data) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === id ? response.data! : booking
          )
        );
      }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reschedule booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    rescheduleBooking,
    refetch: fetchBookings,
  };
};

// Hook for managing the booking flow state
export const useBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: '',
    car: {
      make: '',
      model: '',
      year: '',
      license_plate: '',
      color: '',
    },
    date: '',
    customer_notes: '',
  });

  const updateBookingData = useCallback((field: keyof BookingData, value: any) => {
    setBookingData((prev: BookingData) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const resetFlow = useCallback(() => {
    setCurrentStep(1);
    setBookingData({
      service: '',
      car: {
        make: '',
        model: '',
        year: '',
        license_plate: '',
        color: '',
      },
      date: '',
      customer_notes: '',
    });
  }, []);

  return {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    previousStep,
    resetFlow,
    setCurrentStep,
  };
};
