// Billing Management Types - Centralized location for all billing-related interfaces

// ==================== CORE BILLING INTERFACES ====================

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  customerId: string;
  customer: InvoiceCustomer;
  jobId?: string;
  job?: InvoiceJob;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  terms?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariant?: string;
  productName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface InvoiceJob {
  id: string;
  jobType: string;
  status: string;
}

// ==================== ENUMS ====================

export type InvoiceStatus = 
  | 'draft'
  | 'pending' 
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'partial'
  | 'partially_paid';

export type PaymentMethod = 
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'upi'
  | 'wallet'
  | 'check'
  | 'credit_card'
  | 'debit_card'
  | 'paypal';

// ==================== FORM DATA INTERFACES ====================

export interface InvoiceFormData {
  customerId: string;
  jobId?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  notes?: string;
  terms?: string;
}

export interface InvoiceItemFormData {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  productName?: string;
  variantName?: string;
  sku?: string;
}

export interface CreateInvoicePayload {
  customerId: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  isActive: boolean;
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface UpdateInvoicePayload extends Partial<InvoiceFormData> {
  items?: Omit<InvoiceItemFormData, 'variantId' | 'productName' | 'variantName' | 'sku'>[];
}

// ==================== STATS INTERFACES ====================

export interface BillingStats {
  totalRevenue: number;
  totalOrders: number;
  outstandingAmount: number;
  monthlyRevenue: number;
}

// ==================== MODAL PROP INTERFACES ====================

export interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customers?: InvoiceCustomer[];
  jobs?: InvoiceJob[] | null;
}

export interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: Invoice;
  customers: InvoiceCustomer[];
  jobs: InvoiceJob[];
}

export interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onStatusUpdate: (id: string, status: InvoiceStatus, paymentMethod?: PaymentMethod) => void;
}

// ==================== TABLE INTERFACES ====================

export interface BillingTableProps {
  invoices: Invoice[];
  loading: boolean;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: InvoiceStatus) => void;
}

// ==================== API INTERFACES ====================

export interface BillingFilters {
  search?: string;
  status?: InvoiceStatus;
  page?: number;
  limit?: number;
}

export interface BillingResponse {
  data: Invoice[];
  pagination?: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
  };
}

export interface BillingApiResponse {
  invoices?: Invoice[];
  orders?: Invoice[];
  stats?: BillingStats;
  pagination?: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
  };
}

// ==================== QUERY INTERFACES ====================

export interface BillingMutationVariables {
  invoiceData: CreateInvoicePayload | UpdateInvoicePayload;
}

export interface BillingSearchFields {
  customerName?: string;
  invoiceNumber?: string;
  status?: InvoiceStatus;
}

// ==================== UTILITY INTERFACES ====================

export interface InvoiceCalculation {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}

export interface StatusUpdateRequest {
  id: string;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
}

// Legacy Order interfaces for backward compatibility
export interface Order extends Invoice {}
export interface OrderItem extends InvoiceItem {}
export interface CustomerInvoice extends InvoiceCustomer {}
