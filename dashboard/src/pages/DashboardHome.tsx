import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  DollarSign, 
  Users,
  Car,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  totalCustomers: number;
  totalJobs: number;
  revenueGrowth: number;
  bookingsGrowth: number;
  recentJobs: Array<{
    id: number;
    customerName: string;
    serviceType: string;
    status: string;
    amount: number;
    createdAt: string;
  }>;
}

const DashboardHome: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      return response.json();
    },
    enabled: !!token,
  });

  // Fallback data if API is not available
  const fallbackStats: DashboardStats = {
    todayBookings: 8,
    todayRevenue: 12500,
    totalCustomers: 156,
    totalJobs: 89,
    revenueGrowth: 12.5,
    bookingsGrowth: 8.3,
    recentJobs: [
      {
        id: 1,
        customerName: 'Rahul Sharma',
        serviceType: 'Full Detailing',
        status: 'completed',
        amount: 1499,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        customerName: 'Priya Patel',
        serviceType: 'Interior Cleaning',
        status: 'in_progress',
        amount: 399,
        createdAt: '2024-01-15T09:15:00Z'
      },
      {
        id: 3,
        customerName: 'Amit Kumar',
        serviceType: 'Exterior Wash',
        status: 'pending',
        amount: 299,
        createdAt: '2024-01-15T08:45:00Z'
      }
    ]
  };

  const currentStats = stats || fallbackStats;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'in_progress': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'booking':
        navigate('/bookings');
        break;
      case 'job':
        navigate('/jobs');
        break;
      case 'customer':
        navigate('/customers');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Command Center</h1>
        <p className="text-gray-400 mt-2 text-lg">Peak performance dashboard • Real-time insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl p-6 border border-gray-700/30 backdrop-blur-md hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-xl backdrop-blur-sm border border-blue-400/30">
                <CalendarDays className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-100">{currentStats.todayBookings}</div>
                <div className="text-gray-400 text-sm font-medium">Today's Bookings</div>
              </div>
            </div>
            <div className="flex items-center text-emerald-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{currentStats.bookingsGrowth}%
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl p-6 border border-gray-700/30 backdrop-blur-md hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-4 rounded-xl backdrop-blur-sm border border-emerald-400/30">
                <DollarSign className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-100">{formatCurrency(currentStats.todayRevenue)}</div>
                <div className="text-gray-400 text-sm font-medium">Today's Revenue</div>
              </div>
            </div>
            <div className="flex items-center text-emerald-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{currentStats.revenueGrowth}%
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl p-6 border border-gray-700/30 backdrop-blur-md hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl backdrop-blur-sm border border-purple-400/30">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-100">{currentStats.totalCustomers}</div>
              <div className="text-gray-400 text-sm font-medium">Total Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-6">
        {/* Total Jobs */}
        <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl p-6 border border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 rounded-xl backdrop-blur-sm border border-orange-400/30">
              <Car className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-100">{currentStats.totalJobs}</div>
              <div className="text-gray-400 text-sm font-medium">Service Queue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        {/* Recent Jobs */}
        <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-100">Recent Activity</h3>
            <button 
              onClick={() => navigate('/jobs')}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-all backdrop-blur-sm"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {currentStats.recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-6 bg-gray-900/50 rounded-xl border border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getStatusColor(job.status)} backdrop-blur-sm`}>
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-100">{job.customerName}</div>
                    <div className="text-sm text-gray-400">{job.serviceType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-100">{formatCurrency(job.amount)}</div>
                  <div className="text-sm text-gray-400">{formatDate(job.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700/30 backdrop-blur-md">
        <h3 className="text-2xl font-bold text-gray-100 mb-8">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => handleQuickAction('booking')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm border border-blue-400/30 hover:transform hover:scale-105"
          >
            <CalendarDays className="h-8 w-8 text-blue-400" />
            <span className="text-sm font-medium text-gray-100">New Appointment</span>
          </button>
          <button 
            onClick={() => handleQuickAction('job')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 backdrop-blur-sm border border-orange-400/30 hover:transform hover:scale-105"
          >
            <Car className="h-8 w-8 text-orange-400" />
            <span className="text-sm font-medium text-gray-100">Service Queue</span>
          </button>
          <button 
            onClick={() => handleQuickAction('customer')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm border border-purple-400/30 hover:transform hover:scale-105"
          >
            <Users className="h-8 w-8 text-purple-400" />
            <span className="text-sm font-medium text-gray-100">Customer Directory</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 