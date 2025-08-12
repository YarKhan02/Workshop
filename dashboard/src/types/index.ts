// Customer Management Types - Re-exported from dedicated file
export type {
  Customer,
  CustomerCar,
  CustomerFormData,
  CustomerCreateData,
  CustomerUpdateData,
  EditCustomerModalProps,
  CustomerDetailModalProps,
  AddCustomerModalProps,
  CustomerTableProps,
  CustomerFilters,
  CustomerResponse,
  CustomerApiResponse,
  CustomerMutationVariables,
  CustomerSearchFields,
} from './customer';

// Car Management Types - Re-exported from dedicated file
export type {
  Car,
  CarCustomer,
  CarCreateData,
  CarUpdateData,
  AddCarModalProps,
  EditCarModalProps,
  CarDetailModalProps,
  CarTableProps,
  CarFilters,
  CarsResponse,
  CarStatsData,
} from './car';

// Booking Management Types - Re-exported from dedicated file
export type {
  Booking,
  BookingTableProps,
  BookingFiltersProps,
  BookingStatsData,
  BookingStatsProps,
  AddBookingModalProps,
  BookingDetailModalProps,
  EditBookingModalProps,
} from './booking';

// Service Management Types - Re-exported from dedicated file
export type {
  Service,
  ServiceFormData,
  ServiceUpdateData,
  ServiceFilters,
  ServicesResponse,
  ServiceStatsData,
  ServiceCategory,
  ServiceCategoryEnum,
} from './service';

// Inventory Management Types - Re-exported from dedicated file
export type {
  CategoryOption,
  Product,
  ProductVariant,
  FlattenedInventoryVariant,
  ProductFormData,
  ProductCreateData,
  ProductVariantFormData,
  ProductVariantCreateData,
  ProductVariantUpdateData,
  AddInventoryModalProps,
  EditInventoryModalProps,
  AddVariantModalProps,
  InventoryTableProps,
  InventoryFilters,
  InventoryStatsData,
  InventoryStatsProps,
  ProductsResponse,
  ProductApiResponse,
  ProductVariantApiResponse,
  ProductSearchFields,
  ProductMutationVariables,
  ProductVariantMutationVariables,
  ProductVariantUpdateMutationVariables,
  ProductVariantDeleteMutationVariables,
} from './inventory';

// Import for internal use in this file (for other interfaces that reference Customer/Car)
import type { Customer } from './customer';
import type { Car } from './car';

export interface Job {
  id: string;
  customerId: string;
  carId: string;
  assignedTo?: string;
  jobType: 'basic_wash' | 'full_detail' | 'interior_detail' | 'exterior_detail' | 'premium_detail' | 'custom';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: string;
  endTime?: string;
  price: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
  customerNotes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  services: string[];
  materials: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  car?: Car;
}

export interface JobFormData {
  customerId: number;
  carId: number;
  assignedTo?: number;
  jobType: 'basic_wash' | 'full_detail' | 'interior_detail' | 'exterior_detail' | 'premium_detail' | 'custom';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: string;
  endTime?: string;
  price: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
  customerNotes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  services: string[];
  materials: string[];
}

export interface JobStats {
  totalJobs: number;
  pendingJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  todayJobs: number;
  totalRevenue: number;
  todayRevenue: number;
}

export enum ServiceType {
  BASIC_WASH = 'Basic Wash',
  PREMIUM_WASH = 'Premium Wash',
  INTERIOR_DETAILING = 'Interior Detailing',
  EXTERIOR_DETAILING = 'Exterior Detailing',
  FULL_DETAILING = 'Full Detailing',
  CERAMIC_COATING = 'Ceramic Coating',
  PAINT_CORRECTION = 'Paint Correction',
  HEADLIGHT_RESTORATION = 'Headlight Restoration',
  LEATHER_CARE = 'Leather Care',
  ENGINE_BAY_CLEANING = 'Engine Bay Cleaning'
}

export enum JobStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

// Billing & Receipts Types
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoicePayload {
  customerId: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  dueDate: string;
  isActive: boolean;
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  jobId?: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled' | 'partial';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'wallet' | 'check';
  dueDate: string;
  paidDate?: string;
  notes?: string;
  terms?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  job?: Job;
  items?: InvoiceItem[];
}

// Define the InvoiceItem type based on its usage in AddInvoiceModal
export interface InvoiceItem {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PARTIAL = 'Partial',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled'
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  BANK_TRANSFER = 'Bank Transfer',
  UPI = 'UPI',
  WALLET = 'Wallet',
  CHECK = 'Check'
}

export interface CustomerInvoice {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
}

export interface OrderItem {
  id: string
  quantity: number
  unit_price: string
  total_price: string
  product_name: string
  product_variant: string
}

export interface Order {
  id: string
  total_amount: string
  discount: string
  tax: string
  created_at: string
  status: string
  customer: Customer
  items: OrderItem[]
}

export interface BillingStats {
  totalRevenue: number
  totalOrders: number
  outstandingAmount: number
  monthlyRevenue: number
}

// Staff Management Types
export interface Attendance {
  id: string;
  staffId: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  totalHours?: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  HALF_DAY = 'Half Day',
  LEAVE = 'Leave'
}

export interface Shift {
  id: string;
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Dashboard Types
export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  period: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface RevenueReport {
  date: Date;
  revenue: number;
  jobs: number;
  averageJobValue: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  recipientType: 'customer' | 'staff';
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  JOB_REMINDER = 'Job Reminder',
  PAYMENT_DUE = 'Payment Due',
  JOB_COMPLETED = 'Job Completed',
  SYSTEM_ALERT = 'System Alert'
}

// Dashboard Types
export interface DashboardStats {
  totalCustomers: number;
  totalJobs: number;
  pendingJobs: number;
  completedJobs: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeStaff: number;
}

// Booking Types
export interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_slots?: number;
  is_available: boolean;
  jobId?: string;
}
