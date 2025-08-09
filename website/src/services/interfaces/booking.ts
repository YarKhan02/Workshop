// Shared interfaces for the booking system

export interface Service {
  id: string;
  name: string;
  code: string;
  description?: string;
  base_price: number;
  price_display?: string; // For formatted display
  estimated_duration_minutes: number;
  features?: string[];
  is_active?: boolean;
  category?: string;
  image_url?: string;
}

export interface Car {
  id?: string;
  make: string;
  model: string;
  year: string;
  license_plate: string;
  color?: string;
  customer_id?: string;
}

export interface AvailableDate {
  date: string;
  available: boolean;
  slots_available: number;
}

export interface Customer {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// Customer booking interface for MyBookings page
export interface MyBooking {
  id: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  created_at: string;
  quoted_price: string;
  estimated_duration_minutes: number;
  // Car fields
  car_make: string;
  car_model: string;
  car_license_plate: string;
  // Service fields
  service_name: string;
  service_base_price: string;
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
