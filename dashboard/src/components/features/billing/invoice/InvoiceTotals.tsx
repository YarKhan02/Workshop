import React from 'react';

interface InvoiceTotalsProps {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  onDiscountChange: (discount: number) => void;
  formatCurrency: (amount: number) => string;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  subtotal,
  taxAmount,
  discountAmount,
  totalAmount,
  onDiscountChange,
  formatCurrency,
}) => {
  return (
    <div className="border-t border-gray-700 pt-6">
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Subtotal:</span>
            <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Tax (10%):</span>
            <span className="font-medium text-white">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Discount:</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discountAmount || ''}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border border-gray-600 rounded text-right bg-gray-700 text-white"
            />
          </div>
          <div className="border-t border-gray-700 pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-lg font-semibold text-white">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
