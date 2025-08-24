import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { HorizontalBarChart } from './charts/ReusableCharts';
import { useTopServices } from '../../../hooks/useAnalytics';

export const TopServicesChart: React.FC = () => {
  const { data, isLoading, error } = useTopServices();

  return (
    <ChartWrapper
      title="Top Services Used"
      description="Most frequently requested services"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <HorizontalBarChart
          data={data}
          xKey="count"
          yKey="service"
          color="hsl(var(--chart-3))"
        />
      )}
    </ChartWrapper>
  );
};