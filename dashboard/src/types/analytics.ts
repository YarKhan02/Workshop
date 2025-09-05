// Re-export all analytics types for easy importing
export type {
  MonthlyRevenueData,
  DailyBookingsData,
  TopServicesData,
  CarTypesData,
  YearlyCarData,
  ProfitableServicesData,
  PopularServicesData,
  TopSparePartsData,
  AnalyticsMetrics,
} from '../api/analytics';

// Additional types for analytics UI components
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  animations?: boolean;
}

export interface AnalyticsFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  services?: string[];
  carTypes?: string[];
  revenueMin?: number;
  revenueMax?: number;
}

export interface AnalyticsPeriod {
  label: string;
  value: 'day' | 'week' | 'month' | 'quarter' | 'year';
  days: number;
}
