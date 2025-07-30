import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  DollarSign, 
  Users,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';

// Common Components
import { PageHeader, StatsGrid } from '../components/common';

// API Types
import type { DashboardStats, RecentJob } from '../api/dashboard';

// Hooks
import { useDashboardStats } from '../hooks/useDashboard';


const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  // Data fetching using the dashboard API (non-blocking)
  const { data: stats } = useDashboardStats();
  
  // Empty structure for when no data is available
  const emptyStats: DashboardStats = {
    today_bookings: 0,
    today_revenue: 0,
    total_customers: 0,
    total_jobs: 0,
    revenue_growth: 0,
    bookings_growth: 0,
    recent_jobs: []
  };

  const currentStats = stats || emptyStats;

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
        navigate('/billing');
        break;
      case 'customer':
        navigate('/customers');
        break;
      default:
        break;
    }
  };

  // Prepare stats data for StatsGrid component
  const statsData = [
    {
      title: "Today's Bookings",
      value: currentStats.today_bookings.toString(),
      icon: <CalendarDays className="h-8 w-8" />,
      change: {
        value: `${Math.abs(currentStats.bookings_growth)}%`,
        type: (currentStats.bookings_growth >= 0 ? 'increase' : 'decrease') as 'increase' | 'decrease',
      },
      color: 'blue' as const,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(currentStats.today_revenue),
      icon: <DollarSign className="h-8 w-8" />,
      change: {
        value: `${Math.abs(currentStats.revenue_growth)}%`,
        type: (currentStats.revenue_growth >= 0 ? 'increase' : 'decrease') as 'increase' | 'decrease',
      },
      color: 'green' as const,
    },
    {
      title: 'Total Customers',
      value: currentStats.total_customers.toString(),
      icon: <Users className="h-8 w-8" />,
      color: 'purple' as const,
    },
    {
      title: 'Service Queue',
      value: currentStats.total_jobs.toString(),
      icon: <Car className="h-8 w-8" />,
      color: 'orange' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Command Center"
        subtitle="Peak performance dashboard • Real-time insights"
      />

      {/* Key Metrics */}
      <StatsGrid stats={statsData} />

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl border border-gray-700/30 backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-gray-900/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-100">Recent Activity</h3>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-all backdrop-blur-sm"
            >
              View All →
            </button>
          </div>
        </div>
        <div className="p-6">
          {currentStats.recent_jobs.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-gray-500 text-sm">Jobs will appear here once you start processing orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentStats.recent_jobs.map((job: RecentJob) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-900/40 to-slate-700/40 rounded-xl border border-gray-600/30 hover:from-gray-600/50 hover:to-slate-600/50 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getStatusColor(job.status)} backdrop-blur-sm`}>
                      {getStatusIcon(job.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-100">{job.customer_name}</div>
                      <div className="text-sm text-gray-400">{job.service_type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-100">{formatCurrency(job.amount)}</div>
                    <div className="text-sm text-gray-400">{formatDate(job.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <Receipt className="h-8 w-8 text-orange-400" />
            <span className="text-sm font-medium text-gray-100">Billing</span>
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