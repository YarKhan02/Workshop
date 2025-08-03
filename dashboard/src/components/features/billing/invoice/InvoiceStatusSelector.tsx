import React from 'react';
import type { InvoiceStatus } from '../../../../types/billing';

interface InvoiceStatusSelectorProps {
  value: InvoiceStatus;
  onChange: (status: InvoiceStatus) => void;
}

const InvoiceStatusSelector: React.FC<InvoiceStatusSelectorProps> = ({
  value,
  onChange,
}) => {
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'partial', label: 'Partial' },
  ] as const;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as InvoiceStatus)}
        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InvoiceStatusSelector;
