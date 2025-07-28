// ==================== CAR HOOKS ====================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as carApi from '../api/cars';
import type { Car } from '../types';

// Simple form data types based on existing Car interface
type CarFormData = Omit<Car, 'id'>;
type CarUpdateData = Partial<CarFormData>;

// ==================== QUERY KEYS ====================
export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...carQueryKeys.lists(), { filters }] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...carQueryKeys.details(), id] as const,
  byCustomer: (customerId: string) => [...carQueryKeys.all, 'customer', customerId] as const,
};

// ==================== FETCH HOOKS ====================

/**
 * Hook to fetch all cars
 */
export const useCars = () => {
  return useQuery({
    queryKey: carQueryKeys.lists(),
    queryFn: () => carApi.fetchCars(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single car by ID
 */
export const useCar = (carId: number | null) => {
  return useQuery({
    queryKey: carQueryKeys.detail(carId!),
    queryFn: () => carApi.fetchCarById(carId!),
    enabled: !!carId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch cars by customer ID
 */
export const useCarsByCustomer = (customerId: string | null) => {
  return useQuery({
    queryKey: carQueryKeys.byCustomer(customerId!),
    queryFn: () => carApi.fetchCarsByCustomer(customerId!),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create a new car
 */
export const useCreateCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (carData: CarFormData) => carApi.createCar(carData),
    onSuccess: (newCar) => {
      // Invalidate and refetch cars list
      queryClient.invalidateQueries({ queryKey: carQueryKeys.lists() });
      
      // Invalidate customer cars if applicable
      if (newCar.customer_id) {
        queryClient.invalidateQueries({ 
          queryKey: carQueryKeys.byCustomer(newCar.customer_id) 
        });
      }
      
      // Update customers query as well (for car count)
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      toast.success('Racing machine added to fleet successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add racing machine: ${error.message}`);
      console.error('Error creating car:', error);
    },
  });
};

/**
 * Hook to update a car
 */
export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ carId, data }: { carId: number; data: CarUpdateData }) =>
      carApi.updateCar(carId, data),
    onSuccess: (updatedCar, { carId }) => {
      // Update the specific car in cache
      queryClient.setQueryData(carQueryKeys.detail(carId), updatedCar);
      
      // Invalidate cars list
      queryClient.invalidateQueries({ queryKey: carQueryKeys.lists() });
      
      // Invalidate customer cars if applicable
      if (updatedCar.customer_id) {
        queryClient.invalidateQueries({ 
          queryKey: carQueryKeys.byCustomer(updatedCar.customer_id) 
        });
      }
      
      toast.success('Racing machine updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update racing machine: ${error.message}`);
      console.error('Error updating car:', error);
    },
  });
};

/**
 * Hook to delete a car
 */
export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (carId: string) => carApi.deleteCar(carId),
    onSuccess: (_, carId) => {
      // Remove the specific car from cache
      queryClient.removeQueries({ queryKey: carQueryKeys.detail(parseInt(carId)) });
      
      // Invalidate cars list
      queryClient.invalidateQueries({ queryKey: carQueryKeys.lists() });
      
      // Invalidate all customer cars (since we don't know which customer)
      queryClient.invalidateQueries({ queryKey: ['cars', 'customer'] });
      
      // Update customers query as well (for car count)
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      toast.success('Racing machine removed from fleet successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove racing machine: ${error.message}`);
      console.error('Error deleting car:', error);
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to search cars
 */
export const useSearchCars = (searchTerm: string) => {
  return useQuery({
    queryKey: [...carQueryKeys.lists(), 'search', searchTerm],
    queryFn: () => carApi.searchCars(searchTerm),
    enabled: searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};
