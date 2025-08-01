import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCar } from '../../../hooks/useCars';
import { useCustomers } from '../../../hooks/useCustomers';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';
import type { AddCarModalProps, CarFormData } from '../../../types';

const carSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  license_plate: z.string().min(1, 'License plate is required'),
  vin: z.string().optional(),
  mileage: z.string().optional().transform((val) => val?.trim() || undefined),
  notes: z.string().optional(),
});

const AddCarModal: React.FC<AddCarModalProps> = ({
  isOpen,
  onClose,
  customerId
}) => {
  const { theme } = useTheme();
  const createCarMutation = useCreateCar();
  const { data: customers = [] } = useCustomers();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      customer_id: customerId || '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      license_plate: '',
      vin: '',
      mileage: undefined,
      notes: '',
    }
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      await createCarMutation.mutateAsync({
        customer_id: data.customer_id,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
        license_plate: data.license_plate,
        vin: data.vin,
        mileage: data.mileage,
      });
      toast.success('Vehicle added successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to add vehicle');
    }
  };

  if (!isOpen) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Vehicle"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Customer *
              </label>
              <select
                {...register('customer_id')}
                className={cn("w-full px-3 py-2 rounded-lg transition-all duration-300", theme.components.input.base)}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <p className="text-red-400 text-sm mt-1">{errors.customer_id.message}</p>
              )}
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Make *
              </label>
              <ThemedInput
                type="text"
                {...register('make')}
                placeholder="e.g., Toyota, Honda, Ford"
                error={errors.make?.message}
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Model *
              </label>
              <ThemedInput
                type="text"
                {...register('model')}
                placeholder="e.g., Camry, Civic, F-150"
                error={errors.model?.message}
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Year *
              </label>
              <ThemedInput
                type="number"
                {...register('year', { valueAsNumber: true })}
                placeholder="e.g., 2020"
                error={errors.year?.message}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Color *
              </label>
              <ThemedInput
                type="text"
                {...register('color')}
                placeholder="e.g., Red, Blue, Silver"
                error={errors.color?.message}
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                License Plate *
              </label>
              <ThemedInput
                type="text"
                {...register('license_plate')}
                placeholder="e.g., ABC-1234"
                error={errors.license_plate?.message}
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                VIN (Optional)
              </label>
              <ThemedInput
                type="text"
                {...register('vin')}
                placeholder="17-character VIN"
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Mileage (Optional)
              </label>
              <ThemedInput
                type="number"
                {...register('mileage')}
                placeholder="e.g., 50000"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className={cn("w-full px-3 py-2 rounded-lg resize-none", theme.components.input.base)}
            placeholder="Any additional notes about the car"
          />
        </div>

            <div className={cn("flex justify-end gap-3 mt-8 pt-6 border-t", theme.border)}>
              <ThemedButton
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </ThemedButton>
              <ThemedButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                <Car className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Adding Vehicle...' : 'Add Vehicle'}
              </ThemedButton>
            </div>
          </form>
        </ThemedModal>
  );
};

export default AddCarModal; 