// ==================== BOOKING DETAIL MODAL COMPONENT ====================

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, User, Car, FileText, Banknote, Phone, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../../../api/booking';
import { useTheme, cn, ThemedModal, ThemedButton } from '../../ui';
import type { BookingDetailModalProps } from '../../../types/booking';
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

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Scheduled';
    case 'confirmed': return 'Confirmed';
    case 'in_progress': return 'In Service';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return status.replace('_', ' ').toUpperCase();
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ==================== COMPONENT ====================

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ isOpen, onClose, booking }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // ==================== MUTATIONS ====================
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return await bookingAPI.updateBookingStatus(bookingId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('🔧 Service status updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update service status';
      toast.error(errorMessage);
    },
  });

  // ==================== EVENT HANDLERS ====================
  
  const handleStatusChange = (newStatus: string) => {
    if (!booking || newStatus === booking.status) return;

    const statusLabels: { [key: string]: string } = {
      'pending': 'Scheduled',
      'confirmed': 'Confirmed', 
      'in_progress': 'In Service',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    const currentStatusLabel = statusLabels[booking.status] || booking.status;
    const newStatusLabel = statusLabels[newStatus] || newStatus;

    if (window.confirm(`Change service status from "${currentStatusLabel}" to "${newStatusLabel}"?`)) {
      updateStatusMutation.mutate({ bookingId: booking.id, status: newStatus });
    }
  };

  if (!isOpen || !booking) return null;

  // ==================== RENDER ====================
  
  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      subtitle={`Booking #${booking.id}`}
      size="xl"
    >
      {/* Status */}
      <div className="mb-6">
        <label className={cn("block text-sm font-medium mb-3", theme.textSecondary)}>Service Status</label>
        <div className="flex items-center gap-4">
          <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-xl ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
          <select
            value={booking.status}
            onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  disabled={updateStatusMutation.isPending}
                >
                  <option value="pending">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Service</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Client & Machine Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Client Details */}
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Elite Client
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-200 font-medium">{booking.customerName}</p>
                  <div className="flex items-center text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    {booking.customerPhone}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    {booking.customerEmail}
                  </div>
                </div>
              </div>

              {/* Machine Details */}
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Vehicle
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-200 font-medium">{booking.carMake} {booking.carModel}</p>
                  <p className="text-gray-400">License: {booking.carLicensePlate}</p>
                </div>
              </div>

            </div>

            {/* Service & Schedule Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Service Details */}
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Service Package
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-200 font-medium">
                    {booking.serviceType.replace('_', ' ').toUpperCase()}
                  </p>
                  {booking.serviceName && (
                    <p className="text-gray-400">{booking.serviceName}</p>
                  )}
                  <p className="text-gray-400">
                    Duration: {Math.floor(booking.estimatedDuration / 60)}h {booking.estimatedDuration % 60}m
                  </p>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Service Schedule
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-200">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(booking.scheduledDate)}
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(booking.scheduledTime)}
                  </div>
                </div>
              </div>

            </div>

            {/* Pricing Info */}
            <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30 mb-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                <Banknote className="w-5 h-5 mr-2" />
                Prize Money
              </h3>
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(booking.totalAmount)}
              </div>
            </div>

            {/* Notes */}
            {booking.customer_notes && (
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Client Notes
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap">{booking.customer_notes}</p>
              </div>
            )}

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
        <ThemedButton
          onClick={onClose}
          variant="secondary"
        >
          Close
        </ThemedButton>
        {booking && booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <ThemedButton
            onClick={() => handleStatusChange('completed')}
            disabled={updateStatusMutation.isPending}
            variant="primary"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {updateStatusMutation.isPending ? 'Updating...' : 'Mark Complete'}
          </ThemedButton>
        )}
      </div>
    </ThemedModal>
  );
};

export default BookingDetailModal;
