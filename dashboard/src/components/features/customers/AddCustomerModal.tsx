import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCustomer } from '../../../hooks/useCustomers';
import { useTheme, cn, ThemedInput } from '../../ui';
import { FormModal } from '../../shared/FormModal';
import { FormFooter } from '../../shared/FormFooter';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z
    .string()
    .length(11, 'Phone number must be exactly 11 digits')
    .regex(/^03\d{9}$/, 'Phone number must start with 03 and be numeric'),
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
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
    }
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await createCustomerMutation.mutateAsync(data);
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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Elite Client"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <FormFooter
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Add Customer"
          submitIcon={<UserPlus className="w-4 h-4 mr-2" />}
        />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cn("block text-sm font-medium mb-1", theme.textSecondary)}>
            Full Name *
          </label>
          <ThemedInput
            type="text"
            {...register('name')}
            placeholder="Enter full name"
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
            Phone Number *
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
    </FormModal>
  );
};

export default AddCustomerModal; 