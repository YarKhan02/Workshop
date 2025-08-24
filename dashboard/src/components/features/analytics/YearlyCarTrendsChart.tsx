import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { BarChart } from './charts/ReusableCharts';
import { useYearlyCars } from '../../../hooks/useAnalytics';

export const YearlyCarTrendsChart: React.FC = () => {
  const { data, isLoading, error } = useYearlyCars();

  return (
    <ChartWrapper
      title="Car Manufacturing Years"
      description="Vehicles by year of manufacture"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <BarChart
          data={data}
          xKey="year"
          yKey="count"
          color="hsl(var(--chart-4))"
        />
      )}
    </ChartWrapper>
  );
};