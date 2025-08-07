// Customer Management Types - Centralized location for all customer-related interfaces

// ==================== CUSTOMER STATS ====================

export interface CustomerStats {
  total: number;
  returning: number;
  new_this_week: number;
  new_this_week_percentage: number;
}

// ==================== CORE CUSTOMER INTERFACES ====================

export interface Customer {
  id: string;
  nic: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address?: string;
  city?: string;
  state?: string;
  cars?: CustomerCar[];
  date_joined?: string;
}

// Car interface specifically for customer context
export interface CustomerCar {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  color: string;
  license_plate: string;
  display_name?: string; // For UI display purposes
  mileage?: number;
  created_at?: string;
  updated_at?: string;
}

// ==================== FORM DATA INTERFACES ====================

export interface CustomerFormData {
  nic: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  city?: string;
  state?: string;
}

export interface CustomerCreateData extends CustomerFormData {}

export interface CustomerUpdateData extends Partial<CustomerFormData> {}

// ==================== MODAL PROP INTERFACES ====================

export interface EditCustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerId: string, data: CustomerFormData) => Promise<void>;
}

export interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

export interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==================== TABLE INTERFACES ====================

export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
}

// ==================== API INTERFACES ====================

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CustomerResponse {
  customers: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CustomerApiResponse {
  message: string;
  customer: Customer;
}

// ==================== QUERY INTERFACES ====================

export interface CustomerMutationVariables {
  customerId: string;
  data: CustomerUpdateData;
}

export interface CustomerSearchFields {
  first_name: boolean;
  last_name: boolean;
  email: boolean;
  phone_number: boolean;
  address: boolean;
}
