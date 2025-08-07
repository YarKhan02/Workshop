import React from 'react';
import { CheckCircle, CreditCard } from 'lucide-react';

interface InvoicePaymentSummaryProps {
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
}

const InvoicePaymentSummary: React.FC<InvoicePaymentSummaryProps> = ({
  amount,
  taxAmount,
  totalAmount,
  paymentStatus,
  paymentMethod,
}) => {
  return (
    <div className="border-t border-gray-300 pt-8">
      <div className="max-w-md ml-auto">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (GST 18%):</span>
            <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-orange-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Payment Status: {paymentStatus}</span>
          </div>
          <div className="flex items-center gap-2 text-green-600 mt-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Payment Method: {paymentMethod}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentSummary;
