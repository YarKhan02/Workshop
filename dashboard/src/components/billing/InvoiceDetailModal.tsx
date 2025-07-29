import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import type { Invoice } from '../../api/billing';
import Portal from '../shared/utility/Portal';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onStatusUpdate: (id: number, status: string, paymentMethod?: string) => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onStatusUpdate,
}) => {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState(invoice.status);
  const [paymentMethod, setPaymentMethod] = useState(invoice.paymentMethod || '');
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await onStatusUpdate(invoice.id!, newStatus, paymentMethod || undefined);
      setShowStatusUpdate(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invoice #{invoice.invoiceNumber}
              </h2>
              <p className="text-sm text-gray-600">
                Created on {formatDate(invoice.createdAt!)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStatusUpdate(true)}
                className="btn-secondary"
              >
                Update Status
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Invoice Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                {invoice.customer && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {invoice.customer.firstName} {invoice.customer.lastName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {invoice.customer.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {invoice.customer.phone}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}
                  </p>
                  {invoice.paidDate && (
                    <p className="text-sm">
                      <span className="font-medium">Paid Date:</span> {formatDate(invoice.paidDate)}
                    </p>
                  )}
                  {invoice.paymentMethod && (
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span> {invoice.paymentMethod.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Information */}
            {invoice.job && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Related Job</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Job ID</p>
                      <p className="text-sm text-gray-900">#{invoice.job.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Job Type</p>
                      <p className="text-sm text-gray-900">{invoice.job.jobType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-sm text-gray-900">{invoice.job.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Quantity</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Unit Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items && invoice.items.length > 0 ? (
                      invoice.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium">{formatCurrency(invoice.discountAmount)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-semibold">{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {invoice.notes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Terms & Conditions</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showStatusUpdate && (
        <Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Invoice Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as "draft" | "pending" | "paid" | "overdue" | "cancelled" | "partial")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                {newStatus === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="wallet">Wallet</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowStatusUpdate(false)}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </Portal>
  );
};

export default InvoiceDetailModal; 