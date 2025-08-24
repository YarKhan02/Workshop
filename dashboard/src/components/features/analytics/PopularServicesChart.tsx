import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { BarChart } from './charts/ReusableCharts';
import { usePopularServices } from '../../../hooks/useAnalytics';

export const PopularServicesChart: React.FC = () => {
  const { data, isLoading, error } = usePopularServices();

  return (
    <ChartWrapper
      title="Service Popularity"
      description="Most requested services by frequency"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <BarChart
          data={data}
          xKey="service"
          yKey="count"
          color="hsl(var(--chart-5))"
        />
      )}
    </ChartWrapper>
  );
};