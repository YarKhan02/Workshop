import { Service } from '../api/services';

// Shared interfaces for the booking system

export interface Car {
  id?: string;
  make: string;
  model: string;
  year: string;
  license_plate: string;
  color?: string;
  customer?: string;
}

export interface AvailableDate {
  date: string;
  available: boolean;
  slots_available: number;
}

export interface Customer {
  id?: string;
  fullName: string;
  email: string;
  phone_number?: string;
}

// Customer booking interface for MyBookings page
export interface MyBooking {
  id: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  created_at: string;
  totalAmount: string;
  // Car fields
  carMake: string;
  carModel: string;
  carLicensePlate: string;
  // Service fields
  serviceName: string;
  serviceStatus: string;
  scheduledDate: string;
  serviceBasePrice: string;
  rating?: number;
}

export interface MyBookingFilters {
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface BookingActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export type MyBookingStatus = MyBooking['status'];

export interface MyBookingActions {
  reschedule: (bookingId: string) => Promise<BookingActionResponse>;
  cancel: (bookingId: string) => Promise<BookingActionResponse>;
  rate: (bookingId: string, rating: number) => Promise<BookingActionResponse>;
}

export interface BookingData {
  service: string | Service;
  car: Car; // Full car object for UI
  date: string; // Frontend uses 'date' field
  customer_notes?: string;
}

export interface BookingCreateData {
  customer: string; // Customer ID
  service: string; // Service ID
  car: string; // Car ID
  booking_date: string; // Date in YYYY-MM-DD format
  customer_notes?: string;
}

export interface Booking {
  id: string;
  service: Service;
  car: Car;
  date: string;
  customer: Customer;
  customer_notes?: string;
  staff_notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  quoted_price?: number;
  discount_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface BookingFilters {
  status?: string;
  service?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Form step interfaces
export interface BookingStepProps {
  bookingData: BookingData;
  onUpdateBookingData: (field: keyof BookingData, value: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
}

export interface StepConfig {
  number: number;
  title: string;
  icon: any; // LucideIcon type would be better but keeping it flexible
}

// API Response types
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
