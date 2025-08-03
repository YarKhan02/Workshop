// Data transformation utilities for handling backend/frontend field mapping

/**
 * Transforms snake_case backend fields to camelCase frontend fields
 */
export function transformInvoiceData(backendInvoice: any): any {
  if (!backendInvoice) return null;

  return {
    // Core fields
    id: backendInvoice.id,
    invoiceNumber: backendInvoice.invoice_number || backendInvoice.invoiceNumber,
    customerId: backendInvoice.customer_id || backendInvoice.customerId,
    customer: backendInvoice.customer,
    jobId: backendInvoice.job_id || backendInvoice.jobId,
    job: backendInvoice.job,
    
    // Financial fields
    subtotal: backendInvoice.subtotal || backendInvoice.total_amount || 0,
    taxAmount: backendInvoice.taxAmount || backendInvoice.tax || 0,
    discountAmount: backendInvoice.discountAmount || backendInvoice.discount || 0,
    totalAmount: backendInvoice.totalAmount || backendInvoice.grand_total || backendInvoice.total_amount || 0,
    
    // Status fields
    status: backendInvoice.status,
    paymentMethod: backendInvoice.paymentMethod || backendInvoice.payment_method,
    
    // Date fields
    dueDate: backendInvoice.dueDate || backendInvoice.due_date,
    paidDate: backendInvoice.paidDate || backendInvoice.paid_date,
    createdAt: backendInvoice.createdAt || backendInvoice.created_at,
    updatedAt: backendInvoice.updatedAt || backendInvoice.updated_at,
    
    // Optional fields
    notes: backendInvoice.notes,
    terms: backendInvoice.terms,
    isActive: backendInvoice.isActive || backendInvoice.is_active,
    
    // Items
    items: backendInvoice.items?.map((item: any) => transformInvoiceItemData(item)) || [],
  };
}

/**
 * Transforms invoice item data from backend to frontend format
 */
export function transformInvoiceItemData(backendItem: any): any {
  if (!backendItem) return null;

  return {
    id: backendItem.id,
    invoiceId: backendItem.invoiceId || backendItem.invoice_id,
    description: backendItem.description,
    quantity: backendItem.quantity,
    unitPrice: backendItem.unitPrice || backendItem.unit_price || 0,
    totalPrice: backendItem.totalPrice || backendItem.total_price || 0,
    productName: backendItem.productName || backendItem.product_name,
    productVariant: backendItem.productVariant || backendItem.product_variant,
    isActive: backendItem.isActive || backendItem.is_active,
    createdAt: backendItem.createdAt || backendItem.created_at,
    updatedAt: backendItem.updatedAt || backendItem.updated_at,
  };
}

/**
 * Safely access invoice fields with fallbacks for both camelCase and snake_case
 */
export function getInvoiceField(invoice: any, field: string, fallback: any = null): any {
  if (!invoice) return fallback;
  
  // Try camelCase first
  if (invoice[field] !== undefined && invoice[field] !== null) {
    return invoice[field];
  }
  
  // Convert to snake_case and try
  const snakeField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
  if (invoice[snakeField] !== undefined && invoice[snakeField] !== null) {
    return invoice[snakeField];
  }
  
  return fallback;
}

/**
 * Format currency using centralized utility
 */
import { formatCurrency } from './currency';

export function formatPKRCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const validAmount = Number(numAmount) || 0;
  
  return formatCurrency(validAmount);
}

/**
 * Format status text for display
 */
export function formatStatus(status: string): string {
  if (!status) return 'Unknown';
  
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Safe date formatting with fallbacks
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return 'Invalid Date';
  }
}
