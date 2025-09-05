import { apiClient } from './client';

// Analytics Data Types
export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

export interface DailyBookingsData {
  date: string;
  count: number;
}

export interface TopServicesData {
  service: string;
  count: number;
}

export interface CarTypesData {
  type: string;
  count: number;
}

export interface YearlyCarData {
  year: number;
  count: number;
}

export interface ProfitableServicesData {
  service: string;
  revenue: number;
}

export interface PopularServicesData {
  service: string;
  count: number;
}

export interface TopSparePartsData {
  part: string;
  count: number;
}

export interface AnalyticsMetrics {
  monthlyRevenue?: number;
  totalBookings?: number;
  activeVehicles?: number;
  servicesCompleted?: number;
  revenueChange?: number;
  bookingsChange?: number;
  vehiclesChange?: number;
  servicesChange?: number;
  totalSales?: number;
  productsUsedPrices?: number;
  salesRevenue?: number;
  totalRevenue?: number;
}

/**
 * Fetch monthly revenue analytics
 */
export const fetchMonthlyRevenue = async (): Promise<MonthlyRevenueData[]> => {
  const response = await apiClient.get('/analytics/revenue/monthly/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch daily bookings analytics
 */
export const fetchDailyBookings = async (): Promise<DailyBookingsData[]> => {
  const response = await apiClient.get('/analytics/bookings/daily/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch top services analytics
 */
export const fetchTopServices = async (): Promise<TopServicesData[]> => {
  const response = await apiClient.get('/analytics/services/top/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch car types analytics
 */
export const fetchCarTypes = async (): Promise<CarTypesData[]> => {
  const response = await apiClient.get('/analytics/cars/types/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch yearly car analytics
 */
export const fetchYearlyCars = async (): Promise<YearlyCarData[]> => {
  const response = await apiClient.get('/analytics/cars/yearly/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch profitable services analytics
 */
export const fetchProfitableServices = async (): Promise<ProfitableServicesData[]> => {
  const response = await apiClient.get('/analytics/services/profitable/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch popular services analytics
 */
export const fetchPopularServices = async (): Promise<PopularServicesData[]> => {
  const response = await apiClient.get('/analytics/services/popular/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch top spare parts analytics
 */
export const fetchTopSpareParts = async (): Promise<TopSparePartsData[]> => {
  const response = await apiClient.get('/analytics/spare-parts/top/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch analytics metrics (for metric cards)
 */
export const fetchAnalyticsMetrics = async (): Promise<AnalyticsMetrics> => {
  try {
    const response = await apiClient.get('/analytics/metrics/');
    
    // Ensure we return a valid object with default values if needed
    const defaultMetrics: AnalyticsMetrics = {
      monthlyRevenue: 0,
      totalBookings: 0,
      activeVehicles: 0,
      servicesCompleted: 0,
      revenueChange: 0,
      bookingsChange: 0,
      vehiclesChange: 0,
      servicesChange: 0,
      totalSales: 0,
      productsUsedPrices: 0,
      salesRevenue: 0,
      totalRevenue: 0,
    };
    
    // Merge response data with defaults to handle missing properties
    return { ...defaultMetrics, ...response.data };
  } catch (error) {
    console.error('Failed to fetch analytics metrics:', error);
    // Return default metrics on error
    return {
      monthlyRevenue: 0,
      totalBookings: 0,
      activeVehicles: 0,
      servicesCompleted: 0,
      revenueChange: 0,
      bookingsChange: 0,
      vehiclesChange: 0,
      servicesChange: 0,
      totalSales: 0,
      productsUsedPrices: 0,
      salesRevenue: 0,
      totalRevenue: 0,
    };
  }
};

// Export grouped API object for easy import
export const analyticsApi = {
  fetchMonthlyRevenue,
  fetchDailyBookings,
  fetchTopServices,
  fetchCarTypes,
  fetchYearlyCars,
  fetchProfitableServices,
  fetchPopularServices,
  fetchTopSpareParts,
  fetchAnalyticsMetrics,
};