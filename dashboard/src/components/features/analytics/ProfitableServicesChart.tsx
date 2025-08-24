import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { HorizontalBarChart } from './charts/ReusableCharts';
import { useProfitableServices } from '../../../hooks/useAnalytics';

export const ProfitableServicesChart: React.FC = () => {
  const { data, isLoading, error } = useProfitableServices();

  return (
    <ChartWrapper
      title="Most Profitable Services"
      description="Services generating highest revenue"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <HorizontalBarChart
          data={data}
          xKey="revenue"
          yKey="service"
          color="hsl(var(--chart-1))"
        />
      )}
    </ChartWrapper>
  );
};