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


// Dashboard Interfaces
export type { 
  RecentJob, 
  DashboardStats 
} from './dashboard';

// Import for internal use in this file (for other interfaces that reference Customer/Car)
import type { Customer } from './customer';

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

export interface CreateInvoicePayload {
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  isActive: boolean;
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
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
  name: string
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

// Miscellaneous Bill Management Types - Re-exported from dedicated file
export type {
  MiscellaneousBill,
  MiscellaneousBillCreateData,
  MiscellaneousBillUpdateData,
  MiscellaneousBillsResponse,
  MiscellaneousBillApiResponse,
  MiscellaneousBillTableProps,
  AddMiscellaneousBillModalProps,
  EditMiscellaneousBillModalProps,
  MiscellaneousBillFilters,
  MiscellaneousBillStatsData,
} from './miscellaneousBill';
