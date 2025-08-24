// ==================== BOOKING TABLE COMPONENT ====================

import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { DataTable } from '../../shared/data';
import { useTheme, cn } from '../../ui';
import type { Booking, BookingTableProps } from '../../../types/booking';
import { formatCurrency } from '../../../utils/currency';

// ==================== HELPER FUNCTIONS ====================
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'confirmed': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'in_progress': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'completed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'cancelled': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const getServiceTypeColor = (serviceType: string) => {
  switch (serviceType) {
    case 'basic_wash': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'full_detail': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'interior_detail': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'exterior_detail': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'premium_detail': return 'bg-pink-500/20 text-pink-400 border border-pink-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ==================== COMPONENT ====================
const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  isLoading,
  onViewBooking,
  onEditBooking,
}) => {
  const { theme } = useTheme();

  const columns = [
    {
      key: 'customer_car',
      header: 'Customer & Vehicle',
      render: (booking: Booking) => (
        <div>
          <div className={cn("text-sm font-medium", theme.textPrimary)}>{booking.customerName}</div>
          <div className={cn("text-sm", theme.textSecondary)}>{booking.carMake} {booking.carModel}</div>
          <div className={cn("text-xs", theme.textSecondary)}>{booking.carLicensePlate}</div>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service Type',
      render: (booking: Booking) => (
        <div>
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getServiceTypeColor(booking.serviceType)}`}>
            {booking.serviceType.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'Service Date',
      render: (booking: Booking) => (
        <div>
          <div className={cn("text-sm", theme.textPrimary)}>{formatDate(booking.scheduledDate)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Service Status',
      render: (booking: Booking) => (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Service Amount',
      render: (booking: Booking) => (
        <div className={cn("text-sm font-medium", theme.textPrimary)}>
          {formatCurrency(booking.totalAmount)}
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: onViewBooking,
      className: theme.components.table.actionButtonView,
    },
    {
      label: 'Edit Appointment',
      icon: Edit,
      onClick: onEditBooking,
      className: theme.components.table.actionButtonEdit,
    },
  ];

  return (
    <DataTable
      data={bookings}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage="No services scheduled"
      loadingMessage="Loading service schedule..."
    />
  );
};

export default BookingTable;
