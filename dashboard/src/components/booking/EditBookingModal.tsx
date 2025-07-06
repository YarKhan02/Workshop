import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Clock, User, Car, FileText, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Portal from '../ui/Portal';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Car {
  id: number;
  make: string;
  model: string;
  licensePlate: string;
  year: number;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, booking }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customerId: '',
    carId: '',
    jobType: 'basic_wash',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: 60,
    status: 'pending',
    notes: '',
    totalAmount: 0
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingCars, setIsLoadingCars] = useState(false);

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        customerId: booking.customerId?.toString() || '',
        carId: booking.carId?.toString() || '',
        jobType: booking.serviceType || 'basic_wash',
        scheduledDate: booking.scheduledDate || '',
        scheduledTime: booking.scheduledTime || '',
        estimatedDuration: booking.estimatedDuration || 60,
        status: booking.status || 'pending',
        notes: booking.notes || '',
        totalAmount: booking.totalAmount || 0
      });
    }
  }, [booking]);

  // Fetch customers
  const fetchCustomers = async () => {
    if (customers.length > 0) return;
    
    setIsLoadingCustomers(true);
    try {
      const response = await fetch('http://localhost:5000/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Fetch cars
  const fetchCars = async () => {
    if (cars.length > 0) return;
    
    setIsLoadingCars(true);
    try {
      const response = await fetch('http://localhost:5000/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCars(data.cars || []);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoadingCars(false);
    }
  };

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch(`http://localhost:5000/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
      toast.success('Booking updated successfully');
      handleClose();
    },
    onError: (error) => {
      toast.error('Failed to update booking');
      console.error('Error updating booking:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.carId || !formData.scheduledDate || !formData.scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateBookingMutation.mutate({
      ...formData,
      customerId: parseInt(formData.customerId),
      carId: parseInt(formData.carId),
      estimatedDuration: parseInt(formData.estimatedDuration.toString()),
      totalAmount: parseFloat(formData.totalAmount.toString())
    });
  };

  const handleClose = () => {
    onClose();
  };

  const getServiceTypePrice = (serviceType: string) => {
    switch (serviceType) {
      case 'basic_wash': return 500;
      case 'full_detail': return 2000;
      case 'interior_detail': return 1200;
      case 'exterior_detail': return 800;
      case 'premium_detail': return 3000;
      default: return 500;
    }
  };

  const handleServiceTypeChange = (serviceType: string) => {
    setFormData(prev => ({
      ...prev,
      jobType: serviceType,
      totalAmount: getServiceTypePrice(serviceType)
    }));
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
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Customer *
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
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
                    {customer.firstName} {customer.lastName} - {customer.phone}
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
              value={formData.carId}
              onChange={(e) => setFormData(prev => ({ ...prev, carId: e.target.value }))}
              onFocus={fetchCars}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Car</option>
              {isLoadingCars ? (
                <option disabled>Loading cars...</option>
              ) : (
                cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year}) - {car.licensePlate}
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
              value={formData.jobType}
              onChange={(e) => handleServiceTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="basic_wash">Basic Wash - ₹500</option>
              <option value="exterior_detail">Exterior Detail - ₹800</option>
              <option value="interior_detail">Interior Detail - ₹1,200</option>
              <option value="full_detail">Full Detail - ₹2,000</option>
              <option value="premium_detail">Premium Detail - ₹3,000</option>
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
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Time *
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                min="30"
                max="480"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Amount (₹)
              </label>
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
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
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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