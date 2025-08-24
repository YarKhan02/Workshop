import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { LineChart } from './charts/ReusableCharts';
import { useDailyBookings } from '../../../hooks/useAnalytics';

export const BookingsChart: React.FC = () => {
  const { data, isLoading, error } = useDailyBookings();

  return (
    <ChartWrapper
      title="Daily Bookings"
      description="Booking trends over the past week"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <LineChart
          data={data}
          xKey="date"
          yKey="count"
          color="hsl(var(--chart-2))"
        />
      )}
    </ChartWrapper>
  );
};