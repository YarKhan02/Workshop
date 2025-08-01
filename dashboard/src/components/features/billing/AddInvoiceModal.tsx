"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme, cn, ThemedModal, ThemedButton } from '../../ui';
import { 
  useCreateInvoice, 
  useInvoiceCustomers, 
  useInvoiceProducts 
} from '../../../hooks/useBilling';
import type { 
  CreateInvoicePayload, 
  InvoiceStatus
} from '../../../types/billing';
import { formatCurrency } from '../../../utils/currency';
import type { CustomerInvoice, Product, ProductVariant } from '../../../types';
import type { InvoiceItemWithProduct } from './invoice/types';
import {
  CustomerSelector,
  InvoiceStatusSelector,
  DueDateInput,
  ProductSelector,
  InvoiceItemsList,
  InvoiceTotals,
  FormActions,
} from './invoice';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customers: CustomerInvoice[]; // Legacy prop - now fetched via hooks
  jobs: null; // Legacy prop - keeping for compatibility
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    customerId: "",
    jobId: "",
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    status: "draft" as InvoiceStatus,
    dueDate: new Date().toISOString().split('T')[0], // Default to today
    notes: "",
    terms: "",
  });

  // Start with an empty array for items
  const [items, setItems] = useState<InvoiceItemWithProduct[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductSelector, setShowProductSelector] = useState(false);

  // React Query hooks
  const createInvoiceMutation = useCreateInvoice();
  
  // Fetch Customers using the billing hook
  const { data: customersData, isLoading: isLoadingCustomers } = useInvoiceCustomers();
  
  // Fetch Products using the billing hook with search
  const { data: products, isLoading: isLoadingProducts } = useInvoiceProducts(productSearchTerm);

  // Effect to reset customerId if selected customer is no longer in filtered list
  useEffect(() => {
    if (customersData && formData.customerId) {
      const isSelectedCustomerStillAvailable = customersData.some(
        (customer: CustomerInvoice) => customer.id === formData.customerId
      );
      if (!isSelectedCustomerStillAvailable) {
        setFormData((prev) => ({ ...prev, customerId: "" }));
      }
    }
  }, [customersData, formData.customerId]);

  // Flatten products into a list of variants for selection
  const availableVariants = useMemo(() => {
    if (!products) return [];
    return products.flatMap((product: Product) =>
      product.variants.map((variant: ProductVariant) => ({
        ...variant,
        productName: product.name,
        productUuid: product.id,
      }))
    );
  }, [products]);

  // Effect to set due date to today when status is "paid"
  useEffect(() => {
    if (formData.status === "paid") {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      setFormData((prev) => ({ ...prev, dueDate: `${year}-${month}-${day}` }));
    }
  }, [formData.status]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.discountAmount]); // Recalculate when items or discount changes

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    if (items.length === 0) {
      newErrors.items = "At least one invoice item is required.";
    }
    // Only validate total amount if there are items
    if (items.length > 0 && formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than 0";
    }
    // Validate items
    items.forEach((item, index) => {
      if (item.quantity <= 0) {
        newErrors[`item${index}Quantity`] = "Quantity must be greater than 0";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const itemTotalPrice = Number(item.totalPrice) || 0;
      return sum + itemTotalPrice;
    }, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const discountAmount = Number(formData.discountAmount) || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;
    setFormData((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItemWithProduct, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    // Calculate total price for this item
    if (field === "quantity" || field === "unitPrice") {
      const qty = Number(newItems[index].quantity) || 0;
      const price = Number(newItems[index].unitPrice) || 0;
      newItems[index].totalPrice = qty * price;
    }
    setItems(newItems);
  };

  const addProductVariantToInvoice = (variant: ProductVariant & { productName: string }) => {
    const newItem: InvoiceItemWithProduct = {
      description: `${variant.productName} - ${variant.variant_name}`,
      quantity: 1,
      unitPrice: Number(variant.price),
      totalPrice: Number(variant.price),
      variantId: variant.id,
      productName: variant.productName,
      variantName: variant.variant_name,
      sku: variant.sku,
    };
    
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.variantId === newItem.variantId);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        updatedItems[existingItemIndex].totalPrice =
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
        toast.success(`Increased quantity for ${newItem.description}`);
        return updatedItems;
      } else {
        toast.success(`Added ${newItem.description} to invoice`);
        return [...prevItems, newItem];
      }
    });
    setShowProductSelector(false);
    setProductSearchTerm("");
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    } else {
      toast.error("An invoice must have at least one item.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const invoiceData: CreateInvoicePayload = {
        customerId: formData.customerId,
        subtotal: formData.subtotal,
        taxAmount: formData.taxAmount,
        discountAmount: formData.discountAmount,
        totalAmount: formData.totalAmount,
        status: formData.status,
        dueDate: formData.dueDate,
        isActive: true,
        items: items
          .filter((item) => item.variantId)
          .map((item) => ({
            variantId: item.variantId as string,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
      };

      await createInvoiceMutation.mutateAsync(invoiceData);
      toast.success("Invoice created successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice. Please check the console for details.");
    }
  };

  const handleClose = () => {
    // Reset form to initial state
    setFormData({
      customerId: "",
      jobId: "",
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      status: "draft",
      dueDate: new Date().toISOString().split('T')[0], // Reset to today
      notes: "",
      terms: "",
    });
    setItems([]);
    setErrors({});
    setProductSearchTerm("");
    setShowProductSelector(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ThemedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Invoice"
      subtitle="Add invoice details and items"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerSelector
            value={formData.customerId}
            onChange={(customerId) => setFormData((prev) => ({ ...prev, customerId }))}
            customers={customersData}
            isLoading={isLoadingCustomers}
            error={errors.customerId}
            required
          />

          <InvoiceStatusSelector
            value={formData.status}
            onChange={(status) => setFormData({ ...formData, status })}
          />

          <DueDateInput
            value={formData.dueDate}
            onChange={(dueDate) => setFormData({ ...formData, dueDate })}
            disabled={formData.status === "paid"}
            error={errors.dueDate}
            required
          />
        </div>

        {/* Invoice Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={cn("text-lg font-medium", theme.textPrimary)}>Invoice Items</h3>
            <ThemedButton
              type="button"
              onClick={() => setShowProductSelector(!showProductSelector)}
              variant="secondary"
            >
              <Package className="w-4 h-4 mr-2" />
              Add Product
            </ThemedButton>
          </div>

              {/* Product Selector */}
              <ProductSelector
                isOpen={showProductSelector}
                searchTerm={productSearchTerm}
                onSearchChange={setProductSearchTerm}
                variants={availableVariants}
                isLoading={isLoadingProducts}
                onAddVariant={addProductVariantToInvoice}
                formatCurrency={formatCurrency}
              />

              <InvoiceItemsList
                items={items}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                errors={errors}
                formatCurrency={formatCurrency}
              />
              {errors.items && <p className="mt-1 text-sm text-red-400">{errors.items}</p>}
            </div>

            {/* Totals */}
            <InvoiceTotals
              subtotal={formData.subtotal}
              taxAmount={formData.taxAmount}
              discountAmount={formData.discountAmount}
              totalAmount={formData.totalAmount}
              onDiscountChange={(discount) => setFormData({ ...formData, discountAmount: discount })}
              formatCurrency={formatCurrency}
            />

        {/* Form Actions */}
        <FormActions
          onCancel={handleClose}
          onSubmit={handleSubmit}
          isLoading={createInvoiceMutation.isPending}
        />
      </form>
    </ThemedModal>
  );
};

export default AddInvoiceModal;
