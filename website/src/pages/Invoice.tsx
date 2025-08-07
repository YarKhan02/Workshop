import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  Calendar, 
  Clock, 
  Car,
  CreditCard,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface InvoiceData {
  id: string;
  booking_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  booking: {
    id: string;
    service: {
      name: string;
      description: string;
    };
    car: {
      make: string;
      model: string;
      year: string;
      license_plate: string;
      color: string;
    };
    time_slot: {
      date: string;
      start_time: string;
      end_time: string;
    };
    customer_notes?: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

const Invoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      const response = await apiService.getInvoice(invoiceId);
      setInvoice(response.data);
    } catch (error: any) {
      toast.error('Failed to load invoice');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    
    setDownloading(true);
    try {
      const blob = await apiService.downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Invoice not found</div>
          <Link to="/my-bookings" className="text-orange-400 hover:text-orange-300">
            Return to bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8 print:hidden">
            <Link
              to="/my-bookings"
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Bookings
            </Link>
            
            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-black/50 border border-orange-900/30 rounded-xl text-white hover:border-orange-500 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-semibold hover:from-orange-400 hover:to-orange-500 transition-colors disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold text-black mb-2">INVOICE</h1>
                <div className="text-gray-600">
                  <div>Invoice #{invoice.id.slice(-8).toUpperCase()}</div>
                  <div>Date: {new Date(invoice.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600 mb-2">Detailing Hub</div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    123 Car Care Street, Mumbai 400001
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +91 9876543210
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    contact@detailinghub.com
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Booking Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600">Bill To:</h3>
                <div className="space-y-2">
                  <div className="font-semibold">{invoice.customer.first_name} {invoice.customer.last_name}</div>
                  <div className="text-gray-600">{invoice.customer.email}</div>
                  <div className="text-gray-600">{invoice.customer.phone}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600">Service Details:</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    {invoice.booking.car.year} {invoice.booking.car.make} {invoice.booking.car.model}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {invoice.booking.car.license_plate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {invoice.booking.time_slot.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {invoice.booking.time_slot.start_time} - {invoice.booking.time_slot.end_time}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details Table */}
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
                      <td className="p-4 font-medium">{invoice.booking.service.name}</td>
                      <td className="p-4 text-gray-600">{invoice.booking.service.description}</td>
                      <td className="p-4 text-right font-medium">₹{invoice.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Notes */}
            {invoice.booking.customer_notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-orange-600">Customer Notes:</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                  {invoice.booking.customer_notes}
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="border-t border-gray-300 pt-8">
              <div className="max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{invoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST 18%):</span>
                    <span className="font-medium">₹{invoice.tax_amount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-orange-600">₹{invoice.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Payment Status: Paid</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 mt-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Payment Method: {invoice.payment_method}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
              <p className="mb-2">Thank you for choosing Detailing Hub!</p>
              <p>For any queries regarding this invoice, please contact us at +91 9876543210 or email contact@detailinghub.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
