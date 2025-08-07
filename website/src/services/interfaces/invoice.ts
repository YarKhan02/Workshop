export interface InvoiceTimeSlot {
  date: string;
  start_time: string;
  end_time: string;
}

export interface InvoiceService {
  name: string;
  description: string;
}

export interface InvoiceCar {
  make: string;
  model: string;
  year: string;
  license_plate: string;
  color: string;
}

export interface InvoiceBooking {
  id: string;
  service: InvoiceService;
  car: InvoiceCar;
  time_slot: InvoiceTimeSlot;
  customer_notes?: string;
}

export interface InvoiceCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface InvoiceData {
  id: string;
  booking_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  booking: InvoiceBooking;
  customer: InvoiceCustomer;
}

export interface InvoiceLoadingState {
  loading: boolean;
  downloading: boolean;
  error: string | null;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}
