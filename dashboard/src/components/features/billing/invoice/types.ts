import type { InvoiceItem as BaseInvoiceItem } from '../../../../types/billing';

// Extended InvoiceItem to include product variant details
export interface InvoiceItemWithProduct extends Omit<BaseInvoiceItem, 'id' | 'invoiceId' | 'isActive' | 'createdAt' | 'updatedAt'> {
  variantId?: string;
  productName?: string;
  variantName?: string;
  sku?: string;
  quantity: number | "";
}
