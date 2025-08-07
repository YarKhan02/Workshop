import { apiClient } from './client';
import type { 
  PaymentFormData, 
  UPIPaymentData, 
  WalletPaymentData, 
  PaymentResponse 
} from '../interfaces/payment';

// Payment API functions
export const paymentAPI = {
  // Process card payment
  processCardPayment: async (paymentData: PaymentFormData, bookingId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post('/api/payments/card', {
      ...paymentData,
      bookingId
    });
    return response.data as PaymentResponse;
  },

  // Process UPI payment
  processUPIPayment: async (upiData: UPIPaymentData, bookingId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post('/api/payments/upi', {
      ...upiData,
      bookingId
    });
    return response.data as PaymentResponse;
  },

  // Process wallet payment
  processWalletPayment: async (walletData: WalletPaymentData, bookingId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post('/api/payments/wallet', {
      ...walletData,
      bookingId
    });
    return response.data as PaymentResponse;
  },

  // Verify payment status
  verifyPayment: async (transactionId: string): Promise<PaymentResponse> => {
    const response = await apiClient.get(`/api/payments/verify/${transactionId}`);
    return response.data as PaymentResponse;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await apiClient.get('/api/payments/methods');
    return response.data;
  }
};

// Payment queries for easier usage
export const paymentQueries = {
  payments: paymentAPI
};
