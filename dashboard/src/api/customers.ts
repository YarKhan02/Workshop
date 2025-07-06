import { apiClient } from './client';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
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
  createdAt: string;
  updatedAt: string;
}

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

// Get all customers with filters
export const getCustomers = async (filters: CustomerFilters = {}): Promise<CustomerResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const response = await apiClient.get(`/customers?${params.toString()}`);
  return response.data;
};

// Get single customer by ID
export const getCustomerById = async (id: number): Promise<{ customer: Customer }> => {
  const response = await apiClient.get(`/customers/${id}`);
  return response.data;
};

// Create new customer
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; customer: Customer }> => {
  const response = await apiClient.post('/customers', customerData);
  return response.data;
};

// Update customer
export const updateCustomer = async (id: number, customerData: Partial<Customer>): Promise<{ message: string; customer: Customer }> => {
  const response = await apiClient.put(`/customers/${id}`, customerData);
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/customers/${id}`);
  return response.data;
}; 