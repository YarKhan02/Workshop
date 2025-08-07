import React from 'react';
import { InvoiceCustomer } from '../../services/interfaces/invoice';

interface InvoiceCustomerInfoProps {
  customer: InvoiceCustomer;
}

const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({ customer }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-orange-600">Bill To:</h3>
      <div className="space-y-2">
        <div className="font-semibold">
          {customer.first_name} {customer.last_name}
        </div>
        <div className="text-gray-600">{customer.email}</div>
        <div className="text-gray-600">{customer.phone}</div>
      </div>
    </div>
  );
};

export default InvoiceCustomerInfo;
