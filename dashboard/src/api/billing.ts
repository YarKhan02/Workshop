// Billing API Service - Centralized location for all billing-related API calls

import { apiClient } from './client';
import { transformToSnakeCase } from "../helper/transformInvoicePayload";
import type {
  Invoice,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  BillingFilters,
  BillingStats,
  InvoiceStatus,
  PaymentMethod,
  InvoiceCustomer,
} from '../types/billing';

// ==================== BILLING API SERVICE ====================

export const billingAPI = {
  // Get list of invoices with filters
  getInvoices: async (filters: BillingFilters = {}): Promise<Invoice[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/invoices/list-invoices/?${params.toString()}`);
    
    // Handle different response formats from backend
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.orders || response.data.invoices || [];
  },

  // Get single invoice detail
  getInvoiceDetail: async (invoiceId: string): Promise<Invoice> => {
    const response = await apiClient.get(`/invoices/${invoiceId}/detail/`);
    return response.data;
  },

  // Create new invoice
  createInvoice: async (invoiceData: CreateInvoicePayload): Promise<Invoice> => {
    // Transform payload to match backend expectations
    const payload = transformToSnakeCase(invoiceData);

    const response = await apiClient.post('/invoices/add-invoice/', payload);
    return response.data;
  },

  // Update existing invoice
  updateInvoice: async (invoiceId: string, invoiceData: UpdateInvoicePayload): Promise<Invoice> => {
    const response = await apiClient.patch(`/invoices/${invoiceId}/update-invoice/`, invoiceData);
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (invoiceId: string): Promise<void> => {
    await apiClient.delete(`/invoices/${invoiceId}/delete-invoice/`);
  },

  // Update invoice status
  updateInvoiceStatus: async (
    invoiceId: string, 
    status: InvoiceStatus, 
    paymentMethod?: PaymentMethod
  ): Promise<Invoice> => {
    const payload: any = { status };
    if (paymentMethod) {
      payload.payment_method = paymentMethod;
    }
    
    const response = await apiClient.patch(`/invoices/${invoiceId}/update-status/`, payload);
    return response.data;
  },

  // Get billing statistics
  getBillingStats: async (): Promise<BillingStats> => {
    try {
      const response = await apiClient.get('/orders/stats/');
      return response.data.stats || response.data;
    } catch (error) {
      // Return default stats if API fails
      return {
        totalRevenue: 0,
        totalOrders: 0,
        outstandingAmount: 0,
        monthlyRevenue: 0,
      };
    }
  },

  // Get customers for invoice creation
  getInvoiceCustomers: async (): Promise<InvoiceCustomer[]> => {
    const response = await apiClient.get('/customers/customer-invoices/');
    return response.data;
  },

  // Search customers for invoice
  searchCustomers: async (searchTerm: string): Promise<InvoiceCustomer[]> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    
    const response = await apiClient.get(`/customers/customer-invoices/?${params.toString()}`);
    return response.data;
  },

  // Get products for invoice items
  getInvoiceProducts: async (searchTerm: string = '') => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    
    const response = await apiClient.get(`/products/details/?${params.toString()}`);
    return response.data;
  },
};

// ==================== REACT QUERY CONFIGURATION ====================

export const billingQueries = {
  // Query keys for React Query
  keys: {
    all: ['billing'] as const,
    invoices: () => [...billingQueries.keys.all, 'invoices'] as const,
    invoice: (id: string) => [...billingQueries.keys.invoices(), id] as const,
    stats: () => [...billingQueries.keys.all, 'stats'] as const,
    customers: () => [...billingQueries.keys.all, 'customers'] as const,
    products: (search?: string) => [...billingQueries.keys.all, 'products', search] as const,
  },

  // Query functions
  invoices: (filters?: BillingFilters) => ({
    queryKey: [...billingQueries.keys.invoices(), filters],
    queryFn: () => billingAPI.getInvoices(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  invoice: (id: string) => ({
    queryKey: billingQueries.keys.invoice(id),
    queryFn: () => billingAPI.getInvoiceDetail(id),
    enabled: !!id,
  }),

  stats: () => ({
    queryKey: billingQueries.keys.stats(),
    queryFn: () => billingAPI.getBillingStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  customers: () => ({
    queryKey: billingQueries.keys.customers(),
    queryFn: () => billingAPI.getInvoiceCustomers(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  }),

  products: (searchTerm?: string) => ({
    queryKey: billingQueries.keys.products(searchTerm),
    queryFn: () => billingAPI.getInvoiceProducts(searchTerm),
    enabled: true,
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),
};

// ==================== LEGACY EXPORTS ====================

// Legacy function exports for backward compatibility
export const createInvoice = billingAPI.createInvoice;
export const updateInvoice = billingAPI.updateInvoice;

// Export types for convenience
export type { Invoice, CreateInvoicePayload, UpdateInvoicePayload, BillingFilters, BillingStats };