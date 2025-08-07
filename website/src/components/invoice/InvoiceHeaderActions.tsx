import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import Button from '../ui/Button';

interface InvoiceHeaderActionsProps {
  onPrint: () => void;
  onDownload: () => void;
  downloading: boolean;
}

const InvoiceHeaderActions: React.FC<InvoiceHeaderActionsProps> = ({
  onPrint,
  onDownload,
  downloading,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 print:hidden">
      <Link
        to="/my-bookings"
        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Bookings
      </Link>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onPrint}
          className="flex items-center gap-2"
        >
          <Printer className="w-5 h-5" />
          Print
        </Button>
        <Button
          variant="primary"
          onClick={onDownload}
          disabled={downloading}
          className="flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          {downloading ? 'Downloading...' : 'Download PDF'}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceHeaderActions;
