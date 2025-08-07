import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CompanyInfo } from '../../services/interfaces/invoice';

interface InvoiceHeaderProps {
  invoiceId: string;
  createdAt: string;
  companyInfo: CompanyInfo;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoiceId,
  createdAt,
  companyInfo,
}) => {
  return (
    <div className="flex justify-between items-start mb-12">
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">INVOICE</h1>
        <div className="text-gray-600">
          <div>Invoice #{invoiceId.slice(-8).toUpperCase()}</div>
          <div>Date: {new Date(createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-2xl font-bold text-orange-600 mb-2">{companyInfo.name}</div>
        <div className="text-gray-600 text-sm space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {companyInfo.address}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {companyInfo.phone}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {companyInfo.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
