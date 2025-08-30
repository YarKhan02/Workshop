// Billing Management Types - Centralized location for all billing-related interfaces

// ==================== CORE BILLING INTERFACES ====================

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  invoice_number?: string; // Backend field
  customerId?: string;
  customer: InvoiceCustomer;
  subtotal: number;
  discountAmount: number;
  discount_amount?: number; // Backend field
  totalAmount: number;
  total_amount?: string; // Backend field (sometimes string)
  variant_name?: string;
  status: InvoiceStatus;
  payment_status?: InvoiceStatus; // Backend field for booking invoices
  paymentMethod?: PaymentMethod;
  dueDate?: string;
  due_date?: string; // Backend field
  paidDate?: string;
  paid_date?: string; // Backend field
  notes?: string;
  terms?: string;
  isActive?: boolean;
  createdAt: string;
  created_at?: string; // Backend field
  updatedAt: string;
  updated_at?: string; // Backend field
  items: InvoiceItem[];
  invoice_type?: 'inventory' | 'booking'; // Added to distinguish invoice types
  // Legacy fields for inventory invoices
  discount?: number;
  tax?: number;
  service_name?: string; // For booking invoices
  amount_due?: number | string; // For booking invoices
  is_overdue?: boolean; // For booking invoices
}

export interface InvoiceItem {
  id: string;
  type: 'product' | 'service';  // Unified type field
  description: string;
  quantity: number | "";
  unitPrice: number;        // Frontend field name
  unit_price?: string;      // Backend field name
  totalPrice: number;       // Frontend field name  
  total_amount?: string;    // Backend field name
  // Product-specific fields
  productVariant?: string;  // Frontend field name
  product_variant?: string; // Backend field name (ID)
  productName?: string;
  product_name?: string;    // Backend field name
  variantName?: string;     // Frontend field name
  variant_name?: string;    // Backend field name
  sku?: string;             // Backend field name
  // Service-specific fields  
  serviceName?: string;
  service_name?: string;    // Backend field name
  serviceDescription?: string;
  service_description?: string; // Backend field name
  carInfo?: string;
  car_info?: string;        // Backend field name
  scheduledDate?: string;
  scheduled_date?: string;  // Backend field name
  status?: string;          // Service status
  // Legacy fields
  invoiceId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceCustomer {
  id: string;
  email: string;
  name: string;
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
  | 'cancelled'

export type PaymentMethod = 
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'wallet'
  | 'credit_card'
  | 'debit_card'

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
  quantity: number | "";
  unitPrice: number;     // Frontend field name
  totalPrice: number;    // Frontend field name
  variantId?: string;
  productName?: string;
  variantName?: string;
  sku?: string;
}

export interface CreateInvoicePayload {
  subtotal?: number;         
  discountAmount: number;
  totalAmount: number;
  status?: string;
  items: {
    variantId: string;
    quantity: number | "";
    unitPrice?: number;
    totalPrice: number;
  }[];
  bookingId?: string;
}export interface UpdateInvoicePayload extends Partial<InvoiceFormData> {
  items?: Omit<InvoiceItemFormData, 'variantId' | 'productName' | 'variantName' | 'sku'>[];
}

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

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

// ==================== BOOKING INTERFACES ====================

export interface BookingService {
  id: string;
  service: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: string;
  };
  price: string;
  status: string;
}

export interface BookingCar {
  id: string;
  license_plate: string;
  make: string;        // Changed from brand_name to make
  model: string;
  year: number;
  color: string;
  customer_name: string;
}

export interface BookingDailyAvailability {
  id: string;
  date: string;
  total_slots: number;
  available_slots: number;
}

export interface InvoiceBooking {
  id: string;
  car: BookingCar;
  daily_availability: BookingDailyAvailability;
  service: BookingService;
  scheduled_date: string;
  special_instructions?: string;
  customer_rating?: number;
  customer_feedback?: string;
  created_at: string;
  // Invoice financial fields
  invoice_subtotal: string;
  invoice_discount_amount: string;
  invoice_total_amount: string;
  invoice_status: string;
  invoice_number: string;
  invoice_created_at: string;
}

// ==================== RESPONSE INTERFACES ====================

export interface PaginatedInvoiceResponse {
  data: Invoice[] | {
    invoices: Invoice[];
    booking_data: Record<string, InvoiceBooking>;
    pagination: PaginationInfo;
  };
  pagination?: PaginationInfo;
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

export interface BillingStats {
  totalRevenue: number
  totalOrders: number
  outstandingAmount: number
  monthlyRevenue: number
}