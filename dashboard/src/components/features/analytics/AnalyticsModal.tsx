import React from 'react';
import { 
  Calendar, 
  Car, 
  Wrench, 
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { MetricCard } from './charts/ChartWrapper';
import { RevenueChart } from './RevenueChart';
import { BookingsChart } from './BookingsChart';
import { TopServicesChart } from './TopServicesChart';
import { CarTypesChart } from './CarTypesChart';
import { YearlyCarTrendsChart } from './YearlyCarTrendsChart';
import { ProfitableServicesChart } from './ProfitableServicesChart';
import { PopularServicesChart } from './PopularServicesChart';
import { SparePartsChart } from './SparePartsChart';

export const AnalyticsModal: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen p-6 ${theme.primary}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Workshop Analytics Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Comprehensive insights into your car workshop operations
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Monthly Revenue"
          value="$89,000"
          change={{ value: 12.5, isPositive: true }}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <MetricCard
          title="Total Bookings"
          value="342"
          change={{ value: 8.2, isPositive: true }}
          icon={<Calendar className="h-6 w-6" />}
        />
        <MetricCard
          title="Active Vehicles"
          value="468"
          change={{ value: -2.1, isPositive: false }}
          icon={<Car className="h-6 w-6" />}
        />
        <MetricCard
          title="Services Completed"
          value="156"
          change={{ value: 15.3, isPositive: true }}
          icon={<Wrench className="h-6 w-6" />}
        />
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
      
    </div>
  );
};