import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCar } from '../../../hooks/useCars';
import { useCustomers } from '../../../hooks/useCustomers';
import { useTheme, cn, ThemedInput } from '../../ui';
import { FormModal } from '../../shared/FormModal';
import { FormFooter } from '../../shared/FormFooter';
import type { AddCarModalProps } from '../../../types';

// Use the form data type that matches what the API expects
type CarFormData = {
  customer: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
};

const carSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  license_plate: z.string().min(1, 'License plate is required'),
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
      customer: customerId || '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      license_plate: '',
    }
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      console.log('Submitting car data:', data);
      await createCarMutation.mutateAsync(data);
      toast.success('Vehicle added successfully!');
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Vehicle"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <FormFooter
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Add Vehicle"
          submitIcon={<Car className="w-4 h-4 mr-2" />}
        />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Customer *
            </label>
            <select
              {...register('customer')}
              className={cn("w-full px-3 py-2 rounded-lg transition-all duration-300", theme.components.input.base)}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
            {errors.customer && (
              <p className="text-red-400 text-sm mt-1">{errors.customer.message}</p>
            )}
          </div>
          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Make *
            </label>
            <ThemedInput
              type="text"
              {...register('make', {
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
                }
              })}
              placeholder="e.g., Toyota, Honda, BMW"
              error={errors.make?.message}
            />
          </div>
          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Model *
            </label>
            <ThemedInput
              type="text"
              {...register('model', {
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
                }
              })}
              placeholder="e.g., Camry, Civic, X3"
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
              placeholder="e.g., 2023"
              error={errors.year?.message}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              License Plate *
            </label>
            <ThemedInput
              type="text"
              {...register('license_plate')}
              placeholder="e.g., ABC-123"
              error={errors.license_plate?.message}
              className="uppercase"
            />
          </div>
          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Color *
            </label>
            <ThemedInput
              type="text"
              {...register('color', {
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
                }
              })}
              placeholder="e.g., White, Black, Blue"
              error={errors.color?.message}
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AddCarModal; 