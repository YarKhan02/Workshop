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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CalendarDays className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{currentStats.todayBookings}</div>
                <div className="text-gray-500 text-sm">Today's Bookings</div>
              </div>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{currentStats.bookingsGrowth}%
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(currentStats.todayRevenue)}</div>
                <div className="text-gray-500 text-sm">Revenue Today</div>
              </div>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{currentStats.revenueGrowth}%
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-purple-500">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentStats.totalCustomers}</div>
              <div className="text-gray-500 text-sm">Total Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-6">
        {/* Total Jobs */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentStats.totalJobs}</div>
              <div className="text-gray-500 text-sm">Total Jobs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
            <button 
              onClick={() => navigate('/jobs')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {currentStats.recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{job.customerName}</div>
                    <div className="text-sm text-gray-500">{job.serviceType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(job.amount)}</div>
                  <div className="text-sm text-gray-500">{formatDate(job.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickAction('booking')}
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <CalendarDays className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">New Booking</span>
          </button>
          <button 
            onClick={() => handleQuickAction('job')}
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Car className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900">New Job</span>
          </button>
          <button 
            onClick={() => handleQuickAction('customer')}
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Users className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Add Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 