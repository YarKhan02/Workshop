import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertTriangle, XCircle, Package, FileText } from 'lucide-react';
import Portal from '../../shared/utility/Portal';
import type { Invoice, InvoiceStatus, PaymentMethod } from '../../../types/billing';
import { getInvoiceField, formatPKRCurrency, formatStatus, formatDate } from '../../../utils/invoiceUtils';

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
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'pending':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'overdue':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'draft':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      case 'cancelled':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      case 'partially_paid':
      case 'partial':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-slate-800/95 to-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700/50">
          <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Invoice #{(invoice as any).invoice_number || getInvoiceField(invoice, 'invoiceNumber') || invoice.id?.toString().slice(0, 8) || 'N/A'}
              </h2>
              <p className="text-sm text-slate-400">
                Created on {formatDate((invoice as any).created_at || getInvoiceField(invoice, 'createdAt') || '')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
              <h3 className="text-lg font-medium text-slate-100 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-200">Name:</span>{' '}
                    {invoice.customer.first_name} {invoice.customer.last_name}
                  </p>
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-200">Email:</span> {invoice.customer.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-200">Phone:</span> {invoice.customer.phone_number}
                  </p>
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-200">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
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
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-slate-200">Due Date:</span> {
                        (invoice as any).due_date 
                          ? formatDate((invoice as any).due_date) 
                          : <span className="text-slate-500">No due date set</span>
                      }
                    </p>
                  </div>
                  {((invoice as any).paid_date || getInvoiceField(invoice, 'paidDate')) && (
                    <div>
                      <p className="text-sm text-slate-300">
                        <span className="font-medium text-slate-200">Paid Date:</span> {formatDate((invoice as any).paid_date || getInvoiceField(invoice, 'paidDate'))}
                      </p>
                    </div>
                  )}
                  {((invoice as any).payment_method || getInvoiceField(invoice, 'paymentMethod')) && (
                    <div>
                      <p className="text-sm text-slate-300">
                        <span className="font-medium text-slate-200">Payment Method:</span>{' '}
                        {((invoice as any).payment_method || getInvoiceField(invoice, 'paymentMethod'))?.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Information */}
            {invoice.job && (
              <div>
                <h3 className="text-lg font-medium text-slate-100 mb-4">Related Job</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400">Job ID</p>
                      <p className="text-sm text-slate-200">#{invoice.job.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Job Type</p>
                      <p className="text-sm text-slate-200">{invoice.job.jobType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Status</p>
                      <p className="text-sm text-slate-200">{invoice.job.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Items */}
            <div>
              <h3 className="text-lg font-medium text-slate-100 mb-4">Invoice Items</h3>
              <div className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-900/30">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-200">Description</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-200">Quantity</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-200">Unit Price</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-200">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {invoice.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-slate-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-slate-200">{item.description}</p>
                              {(item.productName || (item as any).product_name) && (
                                <p className="text-xs text-slate-400">
                                  {item.productName || (item as any).product_name} - {item.productVariant || (item as any).product_variant}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-sm text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="text-right py-3 px-4 text-sm text-slate-300">
                          {formatPKRCurrency((item as any).unit_price || item.unitPrice || 0)}
                        </td>
                        <td className="text-right py-3 px-4 text-sm font-medium text-slate-200">
                          {formatPKRCurrency((item as any).total_price || item.totalPrice || 0)}
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
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-medium text-slate-200">{formatPKRCurrency((invoice as any).total_amount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax:</span>
                  <span className="font-medium text-slate-200">{formatPKRCurrency((invoice as any).tax || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Discount:</span>
                  <span className="font-medium text-slate-200">{formatPKRCurrency((invoice as any).discount || 0)}</span>
                </div>
                <div className="border-t border-slate-700/50 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-slate-100">Total:</span>
                    <span className="text-lg font-semibold text-slate-100">{formatPKRCurrency((invoice as any).grand_total || (invoice as any).total_amount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {((invoice as any).notes || getInvoiceField(invoice, 'notes')) && (
              <div>
                <h4 className="text-md font-medium text-slate-100 mb-2">Notes</h4>
                <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">{(invoice as any).notes || getInvoiceField(invoice, 'notes')}</p>
              </div>
            )}

            {/* Terms */}
            {((invoice as any).terms || getInvoiceField(invoice, 'terms')) && (
              <div>
                <h4 className="text-md font-medium text-slate-100 mb-2">Terms & Conditions</h4>
                <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">{(invoice as any).terms || getInvoiceField(invoice, 'terms')}</p>
              </div>
            )}

            {/* Status Update Section */}
            <div className="border-t border-slate-700/50 pt-6">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-slate-100">Update Status</h4>
                <button
                  onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                  className="px-4 py-2 text-sm font-medium text-orange-400 hover:text-orange-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all"
                >
                  {showStatusUpdate ? 'Cancel' : 'Change Status'}
                </button>
              </div>

              {showStatusUpdate && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        New Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
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
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
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
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
