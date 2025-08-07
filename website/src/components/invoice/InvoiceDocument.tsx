import React from 'react';
import { InvoiceData, CompanyInfo } from '../../services/interfaces/invoice';
import InvoiceHeader from './InvoiceHeader';
import InvoiceCustomerInfo from './InvoiceCustomerInfo';
import InvoiceServiceDetails from './InvoiceServiceDetails';
import InvoiceServicesTable from './InvoiceServicesTable';
import InvoiceCustomerNotes from './InvoiceCustomerNotes';
import InvoicePaymentSummary from './InvoicePaymentSummary';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceDocumentProps {
  invoice: InvoiceData;
  companyInfo: CompanyInfo;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice, companyInfo }) => {
  return (
    <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <InvoiceHeader
        invoiceId={invoice.id}
        createdAt={invoice.created_at}
        companyInfo={companyInfo}
      />

      {/* Customer & Booking Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <InvoiceCustomerInfo customer={invoice.customer} />
        <InvoiceServiceDetails booking={invoice.booking} />
      </div>

      {/* Service Details Table */}
      <InvoiceServicesTable
        service={invoice.booking.service}
        amount={invoice.amount}
      />

      {/* Additional Notes */}
      {invoice.booking.customer_notes && (
        <InvoiceCustomerNotes notes={invoice.booking.customer_notes} />
      )}

      {/* Payment Summary */}
      <InvoicePaymentSummary
        amount={invoice.amount}
        taxAmount={invoice.tax_amount}
        totalAmount={invoice.total_amount}
        paymentStatus={invoice.payment_status}
        paymentMethod={invoice.payment_method}
      />

      {/* Footer */}
      <InvoiceFooter companyInfo={companyInfo} />
    </div>
  );
};

export default InvoiceDocument;
