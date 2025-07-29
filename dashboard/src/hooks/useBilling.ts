// Billing Hooks - Custom hooks for billing data management with React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { billingAPI, billingQueries } from '../api/billing';
import type {
  Invoice,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  BillingFilters,
  InvoiceStatus,
  PaymentMethod,
} from '../types/billing';

// ==================== QUERY HOOKS ====================

/**
 * Hook to fetch invoices with filtering
 */
export const useInvoices = (filters?: BillingFilters) => {
  const result = useQuery(billingQueries.invoices(filters));
  
  if (result.error) {
    console.error('Error fetching invoices:', result.error);
    toast.error('Failed to load invoices');
  }
  
  return result;
};

/**
 * Hook to fetch a single invoice by ID
 */
export const useInvoice = (invoiceId: string) => {
  const result = useQuery(billingQueries.invoice(invoiceId));
  
  if (result.error) {
    console.error('Error fetching invoice:', result.error);
    toast.error('Failed to load invoice details');
  }
  
  return result;
};

/**
 * Hook to fetch billing statistics
 */
export const useBillingStats = () => {
  const result = useQuery(billingQueries.stats());
  
  if (result.error) {
    console.error('Error fetching billing stats:', result.error);
    // Don't show error toast for stats as we have fallback
  }
  
  return result;
};

/**
 * Hook to fetch customers for invoices
 */
export const useInvoiceCustomers = () => {
  const result = useQuery(billingQueries.customers());
  
  if (result.error) {
    console.error('Error fetching customers:', result.error);
    toast.error('Failed to load customers');
  }
  
  return result;
};

/**
 * Hook to fetch products for invoice items
 */
export const useInvoiceProducts = (searchTerm?: string) => {
  const result = useQuery(billingQueries.products(searchTerm));
  
  if (result.error) {
    console.error('Error fetching products:', result.error);
    toast.error('Failed to load products');
  }
  
  return result;
};

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create a new invoice
 */
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceData: CreateInvoicePayload) => 
      billingAPI.createInvoice(invoiceData),
    onSuccess: (newInvoice) => {
      // Invalidate and refetch invoice queries
      queryClient.invalidateQueries({ queryKey: billingQueries.keys.invoices() });
      queryClient.invalidateQueries({ queryKey: billingQueries.keys.stats() });
      
      // Optimistically add the new invoice to cache
      queryClient.setQueryData(
        billingQueries.keys.invoices(),
        (oldData: Invoice[] | undefined) => {
          if (!oldData) return [newInvoice];
          return [newInvoice, ...oldData];
        }
      );

      toast.success('Invoice created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
    },
  });
};

/**
 * Hook to update an existing invoice
 */
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, invoiceData }: { 
      invoiceId: string; 
      invoiceData: UpdateInvoicePayload 
    }) => billingAPI.updateInvoice(invoiceId, invoiceData),
    onSuccess: (updatedInvoice, { invoiceId }) => {
      // Update the specific invoice in cache
      queryClient.setQueryData(
        billingQueries.keys.invoice(invoiceId),
        updatedInvoice
      );

      // Update the invoice in the list cache
      queryClient.setQueryData(
        billingQueries.keys.invoices(),
        (oldData: Invoice[] | undefined) => {
          if (!oldData) return [updatedInvoice];
          return oldData.map(invoice => 
            invoice.id === invoiceId ? updatedInvoice : invoice
          );
        }
      );

      // Invalidate stats to reflect changes
      queryClient.invalidateQueries({ queryKey: billingQueries.keys.stats() });

      toast.success('Invoice updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice. Please try again.');
    },
  });
};

/**
 * Hook to delete an invoice
 */
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => billingAPI.deleteInvoice(invoiceId),
    onSuccess: (_, invoiceId) => {
      // Remove the invoice from all relevant queries
      queryClient.removeQueries({ queryKey: billingQueries.keys.invoice(invoiceId) });
      
      // Remove from list cache
      queryClient.setQueryData(
        billingQueries.keys.invoices(),
        (oldData: Invoice[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(invoice => invoice.id !== invoiceId);
        }
      );

      // Invalidate stats to reflect changes
      queryClient.invalidateQueries({ queryKey: billingQueries.keys.stats() });

      toast.success('Invoice deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice. Please try again.');
    },
  });
};

/**
 * Hook to update invoice status
 */
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      invoiceId, 
      status, 
      paymentMethod 
    }: { 
      invoiceId: string; 
      status: InvoiceStatus; 
      paymentMethod?: PaymentMethod 
    }) => billingAPI.updateInvoiceStatus(invoiceId, status, paymentMethod),
    onSuccess: (updatedInvoice, { invoiceId }) => {
      // Update the specific invoice in cache
      queryClient.setQueryData(
        billingQueries.keys.invoice(invoiceId),
        updatedInvoice
      );

      // Update the invoice in the list cache
      queryClient.setQueryData(
        billingQueries.keys.invoices(),
        (oldData: Invoice[] | undefined) => {
          if (!oldData) return [updatedInvoice];
          return oldData.map(invoice => 
            invoice.id === invoiceId ? updatedInvoice : invoice
          );
        }
      );

      // Invalidate stats to reflect status changes
      queryClient.invalidateQueries({ queryKey: billingQueries.keys.stats() });

      toast.success('Invoice status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status. Please try again.');
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to get refetch functions for manual data refresh
 */
export const useBillingRefresh = () => {
  const queryClient = useQueryClient();

  const refreshInvoices = () => {
    queryClient.invalidateQueries({ queryKey: billingQueries.keys.invoices() });
  };

  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: billingQueries.keys.stats() });
  };

  const refreshCustomers = () => {
    queryClient.invalidateQueries({ queryKey: billingQueries.keys.customers() });
  };

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: billingQueries.keys.all });
  };

  return {
    refreshInvoices,
    refreshStats,
    refreshCustomers,
    refreshAll,
  };
};

/**
 * Hook to get optimistic cache updates for better UX
 */
export const useBillingOptimistic = () => {
  const queryClient = useQueryClient();

  const optimisticStatusUpdate = (
    invoiceId: string, 
    newStatus: InvoiceStatus,
    paymentMethod?: PaymentMethod
  ) => {
    // Optimistically update the invoice status in cache
    queryClient.setQueryData(
      billingQueries.keys.invoice(invoiceId),
      (oldInvoice: Invoice | undefined) => {
        if (!oldInvoice) return oldInvoice;
        return {
          ...oldInvoice,
          status: newStatus,
          ...(paymentMethod && { paymentMethod }),
          ...(newStatus === 'paid' && { paidDate: new Date().toISOString() }),
        };
      }
    );

    // Update in list cache too
    queryClient.setQueryData(
      billingQueries.keys.invoices(),
      (oldData: Invoice[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(invoice => 
          invoice.id === invoiceId 
            ? {
                ...invoice,
                status: newStatus,
                ...(paymentMethod && { paymentMethod }),
                ...(newStatus === 'paid' && { paidDate: new Date().toISOString() }),
              }
            : invoice
        );
      }
    );
  };

  return {
    optimisticStatusUpdate,
  };
};
