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