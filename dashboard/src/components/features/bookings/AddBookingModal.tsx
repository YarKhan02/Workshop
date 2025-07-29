// ==================== ADD BOOKING MODAL COMPONENT ====================

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Clock, User, Car as CarIcon, FileText, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI, serviceAPI, customerAPI } from '../../../api/booking';
import { useCarsByCustomer } from '../../../hooks/useCars';
import type { BookingCreateData } from '../../../api/booking';
import type { 
  AddBookingModalProps, 
  Customer, 
  Car, 
  Service, 
  TimeSlot 
} from '../../../types';
import Portal from '../../shared/utility/Portal';

// ==================== COMPONENT ====================
const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    customer_id: '',
    car_id: '',
    service: '',
    scheduled_date: '',
    time_slot: '',
    estimated_duration_minutes: 60,
    customer_notes: '',
    quoted_price: 0,
    discount_amount: 0
  });

  // Loading states
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

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
      toast.success('🔧 Appointment scheduled successfully!');
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
      scheduled_date: '',
      time_slot: '',
      estimated_duration_minutes: 60,
      customer_notes: '',
      quoted_price: 0,
      discount_amount: 0
    });
    setAvailableTimeSlots([]);
  };

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

    // Fetch time slots when date is selected
    if (field === 'scheduled_date' && value) {
      fetchTimeSlots(value);
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
    if (!formData.customer_id || !formData.car_id || !formData.service || !formData.scheduled_date || !formData.time_slot) {
      toast.error('Please fill in all required fields');
      return;
    }

    const bookingData: BookingCreateData = {
      customer: formData.customer_id,
      car: formData.car_id,
      service: formData.service,
      scheduled_date: formData.scheduled_date,
      time_slot: formData.time_slot,
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
    <Portal>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 rounded-2xl shadow-2xl border border-gray-700/30 backdrop-blur-md w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Schedule New Appointment
              </h2>
              <p className="text-gray-400 mt-1">Book a workshop service appointment</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors text-gray-400 hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Customer *
                  </label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => handleInputChange('customer_id', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <CarIcon className="inline-block w-4 h-4 mr-2" />
                    Vehicle *
                  </label>
                  <select
                    value={formData.car_id}
                    onChange={(e) => handleInputChange('car_id', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
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
                        {car.display_name || `${car.make} ${car.model} (${car.license_plate})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    Service Type *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    required
                    disabled={isLoadingServices}
                  >
                    <option value="">Select service...</option>
                    {services.map((service: Service) => (
                      <option key={service.id} value={service.code}>
                        {service.name} - ${service.base_price}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                  Appointment Time *
                </label>
                <select
                  value={formData.time_slot}
                  onChange={(e) => handleInputChange('time_slot', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  required
                  disabled={!formData.scheduled_date || isLoadingTimeSlots}
                >
                  <option value="">
                    {isLoadingTimeSlots ? 'Loading slots...' : 'Select time slot...'}
                  </option>
                  {availableTimeSlots.map((slot: TimeSlot) => (
                    <option key={slot.id} value={slot.id} disabled={!slot.is_available}>
                      {slot.start_time} - {slot.end_time} 
                      {(slot.available_slots ?? 0) > 0 ? ` (${slot.available_slots} available)` : ' (Full)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <DollarSign className="inline-block w-4 h-4 mr-2" />
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

            </form>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-6 border-t border-gray-700/30">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createBookingMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 disabled:opacity-50"
            >
              {createBookingMutation.isPending ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>

        </div>
      </div>
    </Portal>
  );
};

export default AddBookingModal;
