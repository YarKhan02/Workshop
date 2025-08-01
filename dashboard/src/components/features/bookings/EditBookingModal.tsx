// ==================== EDIT BOOKING MODAL COMPONENT ====================

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, FileText, Banknote, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI, serviceAPI } from '../../../api/booking';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';
import type { 
  EditBookingModalProps,
  TimeSlot,
  Service 
} from '../../../types';
import { formatCurrency } from '../../../utils/currency';

// ==================== COMPONENT ====================

const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, booking }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // Form state
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

  // Loading states
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // ==================== API QUERIES ====================
  
  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceAPI.getServices(),
    enabled: isOpen,
  });

  // ==================== MUTATIONS ====================
  
  const updateBookingMutation = useMutation({
    mutationFn: async (updateData: any) => {
      return await bookingAPI.updateBooking(booking!.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Appointment updated successfully!');
      onClose();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update appointment';
      toast.error(errorMessage);
    },
  });

  // ==================== HELPER FUNCTIONS ====================
  
  const fetchTimeSlots = async (date: string) => {
    if (!date) return;
    
    setIsLoadingTimeSlots(true);
    try {
      const slots = await bookingAPI.getAvailableTimeSlots(date);
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
      toast.error('Failed to load available time slots');
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  // ==================== EVENT HANDLERS ====================
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Fetch time slots when date is changed
    if (field === 'scheduled_date' && value) {
      fetchTimeSlots(value);
    }

    // Update price when service is changed
    if (field === 'service' && value) {
      const selectedService = (services as Service[]).find((s: Service) => s.code === value);
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          quoted_price: selectedService.base_price,
          estimated_duration_minutes: selectedService.estimated_duration_minutes
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.service || !formData.scheduled_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updateData = {
      service: formData.service,
      scheduled_date: formData.scheduled_date,
      scheduled_time: formData.scheduled_time,
      time_slot: formData.time_slot,
      estimated_duration_minutes: formData.estimated_duration_minutes,
      status: formData.status,
      customer_notes: formData.customer_notes,
      staff_notes: formData.staff_notes,
      quoted_price: formData.quoted_price,
      discount_amount: formData.discount_amount
    };

    updateBookingMutation.mutate(updateData);
  };

  // ==================== EFFECTS ====================
  
  // Initialize form data when booking changes
  useEffect(() => {
    if (booking && isOpen) {
      setFormData({
        service: booking.serviceType || '',
        scheduled_date: booking.scheduledDate || '',
        scheduled_time: booking.scheduledTime || '',
        time_slot: '',
        estimated_duration_minutes: booking.estimatedDuration || 60,
        status: booking.status || 'pending',
        customer_notes: booking.customer_notes || '',
        staff_notes: '',
        quoted_price: booking.totalAmount || 0,
        discount_amount: 0
      });

      // Fetch time slots if date is available
      if (booking.scheduledDate) {
        fetchTimeSlots(booking.scheduledDate);
      }
    }
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  // ==================== RENDER ====================
  
  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Appointment"
      subtitle={`Modify appointment for ${booking.customerName}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Client Info (Read-only) */}
        <div className={cn("rounded-xl p-4 border", theme.background, theme.border)}>
          <h3 className={cn("text-lg font-semibold mb-3", theme.primary)}>Customer & Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={cn("font-medium", theme.textPrimary)}>{booking.customerName}</p>
              <p className={cn("text-sm", theme.textSecondary)}>{booking.customerPhone}</p>
            </div>
            <div>
              <p className={cn("font-medium", theme.textPrimary)}>{booking.carMake} {booking.carModel}</p>
              <p className={cn("text-sm", theme.textSecondary)}>{booking.carLicensePlate}</p>
            </div>
                </div>
              </div>

              {/* Service & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    Service Package *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    required
                  >
                    <option value="">Select service...</option>
                    {(services as Service[]).map((service: Service) => (
                      <option key={service.id} value={service.code}>
                        {service.name} - {formatCurrency(service.base_price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  >
                    <option value="pending">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Service</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="inline-block w-4 h-4 mr-2" />
                    Service Date *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="inline-block w-4 h-4 mr-2" />
                    Appointment Time
                  </label>
                  <select
                    value={formData.time_slot}
                    onChange={(e) => handleInputChange('time_slot', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    disabled={!formData.scheduled_date || isLoadingTimeSlots}
                  >
                    <option value="">
                      {isLoadingTimeSlots ? 'Loading slots...' : 'Select time slot...'}
                    </option>
                    {availableTimeSlots.map((slot: TimeSlot) => (
                      <option key={slot.id} value={slot.id} disabled={!slot.is_available}>
                        {slot.start_time} - {slot.end_time}
                        {!slot.is_available ? ' (Full)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Banknote className="inline-block w-4 h-4 mr-2" />
                    Service Amount
                  </label>
                  <input
                    type="number"
                    value={formData.quoted_price}
                    onChange={(e) => handleInputChange('quoted_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimated_duration_minutes}
                    onChange={(e) => handleInputChange('estimated_duration_minutes', parseInt(e.target.value) || 60)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Notes
                  </label>
                  <textarea
                    value={formData.customer_notes}
                    onChange={(e) => handleInputChange('customer_notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                    placeholder="Customer requests or service notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Staff Notes
                  </label>
                  <textarea
                    value={formData.staff_notes}
                    onChange={(e) => handleInputChange('staff_notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                    placeholder="Internal notes for service team..."
                  />
                </div>
              </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <ThemedButton
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </ThemedButton>
          <ThemedButton
            onClick={handleSubmit}
            disabled={updateBookingMutation.isPending}
            variant="primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateBookingMutation.isPending ? 'Updating...' : 'Save Changes'}
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  );
};

export default EditBookingModal;
