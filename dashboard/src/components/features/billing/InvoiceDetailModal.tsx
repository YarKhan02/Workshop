// InvoiceDetailModal.tsx - Modal for viewing invoice details and updating status

import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertTriangle, XCircle, Package, FileText } from 'lucide-react';
import Portal from '../../shared/utility/Portal';
import type { Invoice, InvoiceStatus, PaymentMethod } from '../../../types/billing';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onStatusUpdate: (id: string, status: InvoiceStatus, paymentMethod?: PaymentMethod) => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onStatusUpdate,
}) => {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState<InvoiceStatus>(invoice.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(invoice.paymentMethod || '');
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status: InvoiceStatus) => {
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
      case 'partially_paid':
      case 'partial':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'partially_paid':
      case 'partial':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatStatus = (status: InvoiceStatus) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleStatusUpdate = async () => {
    if (newStatus === invoice.status) {
      setShowStatusUpdate(false);
      return;
    }

    setUpdating(true);
    try {
      await onStatusUpdate(
        invoice.id,
        newStatus,
        paymentMethod ? (paymentMethod as PaymentMethod) : undefined
      );
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
                Invoice #{invoice.invoiceNumber || invoice.id.slice(0, 8)}
              </h2>
              <p className="text-sm text-gray-600">
                Created on {formatDate(invoice.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{' '}
                    {invoice.customer.first_name} {invoice.customer.last_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {invoice.customer.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {invoice.customer.phone_number}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getStatusIcon(invoice.status)}
                      {formatStatus(invoice.status)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                  {invoice.paidDate && (
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Paid Date:</span> {formatDate(invoice.paidDate)}
                      </p>
                    </div>
                  )}
                  {invoice.paymentMethod && (
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Payment Method:</span>{' '}
                        {invoice.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
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
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.description}</p>
                              {item.productName && (
                                <p className="text-xs text-gray-500">
                                  {item.productName} - {item.productVariant}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="text-right py-3 px-4 text-sm text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
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

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
              </div>
            )}

            {/* Terms */}
            {invoice.terms && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.terms}</p>
              </div>
            )}

            {/* Status Update Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-900">Update Status</h4>
                <button
                  onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {showStatusUpdate ? 'Cancel' : 'Change Status'}
                </button>
              </div>

              {showStatusUpdate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    {(newStatus === 'paid' || newStatus === 'partially_paid') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select method</option>
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="upi">UPI</option>
                          <option value="wallet">Wallet</option>
                          <option value="check">Check</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating || newStatus === invoice.status}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default InvoiceDetailModal;
