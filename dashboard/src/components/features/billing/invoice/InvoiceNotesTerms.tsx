import React from 'react';

interface InvoiceNotesTermsProps {
  notes: string;
  terms: string;
  onNotesChange: (notes: string) => void;
  onTermsChange: (terms: string) => void;
}

const InvoiceNotesTerms: React.FC<InvoiceNotesTermsProps> = ({
  notes,
  terms,
  onNotesChange,
  onTermsChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Terms & Conditions
        </label>
        <textarea
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Payment terms and conditions..."
        />
      </div>
    </div>
  );
};

export default InvoiceNotesTerms;
