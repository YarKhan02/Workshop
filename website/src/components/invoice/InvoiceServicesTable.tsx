import React from 'react';
import { InvoiceService } from '../../services/interfaces/invoice';

interface InvoiceServicesTableProps {
  service: InvoiceService;
  amount: number;
}

const InvoiceServicesTable: React.FC<InvoiceServicesTableProps> = ({
  service,
  amount,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-orange-600">Services Provided:</h3>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-50">
            <tr>
              <th className="text-left p-4 font-semibold">Service</th>
              <th className="text-left p-4 font-semibold">Description</th>
              <th className="text-right p-4 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="p-4 font-medium">{service.name}</td>
              <td className="p-4 text-gray-600">{service.description}</td>
              <td className="p-4 text-right font-medium">₹{amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceServicesTable;
