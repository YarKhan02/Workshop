import React from 'react';

interface InvoiceCustomerNotesProps {
  notes: string;
}

const InvoiceCustomerNotes: React.FC<InvoiceCustomerNotesProps> = ({ notes }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2 text-orange-600">Customer Notes:</h3>
      <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
        {notes}
      </div>
    </div>
  );
};

export default InvoiceCustomerNotes;
