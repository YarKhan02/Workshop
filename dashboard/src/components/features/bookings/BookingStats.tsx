// ==================== BOOKING STATS COMPONENT ====================

import React from 'react';
import { Calendar, CheckCircle, Clock, User } from 'lucide-react';
import type { BookingStatsProps } from '../../../types/booking';

const BookingStats: React.FC<BookingStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md animate-pulse">
            <div className="flex items-center">
              <div className="p-3 bg-gray-700/50 rounded-xl shadow-lg">
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </div>
              <div className="ml-4">
                <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          </div>
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
        <div
          key={index}
          className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;
