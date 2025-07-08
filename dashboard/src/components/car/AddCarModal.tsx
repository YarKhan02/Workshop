import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import type { Customer } from '../../types';
import Portal from '../ui/Portal';

const carSchema = z.object({
  customerId: z.number().min(1, 'Customer is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  vin: z.string().optional(),
  mileage: z.number().optional(),
  notes: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: number;
}

const AddCarModal: React.FC<AddCarModalProps> = ({
  isOpen,
  onClose,
  customerId
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

  const customers = Array.isArray(customersData) ? customersData : [];
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      customerId: customerId || 0,
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: '',
      vin: '',
      mileage: undefined,
      notes: '',
    }
  });

  const addCarMutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add car');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Car added successfully');
      onClose();
      reset();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add car');
      console.error('Error adding car:', error);
    },
  });

  const onSubmit = async (data: CarFormData) => {
    await addCarMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Add New Car</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {customer.first_name} {customer.last_name} ({customer.email})
                      </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    {...register('make')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Toyota, Honda, Ford"
                  />
                  {errors.make && (
                    <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    {...register('model')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Camry, Civic, F-150"
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2020"
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color *
                  </label>
                  <input
                    type="text"
                    {...register('color')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Red, Blue, Silver"
                  />
                  {errors.color && (
                    <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    {...register('licensePlate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., ABC-1234"
                  />
                  {errors.licensePlate && (
                    <p className="text-red-500 text-sm mt-1">{errors.licensePlate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VIN (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('vin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="17-character VIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mileage (Optional)
                  </label>
                  <input
                    type="number"
                    {...register('mileage', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes about the car"
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
                {isSubmitting ? 'Adding...' : 'Add Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default AddCarModal; 