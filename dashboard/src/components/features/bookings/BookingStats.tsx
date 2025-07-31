// ==================== BOOKING STATS COMPONENT ====================

import React from 'react';
import { Calendar, CheckCircle, Clock, User } from 'lucide-react';
import { useTheme, cn, ThemedCard } from '../../ui';
import type { BookingStatsProps } from '../../../types/booking';

const BookingStats: React.FC<BookingStatsProps> = ({ stats, isLoading = false }) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <ThemedCard key={i} className="p-6 animate-pulse">
            <div className="flex items-center">
              <div className={cn("p-3 rounded-xl shadow-lg", theme.backgroundSecondary)}>
                <div className={cn("w-6 h-6 rounded", theme.backgroundTertiary)}></div>
              </div>
              <div className="ml-4">
                <div className={cn("h-4 rounded w-20 mb-2", theme.backgroundTertiary)}></div>
                <div className={cn("h-6 rounded w-12", theme.backgroundTertiary)}></div>
              </div>
            </div>
          </ThemedCard>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      label: 'Total Appointments',
      value: stats.totalBookings,
      icon: Calendar,
      gradient: 'from-orange-500 to-red-600',
    },
    {
      label: 'Completed Services',
      value: stats.completedBookings,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      label: 'Pending Services',
      value: stats.pendingBookings,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      label: "Today's Schedule",
      value: stats.todayBookings,
      icon: User,
      gradient: 'from-purple-500 to-violet-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <ThemedCard
          key={index}
          className="p-6 hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className={cn("text-sm font-medium", theme.textSecondary)}>{stat.label}</p>
              <p className={cn("text-2xl font-bold", theme.textPrimary)}>{stat.value}</p>
            </div>
          </div>
        </ThemedCard>
      ))}
    </div>
  );
};

export default BookingStats;
