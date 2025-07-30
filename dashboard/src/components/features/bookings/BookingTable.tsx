// ==================== BOOKING TABLE COMPONENT ====================

import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { DataTable } from '../../shared/data';
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

const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// ==================== COMPONENT ====================
const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  isLoading,
  onViewBooking,
  onEditBooking,
}) => {
  const columns = [
    {
      key: 'customer_car',
      header: 'Customer & Vehicle',
      render: (booking: Booking) => (
        <div>
          <div className="text-sm font-medium text-gray-100">{booking.customerName}</div>
          <div className="text-sm text-gray-300">{booking.carMake} {booking.carModel}</div>
          <div className="text-xs text-gray-400">{booking.carLicensePlate}</div>
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
          <div className="text-xs text-gray-400 mt-1">
            {formatDuration(booking.estimatedDuration)}
          </div>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'Service Time',
      render: (booking: Booking) => (
        <div>
          <div className="text-sm text-gray-200">{formatDate(booking.scheduledDate)}</div>
          <div className="text-sm text-gray-400">{formatTime(booking.scheduledTime)}</div>
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
        <div className="text-sm font-medium text-gray-200">
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
      className: 'text-orange-400 hover:text-orange-300',
    },
    {
      label: 'Edit Appointment',
      icon: Edit,
      onClick: onEditBooking,
      className: 'text-red-400 hover:text-red-300',
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
