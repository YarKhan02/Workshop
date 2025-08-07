// ==================== ADD BOOKING MODAL COMPONENT ====================

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, User, Car as CarIcon, FileText, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI, serviceAPI, customerAPI } from '../../../api/booking';
import { useCarsByCustomer } from '../../../hooks/useCars';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';
import type { BookingCreateData } from '../../../api/booking';
import type { 
  AddBookingModalProps, 
  Customer, 
  Car, 
  Service
} from '../../../types';
import { formatCurrency } from '../../../utils/currency';

// ==================== COMPONENT ====================
const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    car_id: '',
    service: '',
    booking_date: '',
    estimated_duration_minutes: 60,
    customer_notes: '',
    quoted_price: 0,
    discount_amount: 0
  });

  // Availability state
  const [availabilityInfo, setAvailabilityInfo] = useState<{
    available_slots: number;
    total_slots: number;
  } | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // ==================== API QUERIES ====================
  
  // Fetch customers
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: customerAPI.getCustomerDetails,
    enabled: isOpen,
  });

  // Fetch customer cars
  const customerId = formData.customer_id || null;
  const { data: customerCars = [], isLoading: isLoadingCars } = useCarsByCustomer(customerId);
  
  // Debug log for cars
  useEffect(() => {
    if (customerId && customerCars.length > 0) {
      console.log(`Customer ${customerId} has ${customerCars.length} cars:`, customerCars);
    } else if (customerId && !isLoadingCars) {
      console.log(`Customer ${customerId} has no cars`);
    }
  }, [customerId, customerCars, isLoadingCars]);

  // Fetch services
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceAPI.getServices(),
    enabled: isOpen,
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
      estimated_duration_minutes: 60,
      customer_notes: '',
      quoted_price: 0,
      discount_amount: 0
    });
    setAvailabilityInfo(null);
  };

  const fetchAvailability = async (date: string) => {
    if (!date) {
      setAvailabilityInfo(null);
      return;
    }
    
    setIsLoadingAvailability(true);
    try {
      const response = await bookingAPI.getAvailabilityForDate(date);
      setAvailabilityInfo(response);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailabilityInfo(null);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // ==================== EVENT HANDLERS ====================
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Fetch availability when date changes
    if (field === 'booking_date' && value) {
      fetchAvailability(value);
    }

    // Update price when service is selected
    if (field === 'service' && value) {
      const selectedService = services.find((s: Service) => s.code === value);
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
      estimated_duration_minutes: formData.estimated_duration_minutes,
      customer_notes: formData.customer_notes,
      quoted_price: formData.quoted_price,
      discount_amount: formData.discount_amount
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

  // ==================== RENDER ====================
  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Appointment"
      subtitle="Book a workshop service appointment"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Customer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              <User className="inline-block w-4 h-4 mr-2" />
              Customer *
            </label>
            <select
              value={formData.customer_id}
              onChange={(e) => handleInputChange('customer_id', e.target.value)}
              className={cn("w-full px-4 py-3 border rounded-xl transition-all duration-300", theme.background, theme.textPrimary, theme.border)}
              required
              disabled={isLoadingCustomers}
            >
              <option value="">Select a customer...</option>
              {customers.map((customer: Customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} - {customer.phone_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              <CarIcon className="inline-block w-4 h-4 mr-2" />
              Vehicle *
            </label>
            <select
              value={formData.car_id}
              onChange={(e) => handleInputChange('car_id', e.target.value)}
              className={cn("w-full px-4 py-3 border rounded-xl transition-all duration-300", theme.background, theme.textPrimary, theme.border)}
              disabled={!formData.customer_id || isLoadingCars}
              required
            >
              <option value="">
                {!formData.customer_id 
                  ? "Select customer first..." 
                  : isLoadingCars 
                  ? "Loading vehicles..." 
                  : customerCars.length === 0 
                  ? "No vehicles found" 
                  : "Select vehicle..."
                }
              </option>
              {customerCars.map((car: Car) => (
                <option key={car.id} value={car.id}>
                  {`${car.make} ${car.model} (${car.license_plate})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Service & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              <FileText className="inline-block w-4 h-4 mr-2" />
              Service Type *
            </label>
            <select
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className={cn("w-full px-4 py-3 border rounded-xl transition-all duration-300", theme.background, theme.textPrimary, theme.border)}
              required
              disabled={isLoadingServices}
            >
              <option value="">Select service...</option>
              {services.map((service: Service) => (
                <option key={service.id} value={service.code}>
                  {service.name} - {formatCurrency(service.base_price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Service Date *
            </label>
            <ThemedInput
              type="date"
              value={formData.booking_date}
              onChange={(e) => handleInputChange('booking_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {/* Availability Display */}
            {formData.booking_date && (
              <div className="mt-2">
                {isLoadingAvailability ? (
                  <p className={cn("text-sm", theme.textSecondary)}>
                    Loading availability...
                  </p>
                ) : availabilityInfo ? (
                  <p className={cn("text-sm", 
                    availabilityInfo.available_slots > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {availabilityInfo.available_slots > 0 
                      ? `${availabilityInfo.available_slots} of ${availabilityInfo.total_slots} slots available`
                      : `Fully booked (${availabilityInfo.total_slots} total slots)`
                    }
                  </p>
                ) : (
                  <p className={cn("text-sm", theme.textSecondary)}>
                    No availability data
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Customer Notes
                </label>
                <textarea
                  value={formData.customer_notes}
                  onChange={(e) => handleInputChange('customer_notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                  placeholder="Special requests or service notes..."
                />
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
            disabled={createBookingMutation.isPending}
            variant="primary"
          >
            {createBookingMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  );
};

export default AddBookingModal;
