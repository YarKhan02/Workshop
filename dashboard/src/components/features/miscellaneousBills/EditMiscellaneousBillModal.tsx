import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Save } from 'lucide-react';
import { useUpdateMiscellaneousBill } from '../../../hooks';
import { useTheme, cn, ThemedInput } from '../../ui';
import { FormModal } from '../../shared/FormModal';
import { FormFooter } from '../../shared/FormFooter';
import type { EditMiscellaneousBillModalProps, MiscellaneousBillUpdateData } from '../../../types';
import { validateBillData } from '../../../utils/miscellaneousBillUtils';

const EditMiscellaneousBillModal: React.FC<EditMiscellaneousBillModalProps> = ({
  isOpen,
  onClose,
  bill,
}) => {
  const { theme } = useTheme();
  const updateBillMutation = useUpdateMiscellaneousBill();

  const [formData, setFormData] = useState<MiscellaneousBillUpdateData>({
    title: '',
    category: 'other',
    amount: 0,
    description: '',
    paid_on: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data when bill changes
  useEffect(() => {
    if (bill && isOpen) {
      setFormData({
        title: bill.title,
        category: bill.category,
        amount: bill.amount,
        description: bill.description || '',
        paid_on: bill.paid_on,
      });
      setErrors({});
    }
  }, [bill, isOpen]);

  const handleInputChange = (field: keyof MiscellaneousBillUpdateData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific error when user starts typing
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
      paid_on: '',
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!bill) return;

    const validation = validateBillData(formData as { title: string; amount: number; description?: string });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await updateBillMutation.mutateAsync({
        billId: bill.id,
        billData: formData,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !bill) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Bill"
      subtitle={`Update "${bill.title}" details`}
      size="lg"
      onSubmit={handleSubmit}
      footer={
        <FormFooter
          onCancel={handleClose}
          isSubmitting={updateBillMutation.isPending}
          submitLabel={updateBillMutation.isPending ? 'Updating...' : 'Update Bill'}
          submitIcon={updateBillMutation.isPending ? undefined : <Save className="w-4 h-4 mr-2" />}
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
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Electricity Bill, Tea/Chai, Office Supplies"
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
            value={formData.category || 'other'}
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
            <DollarSign className="inline-block w-4 h-4 mr-2" />
            Amount (PKR) <span className="text-red-400">*</span>
          </label>
          <ThemedInput
            type="number"
            value={formData.amount || 0}
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
            value={formData.paid_on || ''}
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
            value={formData.description || ''}
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
            {(formData.description?.length || 0)}/500 characters
          </p>
        </div>
      </div>
    </FormModal>
  );
};

export default EditMiscellaneousBillModal;
