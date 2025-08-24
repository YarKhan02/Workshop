import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { AreaChart } from './charts/ReusableCharts';
import { useMonthlyRevenue } from '../../../hooks/useAnalytics';

export const RevenueChart: React.FC = () => {
  const { data, isLoading, error } = useMonthlyRevenue();

  return (
    <ChartWrapper
      title="Monthly Revenue"
      description="Revenue trends over the past 7 months"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <AreaChart
          data={data}
          xKey="month"
          yKey="revenue"
          color="hsl(var(--chart-1))"
        />
      )}
    </ChartWrapper>
  );
};