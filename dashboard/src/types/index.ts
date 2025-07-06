// Customer Management Types
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  isActive: boolean;
  totalSpent: number;
  lastVisit?: string;
  cars?: Car[];
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: number;
  customerId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  mileage?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  car?: Car;
  assignedStaff?: User;
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

export interface BillingStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  outstandingAmount: number;
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
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  jobId?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  carId: string;
  serviceType: ServiceType;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed'
}



// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


