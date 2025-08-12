// ==================== CUSTOMER SELECTOR COMPONENT ====================

import React from 'react';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { customerAPI } from '../../../../api/booking';
import { useTheme, cn } from '../../../ui';

interface Customer {
  id: string;
  name: string;
  phone_number: string;
  email: string;
}

interface CustomerSelectorProps {
  value: string;
  onChange: (customerId: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => {
  const { theme } = useTheme();

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: customerAPI.getCustomerDetails,
  });

  return (
    <div className={className}>
      <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
        <User className="inline-block w-4 h-4 mr-2" />
        Customer {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 border rounded-xl transition-all duration-300",
          theme.background,
          theme.textPrimary,
          theme.border,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        required={required}
        disabled={disabled || isLoading}
      >
        <option value="">
          {isLoading ? "Loading customers..." : "Select a customer..."}
        </option>
        {(customers as Customer[]).map((customer: Customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} - {customer.phone_number}
          </option>
        ))}
      </select>
    </div>
  );
};
