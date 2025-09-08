import React, { useState } from 'react';
import { 
  Calendar, 
  Car, 
  Wrench, 
  Coins,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAnalyticsMetrics } from '../../../hooks/useAnalytics';
import { formatNumber } from '../../../utils/analyticsUtils';
import { MetricCard } from './charts/ChartWrapper';
import { RevenueChart } from './RevenueChart';
import { BookingsChart } from './BookingsChart';
import { TopServicesChart } from './TopServicesChart';
import { CarTypesChart } from './CarTypesChart';
import { YearlyCarTrendsChart } from './YearlyCarTrendsChart';
import { ProfitableServicesChart } from './ProfitableServicesChart';
import { PopularServicesChart } from './PopularServicesChart';
import { SparePartsChart } from './SparePartsChart';
import { MonthlyReportModal } from './MonthlyReportModal';

export const AnalyticsModal: React.FC = () => {
  const { theme } = useTheme();
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useAnalyticsMetrics();
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
  
  if (metricsError) {
    return (
      <div className={`min-h-screen p-6 ${theme.primary}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load analytics data</p>
            <p className="text-muted-foreground text-sm">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen p-6 ${theme.primary}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Workshop Analytics Dashboard
            </h1>
          </div>
          <button
            onClick={() => setIsMonthlyReportOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Monthly Report</span>
          </button>
        </div>
        <p className="text-muted-foreground">
          Comprehensive insights into your car workshop operations
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricsLoading ? (
          // Loading skeleton for metrics
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg p-6 border">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                  <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-12"></div>
                </div>
                <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))
        ) : metrics ? (
          <>
            <MetricCard
              title="Monthly Revenue"
              value={metrics.monthlyRevenue || 0}
              icon={<Coins className="h-6 w-6" />}
            />
            <MetricCard
              title="Total Bookings"
              value={formatNumber(metrics.totalBookings || 0)}
              icon={<Calendar className="h-6 w-6" />}
            />
            <MetricCard
              title="Active Vehicles"
              value={formatNumber(metrics.activeVehicles || 0)}
              icon={<Car className="h-6 w-6" />}
            />
            <MetricCard
              title="Services Completed"
              value={formatNumber(metrics.servicesCompleted || 0)}
              icon={<Wrench className="h-6 w-6" />}
            />
            <MetricCard
              title="Total Sales"
              value={metrics.totalSales || 0}
              icon={<Coins className="h-6 w-6" />}
            />
            <MetricCard
              title="Products Used Prices"
              value={metrics.productsUsedPrices || 0}
              icon={<Calendar className="h-6 w-6" />}
            />
            <MetricCard
              title="Sales Revenue"
              value={metrics.salesRevenue || 0}
              icon={<Car className="h-6 w-6" />}
            />
            <MetricCard
              title="Total Revenue"
              value={metrics.totalRevenue || 0}
              icon={<Wrench className="h-6 w-6" />}
            />
          </>
        ) : (
          // Fallback when no data
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg p-6 border">
              <div className="flex items-center justify-center h-20">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Financial */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        <div className="lg:col-span-1">
          <ProfitableServicesChart />
        </div>

        <div className="lg:col-span-1">
          <BookingsChart />
        </div>

        {/* Services Analysis */}
        <div className="lg:col-span-1">
          <TopServicesChart />
        </div>

        <div className="lg:col-span-1">
          <PopularServicesChart />
        </div>

        {/* Vehicle Insights */}
        <div className="lg:col-span-1">
          <CarTypesChart />
        </div>

        <div className="lg:col-span-1">
          <SparePartsChart />
        </div>

        <div className="lg:col-span-2">
          <YearlyCarTrendsChart />
        </div>
      </div>
      
      {/* Monthly Report Modal */}
      <MonthlyReportModal
        isOpen={isMonthlyReportOpen}
        onClose={() => setIsMonthlyReportOpen(false)}
      />
    </div>
  );
};