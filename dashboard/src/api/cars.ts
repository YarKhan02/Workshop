import { apiClient } from './client';
import type { Car } from '../types';

type CarFormData = Omit<Car, 'id'>;
type CarUpdateData = Partial<CarFormData>;


/**
 * Fetch all cars with customer information
 */
export const fetchCars = async (): Promise<Car[]> => {
  const response = await apiClient.get('/cars/details/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch a single car by ID
 */
export const fetchCarById = async (carId: number): Promise<Car> => {
  const response = await apiClient.get(`/cars/${carId}/`);
  return response.data;
};

/**
 * Create a new car
 */
export const createCar = async (carData: CarFormData): Promise<Car> => {
  const response = await apiClient.post('/cars/', carData);
  return response.data;
};

/**
 * Update an existing car
 */
export const updateCar = async (
  carId: number, 
  carData: CarUpdateData
): Promise<Car> => {
  const response = await apiClient.patch(`/cars/${carId}/`, carData);
  return response.data;
};

/**
 * Delete a car
 */
export const deleteCar = async (carId: string): Promise<void> => {
  await apiClient.delete(`/cars/${carId}/`);
};

/**
 * Search cars by various criteria
 */
export const searchCars = async (searchTerm: string): Promise<Car[]> => {
  const response = await apiClient.get(`/cars/search/?q=${encodeURIComponent(searchTerm)}`);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Get cars by customer ID
 */
export const fetchCarsByCustomer = async (customerId: string): Promise<Car[]> => {
  try {
    // Use the dedicated customer car endpoint
    const response = await apiClient.get(`/cars/by-customer/?customer_id=${customerId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch cars for customer:', customerId, error);
    return [];
  }
};

// Car API object (similar to customerAPI pattern)
export const carAPI = {
  getCarDetails: fetchCars,
  getCarById: fetchCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
  getCarsByCustomer: fetchCarsByCustomer,
};

// Car query keys for React Query (similar to customerQueries pattern)
export const carQueries = {
  keys: {
    all: ['cars'] as const,
    lists: () => [...carQueries.keys.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...carQueries.keys.lists(), filters] as const,
    details: () => [...carQueries.keys.all, 'details'] as const,
    detail: (id: number) => [...carQueries.keys.details(), id] as const,
    byCustomer: (customerId: string) => [...carQueries.keys.all, 'customer', customerId] as const,
  },

  // Query functions for use with React Query
  list: () => ({
    queryKey: carQueries.keys.details(),
    queryFn: () => carAPI.getCarDetails(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  detail: (carId: number) => ({
    queryKey: carQueries.keys.detail(carId),
    queryFn: () => carAPI.getCarById(carId),
    enabled: !!carId,
  }),

  byCustomer: (customerId: string) => ({
    queryKey: carQueries.keys.byCustomer(customerId),
    queryFn: () => carAPI.getCarsByCustomer(customerId),
    enabled: !!customerId,
  }),
};

export default carAPI;
