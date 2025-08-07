import React from 'react';
import { CompanyInfo } from '../../services/interfaces/invoice';

interface InvoiceFooterProps {
  companyInfo: CompanyInfo;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ companyInfo }) => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
      <p className="mb-2">Thank you for choosing {companyInfo.name}!</p>
      <p>
        For any queries regarding this invoice, please contact us at {companyInfo.phone} or email {companyInfo.email}
      </p>
    </div>
  );
};

export default InvoiceFooter;
