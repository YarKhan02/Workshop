"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme, cn } from '../../ui';
import { FormModal } from '../../shared/FormModal';
import { FormFooter } from '../../shared/FormFooter';
import { 
  useCreateInvoice,
  useInvoiceProducts 
} from '../../../hooks/useBilling';
import type { InvoiceStatus } from '../../../types/billing';
import { formatCurrency } from '../../../utils/currency';
import type { Product, ProductVariant } from '../../../types';
import type { InvoiceItemWithProduct } from '../billing/invoice/types';
import {
  ProductSelector,
  InvoiceItemsList,
  InvoiceTotals,
} from '../billing/invoice';
import { bookingAPI } from '../../../api/booking';

interface AddProductItemsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingId?: string;
}

const AddProductItems: React.FC<AddProductItemsProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  bookingId
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    subtotal: 0,
    discount: 0,  
    grand_total: 0,
    status: "draft" as InvoiceStatus,
    notes: "",
    terms: "",
  });
  // Fetch invoice items for the selected bookingId
  const {
    data: invoiceItems,
    isLoading: invoiceItemsLoading,
    isError: invoiceItemsError,
  } = useQuery({
    queryKey: ['booking-invoice-items', bookingId],
    queryFn: () => bookingId ? bookingAPI.getBookingInvoiceItems(bookingId) : Promise.resolve([]),
    enabled: !!bookingId,
  });

  // Start with an empty array for items
  const [items, setItems] = useState<InvoiceItemWithProduct[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductSelector, setShowProductSelector] = useState(false);

  // React Query hooks
  const createInvoiceMutation = useCreateInvoice();
  
  // Fetch Products using the billing hook with search
  const { data: products, isLoading: isLoadingProducts } = useInvoiceProducts(productSearchTerm);

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

  useEffect(() => {
    calculateTotals();
  }, [items, formData.discount]); // Recalculate when items or discount changes

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (items.length === 0) {
      newErrors.items = "At least one invoice item is required.";
    }
    // Only validate total amount if there are items
    if (items.length > 0 && formData.grand_total <= 0) {
      newErrors.grand_total = "Total amount must be greater than 0";
    }
    // Validate items
    items.forEach((item, index) => {
      // Allow float and empty, but not zero or negative
      const qty = parseFloat(item.quantity as any);
      if (isNaN(qty) || qty <= 0) {
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
    const discount = Number(formData.discount) || 0;
    const grand_total = subtotal - discount;
    setFormData((prev) => ({
      ...prev,
      subtotal,
      grand_total,
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItemWithProduct, value: any) => {
    const newItems = [...items];
    if (field === "quantity") {
      // Allow empty string for clearing, otherwise parse float
      if (value === "" || value === null) {
        newItems[index] = { ...newItems[index], [field]: "" };
      } else {
        const floatQty = parseFloat(value);
        newItems[index] = { ...newItems[index], [field]: isNaN(floatQty) ? "" : floatQty };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    // Calculate total amount for this item
    if (field === "quantity" || field === "unitPrice") {
      const qty = parseFloat(newItems[index].quantity as any);
      const price = Number(newItems[index].unitPrice) || 0;
      newItems[index].totalPrice = !isNaN(qty) && qty > 0 ? qty * price : 0;
    }
    setItems(newItems);
  };

  const addProductVariantToInvoice = (variant: ProductVariant & { productName: string }) => {
    const newItem: InvoiceItemWithProduct = {
      type: 'product',
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
        // Ensure quantity is a number for math
        const currentQty = typeof updatedItems[existingItemIndex].quantity === "number"
          ? updatedItems[existingItemIndex].quantity
          : 0;
        updatedItems[existingItemIndex].quantity = currentQty + 1;
        updatedItems[existingItemIndex].totalPrice =
          (currentQty + 1) * (updatedItems[existingItemIndex].unitPrice || 0);
        toast.success(`Increased quantity for ${newItem.description}`);
        return updatedItems;
      } else {
        toast.success(`Added ${newItem.description} to invoice`);
        const newItems = [...prevItems, newItem];
        return newItems;
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
      // Ensure we have all required data
      
      if (items.length === 0) {
        toast.error("Please add at least one item");
        return;
      }
      
      // Check if items have the required fields
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          variantId: item.variantId,
          quantity: parseFloat(item.quantity as any),
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          description: item.description
        });
      });

  const invoiceData = {
        subtotal: formData.subtotal,
        discountAmount: formData.discount || 0,
        totalAmount: formData.grand_total || 0,
        status: formData.status,
        items: items
          .filter((item) => item.variantId) // Only include items with product variants
          .map((item) => ({
            variantId: item.variantId!, // Required - ProductVariant UUID
            quantity: parseFloat(item.quantity as any) || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0,
          })),
        ...(bookingId ? { bookingId } : {}),
      };

  // @ts-ignore: customerId intentionally omitted
  await createInvoiceMutation.mutateAsync(invoiceData);
      toast.success("Invoice created successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handleClose = () => {
    // Reset form to initial state
    setFormData({
      subtotal: 0,
      discount: 0,
      grand_total: 0,
      status: "draft",
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
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Product Items"
      subtitle="Products used in the car service"
      size="xl"
      onSubmit={handleSubmit}
      footer={
        <FormFooter
          onCancel={handleClose}
          isSubmitting={createInvoiceMutation.isPending}
          submitLabel={createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
        />
      }
    >
      {/* Invoice Items (Editable) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className={cn("text-lg font-medium", theme.textPrimary)}>Invoice Items</h3>
          {/* Add Product Button */}
          <button
            type="button"
            onClick={() => setShowProductSelector(!showProductSelector)}
            className={cn('px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 flex items-center transition-all duration-200')}
          >
            <Package className="w-4 h-4 mr-2" />
            Add Product
          </button>
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
        {/* Show per-item quantity errors */}
        {items.map((_, idx) =>
          errors[`item${idx}Quantity`] ? (
            <p key={idx} className="mt-1 text-sm text-red-400">
              Item {idx + 1}: {errors[`item${idx}Quantity`]}
            </p>
          ) : null
        )}
      </div>

      {/* Invoice Items (Read-only from backend) */}
      <div className={cn("rounded-lg border overflow-hidden mb-8", theme.background, theme.border)}>
        <h3 className={cn("text-lg font-medium mb-4 p-4", theme.textPrimary)}>Invoice Items</h3>
        {invoiceItemsLoading ? (
          <div className="p-4 text-center text-sm">Loading invoice items...</div>
        ) : invoiceItemsError ? (
          <div className="p-4 text-center text-red-500 text-sm">Failed to load invoice items.</div>
        ) : (
          <table className="w-full">
            <thead className={cn("", theme.background)}>
              <tr>
                <th className={cn("text-left py-3 px-4 font-medium", theme.textPrimary)}>Description</th>
                <th className={cn("text-right py-3 px-4 font-medium", theme.textPrimary)}>Quantity</th>
                <th className={cn("text-right py-3 px-4 font-medium", theme.textPrimary)}>Unit Price</th>
                <th className={cn("text-right py-3 px-4 font-medium", theme.textPrimary)}>Total</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", theme.border)}>
              {(invoiceItems || []).map((item: any, index: number) => (
                <tr key={index}>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {/* You can use a Package icon if imported */}
                      <div>
                        <p className={cn("text-sm font-medium", theme.textPrimary)}>
                          {item.product_variant_name || item.service_name || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={cn("text-right py-3 px-4 text-sm", theme.textSecondary)}>
                    {item.quantity}
                  </td>
                  <td className={cn("text-right py-3 px-4 text-sm", theme.textSecondary)}>
                    {item.unit_price || item.unitPrice || 0}
                  </td>
                  <td className={cn("text-right py-3 px-4 text-sm font-medium", theme.textPrimary)}>
                    {(item.total_amount || item.total_price || item.totalPrice || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Totals */}
      <InvoiceTotals
        subtotal={formData.subtotal}
        discount={formData.discount}
        grand_total={formData.grand_total}
        onDiscountChange={(discount) => setFormData({ ...formData, discount })}
        formatCurrency={formatCurrency}
      />
    </FormModal>
  );
};

export default AddProductItems;
