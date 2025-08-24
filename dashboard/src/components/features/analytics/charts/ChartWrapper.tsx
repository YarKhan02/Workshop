import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { cn } from '../../../../utils/themeUtils';

interface BaseChartProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
  children: React.ReactNode;
}

export const ChartWrapper: React.FC<BaseChartProps> = ({
  title,
  description,
  isLoading = false,
  error = null,
  className = '',
  children,
}) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className={cn("p-6 rounded-xl shadow-lg border", theme.components.card.base, className)}>
        <div className="flex flex-col space-y-2 mb-6">
          <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>{title}</h3>
          {description && (
            <p className={cn("text-sm", theme.textSecondary)}>{description}</p>
          )}
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className={cn("h-8 w-8 animate-spin", theme.textPrimary)} />
            <p className={cn("text-sm", theme.textSecondary)}>Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-6 rounded-xl shadow-lg border", theme.components.card.base, className)}>
        <div className="flex flex-col space-y-2 mb-6">
          <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>{title}</h3>
          {description && (
            <p className={cn("text-sm", theme.textSecondary)}>{description}</p>
          )}
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-3 text-center">
            <AlertCircle className={cn("h-8 w-8", theme.error)} />
            <div className="space-y-1">
              <p className={cn("text-sm font-medium", theme.textPrimary)}>
                Failed to load chart data
              </p>
              <p className={cn("text-xs", theme.textSecondary)}>
                {error.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 rounded-xl shadow-lg border", theme.components.card.base, className)}>
      <div className="flex flex-col space-y-2 mb-6">
        <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>{title}</h3>
        {description && (
          <p className={cn("text-sm", theme.textSecondary)}>{description}</p>
        )}
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
};

// Loading skeleton for charts
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn("p-6 rounded-xl shadow-lg border", theme.components.card.base, className)}>
      <div className="space-y-2 mb-6">
        <div className={cn("h-5 rounded", theme.surface)} />
        <div className={cn("h-4 rounded w-2/3", theme.surface)} />
      </div>
      <div className={cn("h-64 rounded", theme.surface)} />
    </div>
  );
};

// Metric card component for summary stats
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  className = '',
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn("p-6 rounded-xl shadow-lg border", theme.components.card.base, className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className={cn("text-sm", theme.textSecondary)}>{title}</p>
          <p className={cn("text-2xl font-bold", theme.textPrimary)}>{value}</p>
          {change && (
            <div className={cn("flex items-center text-xs", 
              change.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className={cn("ml-1", theme.textSecondary)}>vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("opacity-80", theme.textPrimary)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};