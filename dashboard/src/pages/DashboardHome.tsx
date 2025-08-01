import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Banknote, 
  Users,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';

// Common Components
import { PageHeader, StatsGrid } from '../components';

// Themed Components
import { ThemedButton, useTheme, cn } from '../components/ui';

// API Types
import type { DashboardStats, RecentJob } from '../api/dashboard';

// Hooks
import { useDashboardStats } from '../hooks/useDashboard';

// Currency utility
import { formatCurrency } from '../utils/currency';


const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

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
      case 'completed': return cn(
        'text-emerald-400',
        'bg-emerald-500/20'
      );
      case 'in_progress': return cn(
        'text-blue-400',
        'bg-blue-500/20'
      );
      case 'pending': return cn(
        'text-amber-400',
        'bg-amber-500/20'
      );
      case 'cancelled': return cn(
        'text-red-400',
        'bg-red-500/20'
      );
      default: return cn(
        theme.textSecondary,
        'bg-gray-500/20'
      );
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
      icon: <Banknote className="h-8 w-8" />,
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
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden backdrop-blur-md">
        <div className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 border-b border-gray-600/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-100">Recent Activity</h3>
            <ThemedButton 
              variant="ghost"
              size="sm"
              onClick={() => navigate('/bookings')}
            >
              View All →
            </ThemedButton>
          </div>
        </div>
        <div className="p-6">
          {currentStats.recent_jobs.length === 0 ? (
            <div className="text-center py-12">
              <Clock className={cn('h-12 w-12 mx-auto mb-4', theme.textMuted)} />
              <p className={theme.textTertiary}>No recent activity</p>
              <p className={cn('text-sm', theme.textMuted)}>Jobs will appear here once you start processing orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentStats.recent_jobs.map((job: RecentJob) => (
                <div 
                  key={job.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg transition-all duration-300',
                    'hover:bg-gray-700/30 cursor-pointer'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg backdrop-blur-sm', getStatusColor(job.status))}>
                      {getStatusIcon(job.status)}
                    </div>
                    <div>
                      <div className={cn('font-medium', theme.textPrimary)}>{job.customer_name}</div>
                      <div className={cn('text-sm', theme.textTertiary)}>{job.service_type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn('font-medium', theme.textPrimary)}>{formatCurrency(job.amount)}</div>
                    <div className={cn('text-sm', theme.textTertiary)}>{formatDate(job.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden backdrop-blur-md">
        <div className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 border-b border-gray-600/30 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-100">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemedButton
              variant="ghost"
              size="lg"
              onClick={() => handleQuickAction('booking')}
              className={cn(
                'flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 border',
                'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
                'border-blue-400/30 hover:transform hover:scale-105'
              )}
            >
              <CalendarDays className="h-8 w-8 text-blue-400" />
              <span className={cn('text-sm font-medium', theme.textPrimary)}>New Appointment</span>
            </ThemedButton>
            
            <ThemedButton
              variant="ghost"
              size="lg"
              onClick={() => handleQuickAction('job')}
              className={cn(
                'flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 border',
                'bg-gradient-to-br from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30',
                'border-orange-400/30 hover:transform hover:scale-105'
              )}
            >
              <Receipt className="h-8 w-8 text-orange-400" />
              <span className={cn('text-sm font-medium', theme.textPrimary)}>Billing</span>
            </ThemedButton>
            
            <ThemedButton
              variant="ghost"
              size="lg"
              onClick={() => handleQuickAction('customer')}
              className={cn(
                'flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 border',
                'bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30',
                'border-purple-400/30 hover:transform hover:scale-105'
              )}
            >
              <Users className="h-8 w-8 text-purple-400" />
              <span className={cn('text-sm font-medium', theme.textPrimary)}>Customer Directory</span>
            </ThemedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 