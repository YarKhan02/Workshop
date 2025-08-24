import { apiClient } from './client';

import type { DashboardStats } from '../types/dashboard';

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats/');
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
