import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics';
import type {
  MonthlyRevenueData,
  DailyBookingsData,
  TopServicesData,
  CarTypesData,
  YearlyCarData,
  ProfitableServicesData,
  PopularServicesData,
  TopSparePartsData,
  AnalyticsMetrics
} from '../api/analytics';

// Query configuration
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
};

// Analytics Metrics Hook (for metric cards)
export const useAnalyticsMetrics = () => {
  return useQuery<AnalyticsMetrics>({
    queryKey: ['analytics', 'metrics'],
    queryFn: analyticsApi.fetchAnalyticsMetrics,
    ...QUERY_CONFIG,
  });
};

// Revenue & Payments Hooks
export const useMonthlyRevenue = () => {
  return useQuery<MonthlyRevenueData[]>({
    queryKey: ['analytics', 'revenue', 'monthly'],
    queryFn: analyticsApi.fetchMonthlyRevenue,
    ...QUERY_CONFIG,
  });
};

// Bookings & Services Hooks
export const useDailyBookings = () => {
  return useQuery<DailyBookingsData[]>({
    queryKey: ['analytics', 'bookings', 'daily'],
    queryFn: analyticsApi.fetchDailyBookings,
    ...QUERY_CONFIG,
  });
};

export const useTopServices = () => {
  return useQuery<TopServicesData[]>({
    queryKey: ['analytics', 'services', 'top'],
    queryFn: analyticsApi.fetchTopServices,
    ...QUERY_CONFIG,
  });
};

// Car Insights Hooks
export const useCarTypes = () => {
  return useQuery<CarTypesData[]>({
    queryKey: ['analytics', 'cars', 'types'],
    queryFn: analyticsApi.fetchCarTypes,
    ...QUERY_CONFIG,
  });
};

export const useYearlyCars = () => {
  return useQuery<YearlyCarData[]>({
    queryKey: ['analytics', 'cars', 'yearly'],
    queryFn: analyticsApi.fetchYearlyCars,
    ...QUERY_CONFIG,
  });
};

// Service Utilization Hooks
export const useProfitableServices = () => {
  return useQuery<ProfitableServicesData[]>({
    queryKey: ['analytics', 'services', 'profitable'],
    queryFn: analyticsApi.fetchProfitableServices,
    ...QUERY_CONFIG,
  });
};

export const usePopularServices = () => {
  return useQuery<PopularServicesData[]>({
    queryKey: ['analytics', 'services', 'popular'],
    queryFn: analyticsApi.fetchPopularServices,
    ...QUERY_CONFIG,
  });
};

export const useTopSpareParts = () => {
  return useQuery<TopSparePartsData[]>({
    queryKey: ['analytics', 'spare-parts', 'top'],
    queryFn: analyticsApi.fetchTopSpareParts,
    ...QUERY_CONFIG,
  });
};