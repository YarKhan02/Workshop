import React, { useState, useEffect } from 'react';
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from '../../ui';
import { useUpdateInvoice } from '../../../hooks/useBilling';
import type { 
  Invoice, 
  InvoiceItem, 
  InvoiceStatus, 
  UpdateInvoicePayload 
} from '../../../types/billing';
import type { Customer } from '../../../types';
import {
  InvoiceStatusSelector,
  DueDateInput,
  EditableInvoiceItemsList,
  InvoiceTotals,
  InvoiceNotesTerms,
  FormActions,
} from './invoice';
import { formatCurrency } from '../../../utils/currency';

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: Invoice;
  customers: Customer[];
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  invoice,
  customers,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    customerId: '',
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    status: 'draft' as InvoiceStatus,
    dueDate: '',
    notes: '',
    terms: '',
  });

  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'invoiceId' | 'isActive' | 'createdAt' | 'updatedAt'>[]>([
    { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // React Query hook
  const updateInvoiceMutation = useUpdateInvoice();

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId.toString(),
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        dueDate: invoice.dueDate.split('T')[0],
        notes: invoice.notes || '',
        terms: invoice.terms || '',
      });

      if (invoice.items && invoice.items.length > 0) {
        setItems(invoice.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })));
      } else {
        setItems([{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
      }
    }
  }, [invoice]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.discountAmount]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Total amount must be greater than 0';
    }

    // Validate items
    items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item${index}Description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item${index}Quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item${index}UnitPrice`] = 'Unit price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = (subtotal * 0.1); // 10% tax
    const discountAmount = formData.discountAmount;
    const totalAmount = subtotal + taxAmount - discountAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate total price for this item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const invoiceData: UpdateInvoicePayload = {
        customerId: formData.customerId,
        subtotal: formData.subtotal,
        taxAmount: formData.taxAmount,
        discountAmount: formData.discountAmount,
        totalAmount: formData.totalAmount,
        status: formData.status,
        dueDate: formData.dueDate,
        notes: formData.notes,
        terms: formData.terms,
        items: items.filter(item => item.description.trim() && item.quantity > 0 && item.unitPrice > 0),
      };

      await updateInvoiceMutation.mutateAsync({
        invoiceId: invoice.id,
        invoiceData
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Invoice #${invoice.invoiceNumber}`}
      subtitle="Update invoice details and items"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Selection */}
          <div>
            <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className={cn(`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.customerId ? 'border-red-500' : ''
              }`, theme.background, theme.textPrimary, theme.border)}
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} - {customer.email}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-400">{errors.customerId}</p>
            )}
          </div>

          {/* Status Selection using reusable component */}
          <InvoiceStatusSelector
            value={formData.status}
            onChange={(status) => setFormData({ ...formData, status })}
          />

          {/* Due Date using reusable component */}
          <DueDateInput
            value={formData.dueDate}
            onChange={(dueDate) => setFormData({ ...formData, dueDate })}
            error={errors.dueDate}
            required={true}
          />
        </div>

        {/* Invoice Items using reusable component */}
        <EditableInvoiceItemsList
          items={items}
          onUpdateItem={updateItem}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          errors={errors}
          formatCurrency={formatCurrency}
        />

        {/* Totals using reusable component */}
        <InvoiceTotals
          subtotal={formData.subtotal}
          taxAmount={formData.taxAmount}
          discountAmount={formData.discountAmount}
          totalAmount={formData.totalAmount}
          onDiscountChange={(discount) => {
            setFormData({
              ...formData,
              discountAmount: discount,
            });
          }}
          formatCurrency={formatCurrency}
        />

        {/* Notes and Terms using reusable component */}
        <InvoiceNotesTerms
          notes={formData.notes}
          terms={formData.terms}
          onNotesChange={(notes) => setFormData({ ...formData, notes })}
          onTermsChange={(terms) => setFormData({ ...formData, terms })}
        />

        {/* Form Actions using reusable component */}
        <FormActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Update Invoice"
          isLoading={updateInvoiceMutation.isPending}
        />
      </form>
    </ThemedModal>
  );
};

export default EditInvoiceModal;
