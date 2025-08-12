import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { EditCarModalProps } from '../../../types';

// Use the form data type that matches what the API expects  
type CarFormData = {
  customer: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  vin?: string;
};
import { useUpdateCar } from '../../../hooks/useCars';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';

const carSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  license_plate: z.string().min(1, 'License plate is required'),
  vin: z.string().optional(),
});

const EditCarModal: React.FC<EditCarModalProps> = ({
  car,
  isOpen,
  onClose,
  onSave
}) => {
  const { theme } = useTheme();
  const updateCarMutation = useUpdateCar();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  // Reset form when car changes
  useEffect(() => {
    if (car) {
      reset({
        make: car.make,
        model: car.model,
        year: car.year,
        color: car.color,
        license_plate: car.license_plate,
        vin: car.vin || '',
      });
    }
  }, [car, reset]);

  const onSubmit = async (data: CarFormData) => {
    if (!car || !car.id) {
      console.error('Car or car ID is missing');
      toast.error('Unable to update car: missing car information');
      return;
    }

    console.log('Car ID:', car.id);
    
    try {
      if (onSave) {
        // Use external save function if provided
        await onSave(car.id, data);
      } else {
        // Use internal save logic
        await updateCarMutation.mutateAsync({
          carId: car.id,
          data: {
            make: data.make,
            model: data.model,
            year: data.year,
            color: data.color,
            license_plate: data.license_plate,
            vin: data.vin,
          }
        });
        toast.success('Car updated successfully');
      }
      onClose();
      reset();
    } catch (error) {
      if (!onSave) {
        toast.error('Failed to update car');
      }
      console.error('Error updating car:', error);
    }
  };

  if (!isOpen || !car || !car.id) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Vehicle"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                License Plate *
              </label>
              <ThemedInput
                type="text"
                {...register('license_plate')}
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
          </div>
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
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </ThemedButton>
            </div>
          </form>
        </ThemedModal>
  );
};

export default EditCarModal; 