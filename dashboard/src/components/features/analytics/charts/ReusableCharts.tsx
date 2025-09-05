import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../../../../contexts/ThemeContext';

// Chart color palette - using theme colors
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
];

// Custom tooltip styles
const customTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

// Line Chart Component
interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
  strokeWidth?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  color = CHART_COLORS[0],
  strokeWidth = 3,
}) => {
  const { theme } = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={theme.border} 
          opacity={0.3}
        />
        <XAxis 
          dataKey={xKey} 
          stroke={theme.textSecondary}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke={theme.textSecondary}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toLocaleString()}`}
        />
        <Tooltip 
          contentStyle={customTooltipStyle}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color }}
          formatter={(value: any) => [value.toLocaleString(), yKey]}
        />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color}
          strokeWidth={strokeWidth}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Area Chart Component
interface AreaChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xKey,
  yKey,
  color = CHART_COLORS[0],
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <RechartsAreaChart data={data}>
      <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="hsl(var(--border))" 
        opacity={0.3}
      />
      <XAxis 
        dataKey={xKey} 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value.toLocaleString()}`}
      />
      <Tooltip 
        contentStyle={customTooltipStyle}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
      />
      <Area 
        type="monotone" 
        dataKey={yKey} 
        stroke={color}
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorGradient)"
      />
    </RechartsAreaChart>
  </ResponsiveContainer>
);

// Bar Chart Component
interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  color = CHART_COLORS[1],
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <RechartsBarChart data={data}>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="hsl(var(--border))" 
        opacity={0.3}
      />
      <XAxis 
        dataKey={xKey} 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => value.toLocaleString()}
      />
      <Tooltip 
        contentStyle={customTooltipStyle}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
        itemStyle={{ color }}
        formatter={(value: any) => [value.toLocaleString(), yKey]}
      />
      <Bar 
        dataKey={yKey} 
        fill={color}
        radius={[4, 4, 0, 0]}
      />
    </RechartsBarChart>
  </ResponsiveContainer>
);

// Pie Chart Component
interface PieChartProps {
  data: Array<Record<string, any>>;
  nameKey: string;
  valueKey: string;
  showLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  valueKey,
  showLegend = true,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <RechartsPieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey={valueKey}
      >
        {data.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={customTooltipStyle}
        formatter={(value: any, name: any) => [value.toLocaleString(), name]}
      />
      {showLegend && <Legend />}
    </RechartsPieChart>
  </ResponsiveContainer>
);

// Horizontal Bar Chart Component
interface HorizontalBarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  xKey,
  yKey,
  color = CHART_COLORS[2],
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <RechartsBarChart 
      data={data} 
      layout="horizontal"
      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
    >
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="hsl(var(--border))" 
        opacity={0.3}
      />
      <XAxis 
        type="number" 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => value.toLocaleString()}
      />
      <YAxis 
        type="category" 
        dataKey={yKey} 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        width={100}
      />
      <Tooltip 
        contentStyle={customTooltipStyle}
        labelStyle={{ color: 'hsl(var(--foreground))' }}
        itemStyle={{ color }}
        formatter={(value: any) => [value.toLocaleString(), xKey]}
      />
      <Bar 
        dataKey={xKey} 
        fill={color}
        radius={[0, 4, 4, 0]}
      />
    </RechartsBarChart>
  </ResponsiveContainer>
);