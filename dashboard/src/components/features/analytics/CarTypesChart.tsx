import React from 'react';
import { ChartWrapper } from './charts/ChartWrapper';
import { PieChart } from './charts/ReusableCharts';
import { useCarTypes } from '../../../hooks/useAnalytics';

export const CarTypesChart: React.FC = () => {
  const { data, isLoading, error } = useCarTypes();

  return (
    <ChartWrapper
      title="Car Types Breakdown"
      description="Distribution of vehicle types in workshop"
      isLoading={isLoading}
      error={error}
    >
      {data && (
        <PieChart
          data={data}
          nameKey="type"
          valueKey="count"
          showLegend={true}
        />
      )}
    </ChartWrapper>
  );
};