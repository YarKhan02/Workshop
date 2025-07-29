import { apiClient } from './client';

export interface RecentJob {
  id: number;
  customer_name: string;
  service_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  created_at: string;
}

export interface DashboardStats {
  today_bookings: number;
  today_revenue: number;
  total_customers: number;
  total_jobs: number;
  revenue_growth: number;
  bookings_growth: number;
  recent_jobs: RecentJob[];
}

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};

// Dashboard query keys for React Query
export const dashboardQueries = {
  keys: {
    all: ['dashboard'] as const,
    stats: () => [...dashboardQueries.keys.all, 'stats'] as const,
  },

  // Query functions for use with React Query
  stats: () => ({
    queryKey: dashboardQueries.keys.stats(),
    queryFn: () => dashboardAPI.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 30, // Refresh every 30 seconds
  }),
};

export default dashboardAPI;
