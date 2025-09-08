import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { downloadMonthlyReportPDF } from '../utils/reportUtils';

export interface MonthlyReportData {
  period: {
    month: string;
    year: number;
    start_date: string;
    end_date: string;
  };
  bookings: {
    total_bookings: number;
    completed_bookings: number;
    completion_rate: number;
  };
  financial: {
    total_sales: number;
    service_revenue: number;
    products_used_cost: number;
    gross_revenue: number;
    net_revenue: number;
    employee_salaries: number;
    total_expenses: number;
    total_profit: number;
    profit_margin: number;
  };
  products: {
    products_sold_quantity: number;
    products_sold_value: number;
    products_used_in_services: number;
    product_sales_details: Array<{
      product_name: string;
      variant_name: string;
      sku: string;
      quantity_sold: number;
      revenue: number;
      unit_price: number;
    }>;
  };
  top_services: Array<{
    service_name: string;
    bookings_count: number;
    revenue: number;
  }>;
  expense_breakdown: Array<{
    category: string;
    total_amount: number;
    transaction_count: number;
  }>;
  generated_at: string;
}

export const useMonthlyReport = (month: string, year: number) => {
  return useQuery({
    queryKey: ['monthlyReport', month, year],
    queryFn: async (): Promise<MonthlyReportData> => {
      const response = await apiClient.get(`/analytics/report/monthly/`, {
        params: { month, year }
      });
      return response.data;
    },
    enabled: !!month && !!year,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const downloadMonthlyReport = async (month: string, year: number) => {
  try {
    // First get the report data
    const response = await apiClient.get(`/analytics/report/monthly/`, {
      params: { month, year }
    });
    
    // Use the PDF download function
    downloadMonthlyReportPDF(response.data);
  } catch (error) {
    console.error('Error downloading monthly report:', error);
    throw error;
  }
};
