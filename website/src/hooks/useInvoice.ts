import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { invoiceAPI } from '../services/api/invoice';
import { InvoiceData, InvoiceLoadingState } from '../services/interfaces/invoice';

export const useInvoice = (invoiceId: string | null) => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [state, setState] = useState<InvoiceLoadingState>({
    loading: true,
    downloading: false,
    error: null,
  });

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoice = async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await invoiceAPI.getInvoice(id);
      setInvoice(response.data || null);
    } catch (error: any) {
      const errorMessage = 'Failed to load invoice';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
      navigate('/my-bookings');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const downloadInvoice = async () => {
    if (!invoiceId) return;
    
    setState(prev => ({ ...prev, downloading: true }));
    try {
      const blob = await invoiceAPI.downloadInvoice(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setState(prev => ({ ...prev, downloading: false }));
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return {
    invoice,
    loading: state.loading,
    downloading: state.downloading,
    error: state.error,
    downloadInvoice,
    printInvoice,
  };
};
