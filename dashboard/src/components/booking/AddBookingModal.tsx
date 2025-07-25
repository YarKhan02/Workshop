import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Clock, User, Car, FileText, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI, serviceAPI } from '../../api/booking';
import type { BookingCreateData } from '../../api/booking';
import Portal from '../ui/Portal';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

interface Car {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  year: number;
  display_name: string;
}

interface Service {
  id: string;
  name: string;
  code: string;
  category: string;
  base_price: number;
  estimated_duration_minutes: number;
}

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  is_available: boolean;
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customer: '',
    car: '',
    service_code: 'basic_wash',
    scheduled_date: '',
    scheduled_time: '',
    estimated_duration_minutes: 60,
    customer_notes: '',
    quoted_price: 500
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // Fetch customers from API
  const fetchCustomers = async () => {
    if (customers.length > 0) return;
    
    setIsLoadingCustomers(true);
    try {
      const response = await fetch('http://localhost:8000/customers/details/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomers(data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Fetch cars for selected customer
  const fetchCarsForCustomer = async (customerId: string) => {
    if (!customerId) {
      setCars([]);
      return;
    }
    
    setIsLoadingCars(true);
    try {
      const response = await bookingAPI.getCustomerCars(customerId);
      setCars(response.cars || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load cars for customer');
      setCars([]);
    } finally {
      setIsLoadingCars(false);
    }
  };

  // Fetch services
  const fetchServices = async () => {
    if (services.length > 0) return;
    
    setIsLoadingServices(true);
    try {
      const response = await serviceAPI.getServices();
      setServices(response || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Fetch available time slots for selected date
  const fetchAvailableTimeSlots = async (selectedDate: string) => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }
    
    setIsLoadingTimeSlots(true);
    try {
      const response = await fetch(`http://localhost:8000/bookings/available-slots/?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data || []);
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load available time slots');
      setTimeSlots([]);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (bookingData: BookingCreateData) => bookingAPI.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Booking created successfully');
      handleClose();
    },
    onError: (error: any) => {
      console.error('Booking creation error:', error);
      
      // Extract error message from different possible error structures
      let errorMessage = 'Failed to create booking';
      
      if (error?.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else {
          // Try to extract field-specific errors
          const fieldErrors = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer || !formData.car || !formData.scheduled_date || !formData.scheduled_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Log the data being sent for debugging
    console.log('Creating booking with data:', formData);
    
    createBookingMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      customer: '',
      car: '',
      service_code: 'basic_wash',
      scheduled_date: '',
      scheduled_time: '',
      estimated_duration_minutes: 60,
      customer_notes: '',
      quoted_price: 500
    });
    setCars([]); // Clear cars when closing
    setTimeSlots([]); // Clear time slots when closing
    onClose();
  };

  // Handle customer selection
  const handleCustomerChange = (customerId: string) => {
    setFormData(prev => ({ ...prev, customer: customerId, car: '' })); // Reset car selection
    if (customerId) {
      fetchCarsForCustomer(customerId);
    } else {
      setCars([]);
    }
  };

  // Handle date selection and fetch available time slots
  const handleDateChange = (selectedDate: string) => {
    setFormData(prev => ({ ...prev, scheduled_date: selectedDate, scheduled_time: '' })); // Reset time selection
    if (selectedDate) {
      fetchAvailableTimeSlots(selectedDate);
    } else {
      setTimeSlots([]);
    }
  };

  // Handle service change and update price
  const handleServiceChange = (serviceCode: string) => {
    const selectedService = services.find(s => s.code === serviceCode);
    setFormData(prev => ({
      ...prev,
      service_code: serviceCode,
      quoted_price: selectedService?.base_price || 500,
      estimated_duration_minutes: selectedService?.estimated_duration_minutes || 60
    }));
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">New Booking</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Customer *
            </label>
            <select
              value={formData.customer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              onFocus={fetchCustomers}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Customer</option>
              {isLoadingCustomers ? (
                <option disabled>Loading customers...</option>
              ) : (
                customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} - {customer.phone_number}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Car Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car className="inline w-4 h-4 mr-1" />
              Car *
            </label>
            <select
              value={formData.car}
              onChange={(e) => setFormData(prev => ({ ...prev, car: e.target.value }))}
              disabled={!formData.customer}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              required
            >
              <option value="">Select Car</option>
              {isLoadingCars ? (
                <option disabled>Loading cars...</option>
              ) : (
                cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.display_name || `${car.make} ${car.model} (${car.year}) - ${car.license_plate}`}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Service Type *
            </label>
            <select
              value={formData.service_code}
              onChange={(e) => handleServiceChange(e.target.value)}
              onFocus={fetchServices}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {isLoadingServices ? (
                <option disabled>Loading services...</option>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <option key={service.id} value={service.code}>
                    {service.name} - Rs. {service.base_price}
                  </option>
                ))
              ) : (
                <>
                  <option value="basic_wash">Basic Wash - Rs. 500</option>
                  <option value="exterior_detail">Exterior Detail - Rs. 800</option>
                  <option value="interior_detail">Interior Detail - Rs. 1,200</option>
                  <option value="full_detail">Full Detail - Rs. 2,000</option>
                  <option value="premium_detail">Premium Detail - Rs. 3,000</option>
                </>
              )}
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
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Available Time Slots *
              </label>
              <select
                value={formData.scheduled_time}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                disabled={!formData.scheduled_date}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                required
              >
                <option value="">Select Time Slot</option>
                {!formData.scheduled_date ? (
                  <option disabled>Please select a date first</option>
                ) : isLoadingTimeSlots ? (
                  <option disabled>Loading time slots...</option>
                ) : timeSlots.length === 0 ? (
                  <option disabled>No available time slots for this date</option>
                ) : (
                  timeSlots.map((slot) => {
                    // Convert 24-hour time to 12-hour format for display
                    const formatTime = (time24: string) => {
                      const [hours, minutes] = time24.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const hour12 = hour % 12 || 12;
                      return `${hour12}:${minutes} ${ampm}`;
                    };
                    
                    return (
                      <option key={slot.id} value={slot.start_time}>
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)} ({slot.available_slots} slot{slot.available_slots !== 1 ? 's' : ''} available)
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>

          {/* Duration and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Estimated Duration (minutes)
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
                Total Amount (Rs.)
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Notes
            </label>
            <textarea
              value={formData.customer_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special instructions or notes..."
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
              disabled={createBookingMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createBookingMutation.isPending ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
};

export default AddBookingModal; 