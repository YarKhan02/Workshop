import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { EditCustomerModalProps } from '../../../types';
import { Save } from 'lucide-react';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
});

type CustomerFormDataLocal = z.infer<typeof customerSchema>;

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSave
}) => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CustomerFormDataLocal>({
    resolver: zodResolver(customerSchema),
  });

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormDataLocal) => {
    if (customer) {
      try {
        await onSave(customer.id as string, data);
        onClose();
        reset();
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Customer"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Name *
            </label>
            <ThemedInput
              type="text"
              {...register('name')}
              placeholder="Enter name"
              error={errors.name?.message}
            />
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Email *
            </label>
            <ThemedInput
              type="email"
              {...register('email')}
              placeholder="Enter email address"
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
              Phone *
            </label>
            <ThemedInput
              type="tel"
              {...register('phone_number')}
              placeholder="Enter phone number"
              error={errors.phone_number?.message}
            />
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  );
};

export default EditCustomerModal; 