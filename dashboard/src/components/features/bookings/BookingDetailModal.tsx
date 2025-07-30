// ==================== BOOKING DETAIL MODAL COMPONENT ====================

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Clock, User, Car, FileText, Banknote, Phone, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../../../api/booking';
import type { BookingDetailModalProps } from '../../../types/booking';
import Portal from '../../shared/utility/Portal';
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
    <Portal>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 rounded-2xl shadow-2xl border border-gray-700/30 backdrop-blur-md w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/30 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Appointment Details
              </h2>
              <p className="text-gray-400 mt-1">Booking #{booking.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">{/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Service Status</label>
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

          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex justify-end gap-4 p-6 border-t border-gray-700/30 flex-shrink-0 bg-gradient-to-br from-gray-800/95 to-slate-800/95">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-300"
            >
              Close
            </button>
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={updateStatusMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {updateStatusMutation.isPending ? 'Updating...' : 'Mark Complete'}
              </button>
            )}
          </div>

        </div>
      </div>
    </Portal>
  );
};

export default BookingDetailModal;
