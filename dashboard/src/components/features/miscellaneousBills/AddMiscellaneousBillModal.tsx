import React, { useState } from 'react';
import { FileText, Plus, Coins } from 'lucide-react';
import { useCreateMiscellaneousBill } from '../../../hooks';
import { useTheme, cn, ThemedInput } from '../../ui';
import { FormModal } from '../../shared/FormModal';
import { FormFooter } from '../../shared/FormFooter';
import type { AddMiscellaneousBillModalProps, MiscellaneousBillCreateData } from '../../../types';
import { validateBillData } from '../../../utils/miscellaneousBillUtils';

const AddMiscellaneousBillModal: React.FC<AddMiscellaneousBillModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const createBillMutation = useCreateMiscellaneousBill();

  const [formData, setFormData] = useState<MiscellaneousBillCreateData>({
    title: '',
    category: 'other',
    amount: 0,
    description: '',
    paid_on: new Date().toISOString().split('T')[0], // Today's date as default
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleInputChange = (field: keyof MiscellaneousBillCreateData, value: string | number) => {
    let newValue = value;
    if (field === 'title' && typeof value === 'string') {
      newValue = capitalizeFirst(value);
    }
    setFormData(prev => ({ ...prev, [field]: newValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'other',
      amount: 0,
      description: '',
      paid_on: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    const validation = validateBillData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await createBillMutation.mutateAsync(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Bill"
      subtitle="Create a miscellaneous bill record"
      size="lg"
      onSubmit={handleSubmit}
      footer={
        <FormFooter
          onCancel={handleClose}
          isSubmitting={createBillMutation.isPending}
          submitLabel={createBillMutation.isPending ? 'Creating...' : 'Create Bill'}
          submitIcon={createBillMutation.isPending ? undefined : <Plus className="w-4 h-4 mr-2" />}
        />
      }
    >
      <div className="space-y-6">
        {/* Bill Title */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            <FileText className="inline-block w-4 h-4 mr-2" />
            Bill Title <span className="text-red-400">*</span>
          </label>
          <ThemedInput
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Electricity Bill, Tea/Chai"
            className={cn(errors.title && "border-red-400")}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={cn(
              "w-full px-4 py-3 border rounded-xl transition-all duration-300",
              theme.background,
              theme.textPrimary,
              theme.border,
              "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              errors.category && "border-red-400"
            )}
          >
            <option value="chai">Chai</option>
            <option value="electricity">Electricity</option>
            <option value="aws">AWS</option>
            <option value="internet">Internet</option>
            <option value="rent">Rent</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            <Coins className="inline-block w-4 h-4 mr-2" />
            Amount (PKR) <span className="text-red-400">*</span>
          </label>
          <ThemedInput
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={cn(errors.amount && "border-red-400")}
          />
          {errors.amount && (
            <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Date Paid */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Date Paid <span className="text-red-400">*</span>
          </label>
          <ThemedInput
            type="date"
            value={formData.paid_on}
            onChange={(e) => handleInputChange('paid_on', e.target.value)}
            className={cn(errors.paid_on && "border-red-400")}
          />
          {errors.paid_on && (
            <p className="text-red-400 text-sm mt-1">{errors.paid_on}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Additional details about this bill..."
            rows={3}
            className={cn(
              "w-full px-4 py-3 border rounded-xl transition-all duration-300 resize-none",
              theme.background,
              theme.textPrimary,
              theme.border,
              "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              errors.description && "border-red-400"
            )}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
          <p className={cn("text-xs mt-1", theme.textSecondary)}>
            {formData.description?.length || 0}/500 characters
          </p>
        </div>
      </div>
    </FormModal>
  );
};

export default AddMiscellaneousBillModal;
