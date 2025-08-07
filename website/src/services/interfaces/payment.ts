// Payment and Checkout interfaces

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  billingAddress: BillingAddress;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentMethod {
  id: 'card' | 'upi' | 'wallet';
  name: string;
  icon: any; // LucideIcon type
}

export interface CheckoutBookingDetails {
  service: string;
  price: number;
  originalPrice: number;
  car: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    color: string;
  };
  timeSlot: {
    date: string;
    time: string;
  };
  customerNotes?: string;
}

export interface PaymentProcessingState {
  isProcessing: boolean;
  method: 'card' | 'upi' | 'wallet';
  step: 'form' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface UPIPaymentData {
  vpa: string; // Virtual Payment Address
  amount: number;
}

export interface WalletPaymentData {
  walletType: 'paytm' | 'phonepe' | 'googlepay' | 'amazonpay';
  phone?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
}
