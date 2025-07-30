// ==================== REFACTORED EDIT JOB MODAL (EXAMPLE) ====================

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import type { Job, Customer, Car, User } from '../../types';
import { formatCurrency } from '../../utils/currency';

// Import themed components
import { 
  ThemedModal, 
  ThemedInput, 
  ThemedButton, 
  ThemedCard,
  useTheme,
  cn 
} from '../ui';

const jobSchema = z.object({
  customerId: z.number().min(1, 'Customer is required'),
  carId: z.number().min(1, 'Car is required'),
  assignedTo: z.number().optional(),
  jobType: z.enum(['basic_wash', 'full_detail', 'interior_detail', 'exterior_detail', 'premium_detail', 'custom']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  estimatedDuration: z.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  actualDuration: z.number().min(0, 'Duration must be positive').optional(),
  price: z.number().min(0, 'Price must be positive'),
  discount: z.number().min(0, 'Discount must be positive').optional(),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  materials: z.array(z.string()).optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface EditJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditJobModalRefactored: React.FC<EditJobModalProps> = ({
  job,
  isOpen,
  onClose
}) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { theme } = useTheme();
  
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
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
      totalPrice: 0,
      services: [],
      materials: [],
    }
  });

  const watchedCustomerId = watch('customerId');
  const watchedPrice = watch('price');
  const watchedDiscount = watch('discount') || 0;

  // Filter cars by selected customer
  const customerCars = cars.filter(car => car.customer_id === watchedCustomerId);

  // Calculate total price
  const totalPrice = watchedPrice - watchedDiscount;

  // Reset form when job changes
  useEffect(() => {
    if (job) {
      reset({
        customerId: Number(job.customerId),
        carId: Number(job.carId),
        assignedTo: job.assignedTo ? Number(job.assignedTo) : undefined,
        jobType: job.jobType,
        status: job.status,
        priority: job.priority,
        scheduledDate: new Date(job.scheduledDate).toISOString().slice(0, 16),
        estimatedDuration: job.estimatedDuration,
        actualDuration: job.actualDuration,
        price: job.price,
        discount: job.discount || 0,
        totalPrice: job.totalPrice,
        notes: job.notes || '',
        customerNotes: job.customerNotes || '',
        services: job.services || [],
        materials: job.materials || [],
      });
    }
  }, [job, reset]);

  const updateJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      if (!job) throw new Error('No job selected');
      
      const response = await fetch(`http://localhost:5000/api/jobs/${job.id}`, {
        method: 'PUT',
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
        throw new Error(errorData.error || 'Failed to update job');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobStats'] });
      toast.success('Job updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update job');
      console.error('Error updating job:', error);
    },
  });

  const onSubmit = async (data: JobFormData) => {
    await updateJobMutation.mutateAsync({
      ...data,
      totalPrice,
    });
  };

  if (!job) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Job #${job.id}`}
      size="xl"
      footer={
        <div className="flex gap-3">
          <ThemedButton variant="secondary" onClick={onClose}>
            Cancel
          </ThemedButton>
          <ThemedButton 
            variant="primary" 
            loading={isSubmitting}
            leftIcon={<Save size={16} />}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? 'Updating...' : 'Update Job'}
          </ThemedButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer and Car Selection */}
        <ThemedCard padding="md">
          <h3 className={cn('text-lg font-semibold mb-4', theme.textPrimary)}>
            Customer & Vehicle
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Customer *
              </label>
              <select
                {...register('customerId', { valueAsNumber: true })}
                className={cn(theme.components.input.base, theme.components.input.focus)}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className={cn('text-sm mt-1', theme.error)}>{errors.customerId.message}</p>
              )}
            </div>

            <div>
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Car *
              </label>
              <select
                {...register('carId', { valueAsNumber: true })}
                className={cn(
                  theme.components.input.base, 
                  theme.components.input.focus,
                  !watchedCustomerId && theme.components.input.disabled
                )}
                disabled={!watchedCustomerId}
              >
                <option value="">Select a car</option>
                {customerCars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.year} {car.make} {car.model} - {car.license_plate}
                  </option>
                ))}
              </select>
              {errors.carId && (
                <p className={cn('text-sm mt-1', theme.error)}>{errors.carId.message}</p>
              )}
            </div>
          </div>
        </ThemedCard>

        {/* Pricing Section */}
        <ThemedCard padding="md">
          <h3 className={cn('text-lg font-semibold mb-4', theme.textPrimary)}>
            Pricing
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ThemedInput
              label="Price"
              required
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />

            <ThemedInput
              label="Discount"
              type="number"
              step="0.01"
              helperText="Optional discount amount"
              {...register('discount', { valueAsNumber: true })}
            />

            <div>
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Total Price
              </label>
              <div className={cn(
                'w-full px-4 py-3 rounded-xl font-semibold text-lg',
                theme.success
              )}>
                {formatCurrency(totalPrice)}
              </div>
            </div>
          </div>
        </ThemedCard>

        {/* Job Details */}
        <ThemedCard padding="md">
          <h3 className={cn('text-lg font-semibold mb-4', theme.textPrimary)}>
            Job Details
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Job Type *
              </label>
              <select
                {...register('jobType')}
                className={cn(theme.components.input.base, theme.components.input.focus)}
              >
                <option value="basic_wash">Basic Wash</option>
                <option value="full_detail">Full Detail</option>
                <option value="interior_detail">Interior Detail</option>
                <option value="exterior_detail">Exterior Detail</option>
                <option value="premium_detail">Premium Detail</option>
                <option value="custom">Custom</option>
              </select>
              {errors.jobType && (
                <p className={cn('text-sm mt-1', theme.error)}>{errors.jobType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className={cn(theme.components.input.base, theme.components.input.focus)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                  Status
                </label>
                <select
                  {...register('status')}
                  className={cn(theme.components.input.base, theme.components.input.focus)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </ThemedCard>

        {/* Notes */}
        <ThemedCard padding="md">
          <h3 className={cn('text-lg font-semibold mb-4', theme.textPrimary)}>
            Notes
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Internal Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className={cn(theme.components.input.base, theme.components.input.focus)}
                placeholder="Internal notes for staff"
              />
            </div>

            <div>
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Customer Notes
              </label>
              <textarea
                {...register('customerNotes')}
                rows={3}
                className={cn(theme.components.input.base, theme.components.input.focus)}
                placeholder="Notes to share with customer"
              />
            </div>
          </div>
        </ThemedCard>
      </form>
    </ThemedModal>
  );
};

export default EditJobModalRefactored;
