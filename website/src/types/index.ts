// Customer Management Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Car {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  mileage?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  customerId: string;
  carId: string;
  serviceType: ServiceType;
  status: JobStatus;
  scheduledDate: Date;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  assignedStaffId?: string;
  notes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  createdAt: Date;
  updatedAt: Date;
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
  id: string;
  jobId: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  servicePackageId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
  WALLET = 'Wallet'
}

// Inventory Management Types
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: InventoryCategory;
  unit: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  supplierId?: string;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum InventoryCategory {
  CLEANING_SUPPLIES = 'Cleaning Supplies',
  POLISHES = 'Polishes',
  WAXES = 'Waxes',
  TOOLS = 'Tools',
  CHEMICALS = 'Chemicals',
  EQUIPMENT = 'Equipment'
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  ORDERED = 'Ordered',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled'
}

// Staff Management Types
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  hourlyRate: number;
  isActive: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum StaffRole {
  MANAGER = 'Manager',
  DETAILER = 'Detailer',
  ASSISTANT = 'Assistant',
  RECEPTIONIST = 'Receptionist'
}

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
  LOW_STOCK = 'Low Stock',
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
  lowStockItems: number;
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