// ==================== BOOKING DETAIL MODAL COMPONENT ====================

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, User, Car, FileText, Banknote, Phone, Mail, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../../../api/booking';
import { useTheme, cn, ThemedModal, ThemedButton, ConfirmationModal } from '../../ui';
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
    case 'no_show': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'rescheduled': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'confirmed': return 'Confirmed';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'no_show': return 'No Show';
    case 'rescheduled': return 'Rescheduled';
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

// ==================== COMPONENT ====================

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ isOpen, onClose, booking }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  
  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type?: 'warning' | 'success' | 'danger';
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    type: 'warning'
  });

  // ==================== MUTATIONS ====================
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return await bookingAPI.updateBookingStatus(bookingId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Service status updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update service status';
      toast.error(errorMessage);
    },
  });

  // ==================== EVENT HANDLERS ====================
  
  const handleStatusChange = (newStatus: string) => {
    if (!booking || newStatus === booking.status) return;
    
    // Prevent status changes if payment has been received
    if (booking.isPaid) {
      toast.error('Cannot change status for paid bookings. Please contact billing to make changes.');
      return;
    }

    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed', 
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'no_show': 'No Show',
    };

    const currentStatusLabel = statusLabels[booking.status] || booking.status;
    const newStatusLabel = statusLabels[newStatus] || newStatus;

    setConfirmationModal({
      isOpen: true,
      title: 'Confirm Status Change',
      message: `Change service status from "${currentStatusLabel}" to "${newStatusLabel}"?`,
      action: () => {
        updateStatusMutation.mutate({ bookingId: booking.id, status: newStatus });
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      type: newStatus === 'cancelled' ? 'danger' : 'warning'
    });
  };

  const handleMarkComplete = () => {
    if (!booking) return;
    
    // Prevent completion if payment has been received
    if (booking.isPaid) {
      toast.error('Cannot change status for paid bookings. Please contact billing to make changes.');
      return;
    }
    
    setConfirmationModal({
      isOpen: true,
      title: 'Mark Service Complete',
      message: 'Are you sure you want to mark this service as completed? This will generate an invoice for billing.',
      action: () => {
        updateStatusMutation.mutate({ bookingId: booking.id, status: 'completed' });
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      type: 'success'
    });
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
            className={cn("px-4 py-2 border rounded-xl transition-all duration-300", theme.background, theme.textPrimary, theme.border, "focus:ring-2 focus:ring-orange-500 focus:border-orange-500", booking.isPaid && "opacity-50 cursor-not-allowed")}
            disabled={updateStatusMutation.isPending || booking.isPaid}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          {booking.isPaid && (
            <span className="text-sm text-orange-400 flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Status locked (paid)
            </span>
          )}
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

            {/* Payment Status */}
            <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30 mb-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.isPaid
                      ? 'bg-green-900/50 text-green-300 border border-green-600/30'
                      : booking.paymentStatus === 'pending'
                      ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-600/30'
                      : 'bg-red-900/50 text-red-300 border border-red-600/30'
                  }`}>
                    {booking.isPaid ? 'Paid' : booking.paymentStatus === 'pending' ? 'Pending' : 'Unpaid'}
                  </span>
                </div>
                
                {booking.invoiceNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Invoice:</span>
                    <span className="text-gray-200 font-mono">#{booking.invoiceNumber}</span>
                  </div>
                )}
                
                {booking.isPaid && (
                  <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-600/30">
                    <div className="flex items-center text-orange-300">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">This booking cannot be edited as payment has been received.</span>
                    </div>
                  </div>
                )}
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
        {booking && booking.status !== 'completed' && booking.status !== 'cancelled' && !booking.isPaid && (
          <ThemedButton
            onClick={handleMarkComplete}
            disabled={updateStatusMutation.isPending}
            variant="primary"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {updateStatusMutation.isPending ? 'Updating...' : 'Mark Complete'}
          </ThemedButton>
        )}
        {booking && booking.isPaid && (
          <ThemedButton
            disabled
            variant="secondary"
            className="opacity-50 cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Received
          </ThemedButton>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.action}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        isLoading={updateStatusMutation.isPending}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </ThemedModal>
  );
};

export default BookingDetailModal;
