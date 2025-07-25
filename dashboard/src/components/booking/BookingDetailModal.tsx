import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Clock, User, Car, FileText, DollarSign, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../../api/booking';
import Portal from '../ui/Portal';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ isOpen, onClose, booking }) => {
  const queryClient = useQueryClient();

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const response = await bookingAPI.updateBookingStatus(bookingId, { status });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Booking status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update booking status');
      console.error('Error updating booking status:', error);
    },
  });

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === booking.status) {
      return; // No change needed
    }

    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed', 
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    const currentStatusLabel = statusLabels[booking.status] || booking.status;
    const newStatusLabel = statusLabels[newStatus] || newStatus;

    if (window.confirm(`Are you sure you want to change the booking status from "${currentStatusLabel}" to "${newStatusLabel}"?`)) {
      updateStatusMutation.mutate({ bookingId: booking.id, status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'basic_wash': return 'bg-blue-100 text-blue-800';
      case 'full_detail': return 'bg-purple-100 text-purple-800';
      case 'interior_detail': return 'bg-green-100 text-green-800';
      case 'exterior_detail': return 'bg-orange-100 text-orange-800';
      case 'premium_detail': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!isOpen || !booking) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Booking #{booking.id}
                </h3>
                <p className="text-sm text-gray-500">
                  Created on {formatDate(booking.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getServiceTypeColor(booking.serviceType)}`}>
                  {booking.serviceType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{booking.customerName}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{booking.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Car Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Vehicle Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Make & Model</p>
                    <p className="text-gray-900">{booking.carMake} {booking.carModel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">License Plate</p>
                    <p className="text-gray-900 font-mono">{booking.carLicensePlate}</p>
                  </div>
                  {booking.carColor && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Color</p>
                      <p className="text-gray-900">{booking.carColor}</p>
                    </div>
                  )}
                  {booking.carYear && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Year</p>
                      <p className="text-gray-900">{booking.carYear}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Service Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Service Type</p>
                  <p className="text-gray-900">{booking.serviceType.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled Date</p>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(booking.scheduledDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(booking.scheduledTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Estimated Duration</p>
                  <p className="text-gray-900">{formatDuration(booking.estimatedDuration)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Amount</p>
                  <p className="text-gray-900 font-semibold flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatCurrency(booking.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
              </div>
            )}

            {/* Status Management */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Status Management</h4>
              <div className="flex flex-wrap gap-2">
                {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updateStatusMutation.isPending || booking.status === status}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      booking.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    } disabled:opacity-50`}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default BookingDetailModal; 