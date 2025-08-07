import { apiClient } from '../api';
import { InvoiceData } from '../interfaces/invoice';

export const invoiceAPI = {
  async getInvoice(id: string) {
    return apiClient.get<InvoiceData>(`/invoices/${id}/`);
  },

  async getMyInvoices() {
    return apiClient.get<InvoiceData[]>('/invoices/');
  },

  async downloadInvoice(id: string): Promise<Blob> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/invoices/${id}/download/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
    
    return response.blob();
  }
};

export const invoiceQueries = {
  getInvoice: (id: string) => ({
    queryKey: ['invoice', id],
    queryFn: () => invoiceAPI.getInvoice(id),
  }),

  getMyInvoices: () => ({
    queryKey: ['invoices'],
    queryFn: () => invoiceAPI.getMyInvoices(),
  }),
};
