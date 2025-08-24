import { useQuery } from '@tanstack/react-query';
import { analyticsApi, mockData } from '../api/analytics';
import type {
  MonthlyRevenueData,
  DailyBookingsData,
  TopServicesData,
  CarTypesData,
  YearlyCarData,
  ProfitableServicesData,
  PopularServicesData,
  TopSparePartsData
} from '../api/analytics';

// Configuration
const USE_MOCK_DATA = true; // Toggle for development
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
};

// Revenue & Payments Hooks
export const useMonthlyRevenue = () => {
  return useQuery<MonthlyRevenueData[]>({
    queryKey: ['analytics', 'revenue', 'monthly'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.monthlyRevenue()) : 
      analyticsApi.getMonthlyRevenue,
    ...QUERY_CONFIG,
  });
};

// Bookings & Services Hooks
export const useDailyBookings = () => {
  return useQuery<DailyBookingsData[]>({
    queryKey: ['analytics', 'bookings', 'daily'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.dailyBookings()) : 
      analyticsApi.getDailyBookings,
    ...QUERY_CONFIG,
  });
};

export const useTopServices = () => {
  return useQuery<TopServicesData[]>({
    queryKey: ['analytics', 'services', 'top'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.topServices()) : 
      analyticsApi.getTopServices,
    ...QUERY_CONFIG,
  });
};

// Car Insights Hooks
export const useCarTypes = () => {
  return useQuery<CarTypesData[]>({
    queryKey: ['analytics', 'cars', 'types'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.carTypes()) : 
      analyticsApi.getCarTypes,
    ...QUERY_CONFIG,
  });
};

export const useYearlyCars = () => {
  return useQuery<YearlyCarData[]>({
    queryKey: ['analytics', 'cars', 'yearly'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.yearlyCars()) : 
      analyticsApi.getYearlyCars,
    ...QUERY_CONFIG,
  });
};

// Service Utilization Hooks
export const useProfitableServices = () => {
  return useQuery<ProfitableServicesData[]>({
    queryKey: ['analytics', 'services', 'profitable'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.profitableServices()) : 
      analyticsApi.getProfitableServices,
    ...QUERY_CONFIG,
  });
};

export const usePopularServices = () => {
  return useQuery<PopularServicesData[]>({
    queryKey: ['analytics', 'services', 'popular'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.popularServices()) : 
      analyticsApi.getPopularServices,
    ...QUERY_CONFIG,
  });
};

export const useTopSpareParts = () => {
  return useQuery<TopSparePartsData[]>({
    queryKey: ['analytics', 'spare-parts', 'top'],
    queryFn: USE_MOCK_DATA ? 
      () => Promise.resolve(mockData.topSpareParts()) : 
      analyticsApi.getTopSpareParts,
    ...QUERY_CONFIG,
  });
};