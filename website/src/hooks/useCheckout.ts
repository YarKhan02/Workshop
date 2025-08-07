import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentQueries } from '../services/api/payment';
import toast from 'react-hot-toast';
import type { 
  PaymentFormData, 
  CheckoutBookingDetails, 
  PaymentProcessingState,
  PaymentResponse 
} from '../services/interfaces/payment';

export const useCheckout = (bookingData: CheckoutBookingDetails | null) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [processingState, setProcessingState] = useState<PaymentProcessingState>({
    isProcessing: false,
    method: 'card',
    step: 'form'
  });
  
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!bookingData) {
      toast.error('No booking data found');
      navigate('/book');
    }
  }, [bookingData, navigate]);

  // Validation functions
  const validateCardForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'billingAddress') {
        setFormData(prev => ({
          ...prev,
          billingAddress: {
            ...prev.billingAddress,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const processPayment = async (bookingId: string = 'temp-booking-id'): Promise<void> => {
    setProcessingState({
      isProcessing: true,
      method: paymentMethod,
      step: 'processing'
    });

    try {
      let response: PaymentResponse;

      switch (paymentMethod) {
        case 'card':
          if (!validateCardForm()) {
            setProcessingState({
              isProcessing: false,
              method: paymentMethod,
              step: 'form'
            });
            return;
          }
          response = await paymentQueries.payments.processCardPayment(formData, bookingId);
          break;
        
        case 'upi':
          // UPI payment would be handled separately
          throw new Error('UPI payment not implemented in this flow');
        
        case 'wallet':
          // Wallet payment would be handled separately
          throw new Error('Wallet payment not implemented in this flow');
        
        default:
          throw new Error('Invalid payment method');
      }

      if (response.success) {
        setProcessingState({
          isProcessing: false,
          method: paymentMethod,
          step: 'success'
        });
        
        toast.success('Payment successful!');
        
        // Redirect to confirmation page after a delay
        setTimeout(() => {
          navigate(`/booking-confirmation?booking=${bookingId}&payment=${response.transactionId}`);
        }, 2000);
      } else {
        throw new Error(response.error || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      setProcessingState({
        isProcessing: false,
        method: paymentMethod,
        step: 'error',
        error: errorMessage
      });
      
      toast.error(errorMessage);
    }
  };

  const processUPIPayment = async (vpa: string, bookingId: string = 'temp-booking-id'): Promise<void> => {
    setProcessingState({
      isProcessing: true,
      method: 'upi',
      step: 'processing'
    });

    try {
      const response = await paymentQueries.payments.processUPIPayment(
        { vpa, amount: bookingData?.price || 0 },
        bookingId
      );

      if (response.success) {
        setProcessingState({
          isProcessing: false,
          method: 'upi',
          step: 'success'
        });
        
        toast.success('UPI payment successful!');
        
        setTimeout(() => {
          navigate(`/booking-confirmation?booking=${bookingId}&payment=${response.transactionId}`);
        }, 2000);
      } else {
        throw new Error(response.error || 'UPI payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'UPI payment failed';
      
      setProcessingState({
        isProcessing: false,
        method: 'upi',
        step: 'error',
        error: errorMessage
      });
      
      toast.error(errorMessage);
    }
  };

  const processWalletPayment = async (
    walletType: string, 
    phone: string | undefined, 
    bookingId: string = 'temp-booking-id'
  ): Promise<void> => {
    setProcessingState({
      isProcessing: true,
      method: 'wallet',
      step: 'processing'
    });

    try {
      const response = await paymentQueries.payments.processWalletPayment(
        { walletType: walletType as any, phone },
        bookingId
      );

      if (response.success) {
        setProcessingState({
          isProcessing: false,
          method: 'wallet',
          step: 'success'
        });
        
        toast.success('Wallet payment successful!');
        
        setTimeout(() => {
          navigate(`/booking-confirmation?booking=${bookingId}&payment=${response.transactionId}`);
        }, 2000);
      } else {
        throw new Error(response.error || 'Wallet payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Wallet payment failed';
      
      setProcessingState({
        isProcessing: false,
        method: 'wallet',
        step: 'error',
        error: errorMessage
      });
      
      toast.error(errorMessage);
    }
  };

  const resetProcessingState = () => {
    setProcessingState({
      isProcessing: false,
      method: paymentMethod,
      step: 'form'
    });
  };

  return {
    paymentMethod,
    setPaymentMethod,
    formData,
    handleInputChange,
    errors,
    processingState,
    processPayment,
    processUPIPayment,
    processWalletPayment,
    resetProcessingState
  };
};

export default useCheckout;
