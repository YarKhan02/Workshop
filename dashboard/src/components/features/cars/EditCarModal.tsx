import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { EditCarModalProps, CarFormData } from '../../../types';
import { useUpdateCar } from '../../../hooks/useCars';
import Portal from '../../shared/utility/Portal';

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
    if (!car) return;
    
    try {
      if (onSave) {
        // Use external save function if provided
        await onSave(car.id, data);
      } else {
        // Use internal save logic
        await updateCarMutation.mutateAsync({
          carId: parseInt(car.id),
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

  if (!isOpen || !car) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Modify Racing Machine
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    {...register('make')}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="e.g., Toyota, Honda, Ford"
                  />
                  {errors.make && (
                    <p className="text-red-400 text-sm mt-1">{errors.make.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    {...register('model')}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="e.g., Camry, Civic, F-150"
                  />
                  {errors.model && (
                    <p className="text-red-400 text-sm mt-1">{errors.model.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="e.g., 2020"
                  />
                  {errors.year && (
                    <p className="text-red-400 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color *
                  </label>
                  <input
                    type="text"
                    {...register('color')}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="e.g., Red, Blue, Silver"
                  />
                  {errors.color && (
                    <p className="text-red-400 text-sm mt-1">{errors.color.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    {...register('license_plate')}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="e.g., ABC-1234"
                  />
                  {errors.license_plate && (
                    <p className="text-red-400 text-sm mt-1">{errors.license_plate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    VIN (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('vin')}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    placeholder="17-character VIN"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-600/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default EditCarModal; 