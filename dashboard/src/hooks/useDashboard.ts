import { useQuery } from '@tanstack/react-query';
import { dashboardQueries } from '../api/dashboard';

export const useDashboardStats = () => {
  return useQuery(dashboardQueries.stats());
};
