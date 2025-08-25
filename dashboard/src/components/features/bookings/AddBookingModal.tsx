// ==================== ADD BOOKING MODAL COMPONENT ====================

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../../../api/booking';
import { useTheme, cn, ThemedInput } from '../../ui';
import { FormModal } from '../../shared/FormModal';
import { FormFooter } from '../../shared/FormFooter';
import { 
  CustomerSelector, 
  CarSelector, 
  ServiceSelector, 
  DateSelector 
} from './form-components';
import type { BookingCreateData } from '../../../api/booking';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
}

// ==================== COMPONENT ====================
const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // Form state - only fields that exist in backend models
  const [formData, setFormData] = useState({
    customer_id: '',
    car_id: '',
    service: '',
    booking_date: '',
    special_instructions: '',  // This is the actual field in Booking model
    price: 0  // This maps to BookingService.price
  });

  // ==================== MUTATIONS ====================
  
  const createBookingMutation = useMutation({
    mutationFn: (bookingData: BookingCreateData) => bookingAPI.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Appointment scheduled successfully!');
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to schedule appointment';
      toast.error(errorMessage);
    },
  });

  // ==================== HELPER FUNCTIONS ====================
  
  const resetForm = () => {
    setFormData({
      customer_id: '',
      car_id: '',
      service: '',
      booking_date: '',
      special_instructions: '',
      price: 0
    });
  };

  // ==================== EVENT HANDLERS ====================
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (serviceId: string, serviceData?: Service) => {
    setFormData(prev => ({
      ...prev,
      service: serviceId,
      price: serviceData?.price || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customer_id || !formData.car_id || !formData.service || !formData.booking_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const bookingData: BookingCreateData = {
      customer: formData.customer_id,
      car: formData.car_id,
      service: formData.service,
      booking_date: formData.booking_date,
      special_instructions: formData.special_instructions,
      price: formData.price
    };

    createBookingMutation.mutate(bookingData);
  };

  // ==================== EFFECTS ====================
  
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Appointment"
      subtitle="Book a workshop service appointment"
      size="xl"
      onSubmit={handleSubmit}
      footer={
        <FormFooter
          onCancel={onClose}
          isSubmitting={createBookingMutation.isPending}
          submitLabel="Schedule Appointment"
        />
      }
    >
      <div className="space-y-6">
        {/* Customer and Car Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerSelector
            value={formData.customer_id}
            onChange={(customerId) => {
              handleInputChange('customer_id', customerId);
              // Reset car selection when customer changes
              if (formData.car_id) {
                handleInputChange('car_id', '');
              }
            }}
            required
          />
          <CarSelector
            customerId={formData.customer_id || null}
            value={formData.car_id}
            onChange={(carId) => handleInputChange('car_id', carId)}
            required
          />
        </div>

        {/* Service and Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceSelector
            value={formData.service}
            onChange={handleServiceChange}
            required
          />
          <DateSelector
            value={formData.booking_date}
            onChange={(date) => handleInputChange('booking_date', date)}
            required
          />
        </div>

        {/* Pricing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              <Banknote className="inline-block w-4 h-4 mr-2" />
              Service Price
            </label>
            <ThemedInput
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            <FileText className="inline-block w-4 h-4 mr-2" />
            Special Instructions
          </label>
          <textarea
            value={formData.special_instructions}
            onChange={(e) => handleInputChange('special_instructions', e.target.value)}
            rows={3}
            className={cn(
              "w-full px-4 py-3 border rounded-xl transition-all duration-300 resize-none",
              theme.background,
              theme.textPrimary,
              theme.border
            )}
            placeholder="Special requests or service notes..."
          />
        </div>
      </div>
    </FormModal>
  );
};

export default AddBookingModal;
