import { apiClient } from './client';

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id?: number;
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
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  job?: {
    id: number;
    jobType: string;
    status: string;
  };
  items?: InvoiceItem[];
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

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: number;
}

export interface InvoiceResponse {
  invoices: Invoice[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Get all invoices with filters
export const getInvoices = async (filters: InvoiceFilters = {}): Promise<InvoiceResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.customerId) params.append('customerId', filters.customerId.toString());

  const response = await apiClient.get(`/billing?${params.toString()}`);
  return response.data;
};

// Get single invoice by ID
export const getInvoiceById = async (id: number): Promise<{ invoice: Invoice }> => {
  const response = await apiClient.get(`/billing/${id}`);
  return response.data;
};

// Create new invoice
export const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; invoice: Invoice }> => {
  const response = await apiClient.post('/billing', invoiceData);
  return response.data;
};

// Update invoice
export const updateInvoice = async (id: number, invoiceData: Partial<Invoice>): Promise<{ message: string; invoice: Invoice }> => {
  const response = await apiClient.put(`/billing/${id}`, invoiceData);
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/billing/${id}`);
  return response.data;
};

// Update invoice status
export const updateInvoiceStatus = async (id: number, status: string, paymentMethod?: string): Promise<{ message: string; invoice: Invoice }> => {
  const response = await apiClient.patch(`/billing/${id}/status`, { status, paymentMethod });
  return response.data;
};

// Get billing statistics
export const getBillingStats = async (): Promise<{ stats: BillingStats }> => {
  const response = await apiClient.get('/billing/stats');
  return response.data;
};

// Generate invoice from job
export const generateInvoiceFromJob = async (jobId: number, invoiceData: {
  customerId: number;
  dueDate: string;
  notes?: string;
  terms?: string;
}): Promise<{ message: string; invoice: Invoice }> => {
  const response = await apiClient.post(`/billing/generate-from-job/${jobId}`, invoiceData);
  return response.data;
}; 