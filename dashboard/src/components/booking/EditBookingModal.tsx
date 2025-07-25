import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Clock, User, FileText, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI, serviceAPI } from '../../api/booking';
import Portal from '../ui/Portal';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, booking }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    service: '',
    scheduled_date: '',
    scheduled_time: '',
    time_slot: '',
    estimated_duration_minutes: 60,
    status: 'pending',
    customer_notes: '',
    staff_notes: '',
    quoted_price: 0,
    discount_amount: 0
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        service: booking.serviceType || booking.service || '',
        scheduled_date: booking.scheduledDate || booking.scheduled_date || '',
        scheduled_time: booking.scheduledTime || booking.scheduled_time || '',
        time_slot: booking.time_slot || '',
        estimated_duration_minutes: booking.estimatedDuration || booking.estimated_duration_minutes || 60,
        status: booking.status || 'pending',
        customer_notes: booking.customerNotes || booking.customer_notes || '',
        staff_notes: booking.staffNotes || booking.staff_notes || '',
        quoted_price: booking.totalAmount || booking.quoted_price || booking.final_price || 0,
        discount_amount: booking.discountAmount || booking.discount_amount || 0
      });
      
      // Fetch time slots for the current booking date
      if (booking.scheduledDate || booking.scheduled_date) {
        fetchTimeSlots(booking.scheduledDate || booking.scheduled_date);
      }
    }
  }, [booking]);

  // Fetch services
  const { data: servicesData = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceAPI.getServices(),
    staleTime: 1000 * 60 * 10,
  });

  // Fetch available time slots when date changes
  const fetchTimeSlots = async (date: string) => {
    if (!date) return;
    
    setIsLoadingTimeSlots(true);
    try {
      // Pass the current booking ID to exclude it from availability check
      const data = await bookingAPI.getAvailableTimeSlots(date, booking?.id);
      setAvailableTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await bookingAPI.updateBooking(booking.id, bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Booking updated successfully');
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update booking');
      console.error('Error updating booking:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.scheduled_date || !formData.scheduled_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Only send fields that have changed or are not empty
    const updateData: any = {};
    
    // Only include service if it's actually selected and different from original
    if (formData.service && formData.service !== booking?.serviceType) {
      updateData.service = formData.service;
    }
    
    if (formData.scheduled_date) updateData.scheduled_date = formData.scheduled_date;
    if (formData.scheduled_time) updateData.scheduled_time = formData.scheduled_time;
    if (formData.time_slot) updateData.time_slot = formData.time_slot;
    if (formData.estimated_duration_minutes) updateData.estimated_duration_minutes = formData.estimated_duration_minutes;
    if (formData.status) updateData.status = formData.status;
    updateData.customer_notes = formData.customer_notes;
    updateData.staff_notes = formData.staff_notes;
    updateData.quoted_price = formData.quoted_price;
    updateData.discount_amount = formData.discount_amount;

    console.log('Sending update data:', updateData);
    updateBookingMutation.mutate(updateData);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !booking) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Booking #{booking.id}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information (Read Only) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer & Vehicle Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <p className="text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2">
                  {booking?.customerName || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <p className="text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2">
                  {booking?.carMake} {booking?.carModel} - {booking?.carLicensePlate}
                </p>
              </div>
            </div>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Service Type *
            </label>
            <select
              value={formData.service}
              onChange={(e) => {
                const selectedService = servicesData.find((s: any) => s.code === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  service: e.target.value,
                  quoted_price: selectedService?.base_price || 0,
                  estimated_duration_minutes: selectedService?.estimated_duration_minutes || 60
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Service</option>
              {servicesData.map((service: any) => (
                <option key={service.id} value={service.code}>
                  {service.name} - ₹{service.base_price}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, scheduled_date: e.target.value }));
                  if (e.target.value) {
                    fetchTimeSlots(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Time *
              </label>
              <select
                value={formData.time_slot}
                onChange={(e) => {
                  const selectedSlot = availableTimeSlots.find(slot => slot.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    time_slot: e.target.value,
                    scheduled_time: selectedSlot?.start_time || ''
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Time Slot</option>
                {/* Show current booking's time slot even if not available */}
                {booking?.time_slot && !availableTimeSlots.find(slot => slot.id === booking.time_slot) && (
                  <option key={booking.time_slot} value={booking.time_slot}>
                    {formData.scheduled_time ? 
                      new Date(`2000-01-01T${formData.scheduled_time}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) + ' (Current)'
                      : 'Current Time Slot'
                    }
                  </option>
                )}
                {/* Show all available time slots */}
                {availableTimeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                    {slot.id === booking?.time_slot ? ' (Current)' : ''}
                  </option>
                ))}
              </select>
              {isLoadingTimeSlots && (
                <p className="text-sm text-gray-500 mt-1">Loading available time slots...</p>
              )}
              {!isLoadingTimeSlots && availableTimeSlots.length === 0 && formData.scheduled_date && (
                <p className="text-sm text-amber-600 mt-1">No available time slots for this date. Creating new slot.</p>
              )}
            </div>
          </div>

          {/* Status, Duration and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Duration (min)
              </label>
              <input
                type="number"
                value={formData.estimated_duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration_minutes: parseInt(e.target.value) || 60 }))}
                min="30"
                max="480"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Quoted Price (₹)
              </label>
              <input
                type="number"
                value={formData.quoted_price}
                onChange={(e) => setFormData(prev => ({ ...prev, quoted_price: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Discount Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Discount Amount (₹)
            </label>
            <input
              type="number"
              value={formData.discount_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: parseFloat(e.target.value) || 0 }))}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Customer Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Customer Notes
            </label>
            <textarea
              value={formData.customer_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Customer requirements or special instructions..."
            />
          </div>

          {/* Staff Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Staff Notes
            </label>
            <textarea
              value={formData.staff_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, staff_notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Internal notes, observations, or instructions..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateBookingMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateBookingMutation.isPending ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
};

export default EditBookingModal; 