import React from 'react';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface PaymentProcessingProps {
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
  paymentMethod: 'card' | 'upi' | 'wallet';
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  isProcessing,
  isSuccess,
  isError,
  error,
  paymentMethod
}) => {
  const getMethodName = () => {
    switch (paymentMethod) {
      case 'card': return 'Card';
      case 'upi': return 'UPI';
      case 'wallet': return 'Wallet';
      default: return 'Payment';
    }
  };

  if (isProcessing) {
    return (
      <div className={`${themeClasses.card.primary} p-8 text-center`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader className={`w-12 h-12 ${themeClasses.iconColors.orange} animate-spin`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Processing Payment
            </h3>
            <p className="text-white/70">
              Please wait while we process your {getMethodName()} payment...
            </p>
            <p className="text-sm text-white/50 mt-2">
              Do not close this window or press the back button
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={`${themeClasses.card.primary} p-8 text-center`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Payment Successful!
            </h3>
            <p className="text-white/70">
              Your {getMethodName()} payment has been processed successfully.
            </p>
            <p className="text-sm text-white/50 mt-2">
              Redirecting to confirmation page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${themeClasses.card.primary} p-8 text-center`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Payment Failed
            </h3>
            <p className="text-red-400 mb-2">
              {error || 'There was an error processing your payment'}
            </p>
            <p className="text-sm text-white/50">
              Please try again or use a different payment method
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentProcessing;
