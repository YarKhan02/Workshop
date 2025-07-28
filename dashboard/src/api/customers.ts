import { apiClient } from './client';
import type {
  Customer,
  CustomerFilters,
  CustomerResponse,
  CustomerCreateData,
  CustomerUpdateData,
  CustomerApiResponse,
} from '../types/customer';

// Customer API functions
export const customerAPI = {
  // Get customer details for listing (matches current endpoint)
  getCustomerDetails: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/customers/details/');
    return response.data || [];
  },

  // Get all customers with filters (if available)
  getCustomers: async (filters: CustomerFilters = {}): Promise<CustomerResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get(`/customers?${params.toString()}`);
    return response.data;
  },

  // Get single customer by ID
  getCustomerById: async (id: number): Promise<{ customer: Customer }> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData: CustomerCreateData): Promise<CustomerApiResponse> => {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: string, customerData: CustomerUpdateData): Promise<CustomerApiResponse> => {
    const response = await apiClient.put(`/customers/${id}/update-customer/`, customerData);
    return response.data;
  },
};

// Customer query keys for React Query
export const customerQueries = {
  keys: {
    all: ['customers'] as const,
    lists: () => [...customerQueries.keys.all, 'list'] as const,
    list: (filters: CustomerFilters) => [...customerQueries.keys.lists(), filters] as const,
    details: () => [...customerQueries.keys.all, 'details'] as const,
    detail: (id: number) => [...customerQueries.keys.details(), id] as const,
  },

  // Query functions for use with React Query
  list: () => ({
    queryKey: customerQueries.keys.details(),
    queryFn: () => customerAPI.getCustomerDetails(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  detail: (customerId: number) => ({
    queryKey: customerQueries.keys.detail(customerId),
    queryFn: () => customerAPI.getCustomerById(customerId),
    enabled: !!customerId,
  }),

  filtered: (filters: CustomerFilters) => ({
    queryKey: customerQueries.keys.list(filters),
    queryFn: () => customerAPI.getCustomers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),
};

export default customerAPI; 