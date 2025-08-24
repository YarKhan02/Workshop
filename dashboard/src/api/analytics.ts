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

// API Configuration
const API_BASE_URL = '/api/analytics';

// Generic API call handler with error handling
async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// Analytics API methods
export const analyticsApi = {
  // Revenue & Payments
  getMonthlyRevenue: (): Promise<MonthlyRevenueData[]> =>
    apiCall<MonthlyRevenueData[]>('/revenue/monthly'),

  // Bookings & Services
  getDailyBookings: (): Promise<DailyBookingsData[]> =>
    apiCall<DailyBookingsData[]>('/bookings/daily'),

  getTopServices: (): Promise<TopServicesData[]> =>
    apiCall<TopServicesData[]>('/services/top'),

  // Car Insights
  getCarTypes: (): Promise<CarTypesData[]> =>
    apiCall<CarTypesData[]>('/cars/types'),

  getYearlyCars: (): Promise<YearlyCarData[]> =>
    apiCall<YearlyCarData[]>('/cars/yearly'),

  // Service Utilization
  getProfitableServices: (): Promise<ProfitableServicesData[]> =>
    apiCall<ProfitableServicesData[]>('/services/profitable'),

  getPopularServices: (): Promise<PopularServicesData[]> =>
    apiCall<PopularServicesData[]>('/services/popular'),

  getTopSpareParts: (): Promise<TopSparePartsData[]> =>
    apiCall<TopSparePartsData[]>('/spare-parts/top'),
};

// Mock data generators for development/testing
export const mockData = {
  monthlyRevenue: (): MonthlyRevenueData[] => [
    { month: '2024-07', revenue: 85000 },
    { month: '2024-08', revenue: 92000 },
    { month: '2024-09', revenue: 78000 },
    { month: '2024-10', revenue: 105000 },
    { month: '2024-11', revenue: 98000 },
    { month: '2024-12', revenue: 112000 },
    { month: '2025-01', revenue: 89000 },
  ],

  dailyBookings: (): DailyBookingsData[] => [
    { date: '2025-01-15', count: 12 },
    { date: '2025-01-16', count: 15 },
    { date: '2025-01-17', count: 9 },
    { date: '2025-01-18', count: 18 },
    { date: '2025-01-19', count: 14 },
    { date: '2025-01-20', count: 21 },
    { date: '2025-01-21', count: 16 },
  ],

  topServices: (): TopServicesData[] => [
    { service: 'Oil Change', count: 145 },
    { service: 'Tire Replacement', count: 89 },
    { service: 'Brake Service', count: 76 },
    { service: 'Engine Tune-up', count: 54 },
    { service: 'Transmission Service', count: 32 },
  ],

  carTypes: (): CarTypesData[] => [
    { type: 'SUV', count: 120 },
    { type: 'Sedan', count: 180 },
    { type: 'Hatchback', count: 95 },
    { type: 'Truck', count: 45 },
    { type: 'Coupe', count: 28 },
  ],

  yearlyCars: (): YearlyCarData[] => [
    { year: 2019, count: 25 },
    { year: 2020, count: 45 },
    { year: 2021, count: 65 },
    { year: 2022, count: 85 },
    { year: 2023, count: 92 },
    { year: 2024, count: 78 },
  ],

  profitableServices: (): ProfitableServicesData[] => [
    { service: 'Engine Repair', revenue: 125000 },
    { service: 'Transmission Fix', revenue: 89000 },
    { service: 'AC Service', revenue: 67000 },
    { service: 'Suspension Repair', revenue: 54000 },
    { service: 'Electrical Work', revenue: 43000 },
  ],

  popularServices: (): PopularServicesData[] => [
    { service: 'Oil Change', count: 145 },
    { service: 'Tire Rotation', count: 112 },
    { service: 'Brake Inspection', count: 98 },
    { service: 'Battery Check', count: 76 },
    { service: 'Filter Replacement', count: 65 },
  ],

  topSpareParts: (): TopSparePartsData[] => [
    { part: 'Brake Pads', count: 89 },
    { part: 'Air Filter', count: 76 },
    { part: 'Oil Filter', count: 145 },
    { part: 'Spark Plugs', count: 54 },
    { part: 'Windshield Wipers', count: 32 },
  ],
};