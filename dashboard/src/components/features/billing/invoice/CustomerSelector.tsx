import React from 'react';
import { Loader2 } from 'lucide-react';
import type { CustomerInvoice } from '../../../../types';

interface CustomerSelectorProps {
  value: string;
  onChange: (customerId: string) => void;
  customers: CustomerInvoice[] | undefined;
  isLoading: boolean;
  error?: string;
  required?: boolean;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  value,
  onChange,
  customers,
  isLoading,
  error,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Customer {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-300">Loading customers...</span>
          </div>
        ) : (
          <select
            name="customerId"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white appearance-none ${
              error ? "border-red-500" : "border-gray-600"
            }`}
            required={required}
          >
            <option value="">Select customer...</option>
            {customers?.map((customer: CustomerInvoice) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
        )}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default CustomerSelector;
