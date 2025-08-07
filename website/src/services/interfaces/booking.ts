// Shared interfaces for the booking system

export interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  price_display?: string; // For formatted display
  duration_minutes: number;
  features: string[];
  is_active: boolean;
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
}

export interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_concurrent_bookings?: number;
}

export interface Customer {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface BookingData {
  service: string | Service;
  car: Car;
  time_slot: string | TimeSlot;
  customer_notes?: string;
}

export interface BookingCreateData {
  service: string;
  car: Car;
  time_slot: string;
  customer_notes?: string;
}

export interface Booking {
  id: string;
  service: Service;
  car: Car;
  time_slot: TimeSlot;
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
