import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import type { Customer, Car, User } from '../../types';
import Portal from '../shared/utility/Portal';

const jobSchema = z.object({
  customerId: z.number().min(1, 'Customer is required'),
  carId: z.number().min(1, 'Car is required'),
  assignedTo: z.number().optional(),
  jobType: z.enum(['basic_wash', 'full_detail', 'interior_detail', 'exterior_detail', 'premium_detail', 'custom']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  estimatedDuration: z.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  price: z.number().min(0, 'Price must be positive'),
  discount: z.number().min(0, 'Discount must be positive').optional(),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  materials: z.array(z.string()).optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose
}) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  // Fetch customers for the dropdown
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Customer[]> => {
      const response = await fetch('http://localhost:5000/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      return data.customers || [];
    },
    enabled: !!token,
  });

  // Fetch cars for the dropdown
  const { data: carsData } = useQuery({
    queryKey: ['cars'],
    queryFn: async (): Promise<Car[]> => {
      const response = await fetch('http://localhost:5000/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      return data.cars || [];
    },
    enabled: !!token,
  });

  // Fetch staff for assignment
  const { data: staffData } = useQuery({
    queryKey: ['staff'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('http://localhost:5000/api/auth/staff', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      return response.json();
    },
    enabled: !!token,
  });

  const customers = Array.isArray(customersData) ? customersData : [];
  const cars = Array.isArray(carsData) ? carsData : [];
  const staff = Array.isArray(staffData) ? staffData : [];

  // Service options
  const serviceOptions = [
    'Exterior Wash',
    'Interior Vacuum',
    'Window Cleaning',
    'Tire Dressing',
    'Wheel Cleaning',
    'Paint Protection',
    'Interior Detailing',
    'Engine Bay Cleaning',
    'Headlight Restoration',
    'Clay Bar Treatment',
    'Paint Correction',
    'Ceramic Coating',
  ];

  // Material options
  const materialOptions = [
    'Car Wash Soap',
    'Wax',
    'Tire Dressing',
    'Glass Cleaner',
    'Interior Cleaner',
    'Clay Bar',
    'Polish',
    'Ceramic Coating',
    'Microfiber Towels',
    'Brushes',
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      customerId: 0,
      carId: 0,
      jobType: 'basic_wash',
      status: 'pending',
      priority: 'medium',
      scheduledDate: new Date().toISOString().slice(0, 16),
      estimatedDuration: 60,
      price: 0,
      discount: 0,
      services: [],
      materials: [],
    }
  });

  const watchedCustomerId = watch('customerId');
  const watchedPrice = watch('price');
  const watchedDiscount = watch('discount') || 0;

  // Filter cars by selected customer
  const customerCars = cars.filter(car => car.customerId === watchedCustomerId);

  // Calculate total price
  const totalPrice = watchedPrice - watchedDiscount;

  const addJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          totalPrice,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add job');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobStats'] });
      toast.success('Job added successfully');
      onClose();
      reset();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add job');
      console.error('Error adding job:', error);
    },
  });

  const onSubmit = async (data: JobFormData) => {
    await addJobMutation.mutateAsync({
      ...data,
      totalPrice,
    });
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer and Car Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer *
                </label>
                <select
                  {...register('customerId', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car *
                </label>
                <select
                  {...register('carId', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!watchedCustomerId}
                >
                  <option value="">Select a car</option>
                  {customerCars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.year} {car.make} {car.model} - {car.licensePlate}
                    </option>
                  ))}
                </select>
                {errors.carId && (
                  <p className="text-red-500 text-sm mt-1">{errors.carId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To (Optional)
                </label>
                <select
                  {...register('assignedTo', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  {...register('jobType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="basic_wash">Basic Wash</option>
                  <option value="full_detail">Full Detail</option>
                  <option value="interior_detail">Interior Detail</option>
                  <option value="exterior_detail">Exterior Detail</option>
                  <option value="premium_detail">Premium Detail</option>
                  <option value="custom">Custom</option>
                </select>
                {errors.jobType && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule and Duration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('scheduledDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.scheduledDate && (
                <p className="text-red-500 text-sm mt-1">{errors.scheduledDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (minutes) *
              </label>
              <input
                type="number"
                {...register('estimatedDuration', { valueAsNumber: true })}
                min="15"
                max="480"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.estimatedDuration && (
                <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration.message}</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('discount', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Price
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                ${totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceOptions.map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={service}
                    {...register('services')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="text-red-500 text-sm mt-1">{errors.services.message}</p>
            )}
          </div>

          {/* Materials */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {materialOptions.map((material) => (
                <label key={material} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={material}
                    {...register('materials')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internal Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Internal notes for staff"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Notes
            </label>
            <textarea
              {...register('customerNotes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes to share with customer"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSubmitting ? 'Adding...' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
};

export default AddJobModal; 