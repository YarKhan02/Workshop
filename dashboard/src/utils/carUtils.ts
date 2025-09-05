// ==================== CAR UTILITIES ====================

import type { Car } from '../types';

// Simple types based on existing Car interface
interface CarFilters {
  searchTerm?: string;
  customerId?: string;
  make?: string;
  year?: number;
}

interface CarStatsData {
  totalCars: number;
  filteredCars: number;
  uniqueOwners: number;
  averageYear: number;
}

/**
 * Filter cars based on search criteria
 */
export const filterCars = (cars: Car[], filters: CarFilters): Car[] => {
  let filtered = [...cars];

  // Search term filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(car =>
      car.make.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.license_plate.toLowerCase().includes(searchLower) ||
      car.color.toLowerCase().includes(searchLower) ||
      `${car.year}`.includes(searchLower)
    );
  }

  // Customer ID filter
  if (filters.customerId) {
    filtered = filtered.filter(car => car.customer === filters.customerId);
  }

  // Make filter
  if (filters.make) {
    filtered = filtered.filter(car => 
      car.make.toLowerCase() === filters.make!.toLowerCase()
    );
  }

  // Year filter
  if (filters.year) {
    filtered = filtered.filter(car => car.year === filters.year);
  }

  return filtered;
};

/**
 * Calculate car statistics
 */
export const calculateCarStats = (cars: Car[], filteredCars: Car[]): CarStatsData => {
  const uniqueOwners = new Set(cars.map(car => car.customer)).size;
  const averageYear = cars.length > 0 
    ? Math.round(cars.reduce((sum, car) => sum + car.year, 0) / cars.length)
    : 0;

  return {
    totalCars: cars.length,
    filteredCars: filteredCars.length,
    uniqueOwners,
    averageYear,
  };
};

/**
 * Get unique makes from cars array
 */
export const getUniqueMakes = (cars: Car[]): string[] => {
  const makes = cars.map(car => car.make);
  return Array.from(new Set(makes)).sort();
};

/**
 * Get unique years from cars array
 */
export const getUniqueYears = (cars: Car[]): number[] => {
  const years = cars.map(car => car.year);
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

/**
 * Get unique colors from cars array
 */
export const getUniqueColors = (cars: Car[]): string[] => {
  const colors = cars.map(car => car.color);
  return Array.from(new Set(colors)).sort();
};

/**
 * Format car display name
 */
export const formatCarDisplayName = (car: Car): string => {
  return `${car.year} ${car.make} ${car.model}`;
};

/**
 * Format license plate for display
 */
export const formatLicensePlate = (licensePlate: string): string => {
  return licensePlate.toUpperCase();
};

/**
 * Format VIN for display (show last 8 characters)
 */
export const formatVinDisplay = (vin: string): string => {
  return vin.length > 8 ? `...${vin.slice(-8)}` : vin;
};

/**
 * Validate car form data
 */
export const validateCarData = (carData: Partial<Car>): string[] => {
  const errors: string[] = [];

  if (!carData.make?.trim()) {
    errors.push('Make is required');
  }

  if (!carData.model?.trim()) {
    errors.push('Model is required');
  }

  if (!carData.year || carData.year < 1900 || carData.year > new Date().getFullYear() + 1) {
    errors.push('Valid year is required');
  }

  if (!carData.license_plate?.trim()) {
    errors.push('License plate is required');
  }

  if (!carData.color?.trim()) {
    errors.push('Color is required');
  }

  if (!carData.customer) {
    errors.push('Customer is required');
  }

  return errors;
};
