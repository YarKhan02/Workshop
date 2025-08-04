import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCustomer } from '../../../hooks/useCustomers';
import { formatNIC, stripNicDashes } from '../../../helper/nicFormatter';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';

const customerSchema = z.object({
  nic: z
    .string()
    .length(13, 'NIC must be exactly 13 digits')
    .regex(/^\d+$/, 'NIC must be numeric'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z
    .string()
    .length(11, 'Phone number must be exactly 11 digits')
    .regex(/^03\d{9}$/, 'Phone number must start with 03 and be numeric'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { theme } = useTheme();
  const createCustomerMutation = useCreateCustomer();
  const [nicDisplay, setNicDisplay] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nic: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
    }
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const cleanData = {
        ...data,
        nic: stripNicDashes(nicDisplay),
        city: data.city || undefined,
        state: data.state || undefined,
      };

      await createCustomerMutation.mutateAsync(cleanData);
      toast.success('Customer added successfully');
      onClose();
      reset();
    } catch (error) {
      toast.error('Failed to add customer');
      console.error('Error adding customer:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Elite Client"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                NIC *
              </label>
              <ThemedInput
                type="text"
                value={formatNIC(nicDisplay)}
                onChange={(e) => {
                  const cleanValue = stripNicDashes(e.target.value);
                  setNicDisplay(cleanValue);
                  setValue('nic', cleanValue);
                }}
                placeholder="Enter NIC without dashes"
                error={errors.nic?.message}
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                First Name *
              </label>
              <ThemedInput
                type="text"
                {...register('first_name')}
                placeholder="Enter first name"
                error={errors.first_name?.message}
              />
            </div>

            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Last Name *
              </label>
              <ThemedInput
                type="text"
                {...register('last_name')}
                placeholder="Enter last name"
                error={errors.last_name?.message}
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
                maxLength={11}
                {...register('phone_number')}
                placeholder="03XXXXXXXXX"
                error={errors.phone_number?.message}
              />
            </div>
              </div>

          <div className="space-y-4">
            <div>
              <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                Address *
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className={cn("w-full px-3 py-2 rounded-lg", theme.components.input.base)}
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                  City
                </label>
                <ThemedInput
                  type="text"
                  {...register('city')}
                  placeholder="City"
                />
              </div>
              <div>
                <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
                  State
                </label>
                <ThemedInput
                  type="text"
                  {...register('state')}
                  placeholder="State"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-600/30">
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
                        <UserPlus className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Adding...' : 'Add Customer'}
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  );
};

export default AddCustomerModal; 