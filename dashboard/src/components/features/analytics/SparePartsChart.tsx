import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { HorizontalBarChart } from './charts/ReusableCharts';
import { useTopSpareParts } from '../../../hooks/useAnalytics';

export const SparePartsChart: React.FC = () => {
  const { data, isLoading, error } = useTopSpareParts();

  return (
    <ChartWrapper
      title="Top Used Spare Parts"
      description="Most frequently used spare parts inventory"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <HorizontalBarChart
          data={data}
          xKey="count"
          yKey="part"
          color="hsl(var(--chart-6))"
        />
      )}
    </ChartWrapper>
  );
};