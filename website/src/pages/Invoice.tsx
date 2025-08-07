import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Layout, 
  LoadingSpinner, 
  ErrorState,
  InvoiceHeaderActions,
  InvoiceDocument
} from '../components';
import { useInvoice } from '../hooks/useInvoice';
import { CompanyInfo } from '../services/interfaces/invoice';

// Company information - could be moved to a config file
const COMPANY_INFO: CompanyInfo = {
  name: 'Detailing Hub',
  address: '123 Car Care Street, Mumbai 400001',
  phone: '+91 9876543210',
  email: 'contact@detailinghub.com',
};

const Invoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    invoice, 
    loading, 
    downloading, 
    error, 
    downloadInvoice, 
    printInvoice 
  } = useInvoice(id || null);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading invoice..." />
      </Layout>
    );
  }

  if (error || !invoice) {
    return (
      <Layout>
        <ErrorState message={error || 'Invoice not found'} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Actions */}
            <InvoiceHeaderActions
              onPrint={printInvoice}
              onDownload={downloadInvoice}
              downloading={downloading}
            />

            {/* Invoice Content */}
            <InvoiceDocument 
              invoice={invoice} 
              companyInfo={COMPANY_INFO}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Invoice;