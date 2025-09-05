import React, { useState } from 'react';
import { Package, Download } from 'lucide-react';
import { useTheme, cn, ThemedModal, ThemedButton } from '../../ui';
import type { Invoice, InvoiceStatus, PaymentMethod } from '../../../types/billing';
import { getInvoiceField, formatDate, downloadInvoice } from '../../../utils/billingUtils';
import { formatCurrency } from '../../../utils/currency';
import {
  InvoiceStatusBadge,
} from './invoice';

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
  const { theme } = useTheme();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState<InvoiceStatus>(invoice.status);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(invoice.paymentMethod || '');
  const [updating, setUpdating] = useState(false);

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
    <ThemedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${(invoice as any).invoice_number || getInvoiceField(invoice, 'invoiceNumber') || invoice.id?.toString().slice(0, 8) || 'N/A'}`}
      subtitle={`Created on ${formatDate((invoice as any).created_at || getInvoiceField(invoice, 'createdAt') || '')}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Download Button at the top */}
        <div className="flex justify-end">
          <ThemedButton
            onClick={() => downloadInvoice(invoice)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </ThemedButton>
        </div>
        {/* Customer Information */}
        <div className={cn("p-4 rounded-lg border", theme.background, theme.border)}>
          <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={cn("text-sm", theme.textSecondary)}>
                <span className={cn("font-medium", theme.textPrimary)}>Name:</span>{' '}
                {invoice.customer.name}
              </p>
              <p className={cn("text-sm", theme.textSecondary)}>
                <span className={cn("font-medium", theme.textPrimary)}>Email:</span> {invoice.customer.email}
              </p>
            </div>
            <div>
              <p className={cn("text-sm", theme.textSecondary)}>
                <span className={cn("font-medium", theme.textPrimary)}>Phone:</span> {invoice.customer.phone_number}
              </p>
              <p className={cn("text-sm", theme.textSecondary)}>
                <span className={cn("font-medium", theme.textPrimary)}>Status:</span>
                <InvoiceStatusBadge status={invoice.status} />
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {((invoice as any).paid_date || getInvoiceField(invoice, 'paidDate')) && (
                <div>
                  <p className={cn("text-sm", theme.textSecondary)}>
                    <span className={cn("font-medium", theme.textPrimary)}>Paid Date:</span> {formatDate((invoice as any).paid_date || getInvoiceField(invoice, 'paidDate'))}
                  </p>
                </div>
              )}
              {((invoice as any).payment_method || getInvoiceField(invoice, 'paymentMethod')) && (
                <div>
                  <p className={cn("text-sm", theme.textSecondary)}>
                    <span className={cn("font-medium", theme.textPrimary)}>Payment Method:</span>{' '}
                    {((invoice as any).payment_method || getInvoiceField(invoice, 'paymentMethod'))?.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className={cn("rounded-lg border overflow-hidden", theme.background, theme.border)}>
          <h3 className={cn("text-lg font-medium mb-4 p-4", theme.textPrimary)}>Invoice Items</h3>
          <table className="w-full">
            <thead className={cn("", theme.background)}>
              <tr>
                <th className={cn("text-left py-3 px-4 font-medium", theme.textPrimary)}>Description</th>
                <th className={cn("text-right py-3 px-4 font-medium", theme.textPrimary)}>Quantity</th>
                <th className={cn("text-right py-3 px-4 font-medium", theme.textPrimary)}>Unit Price</th>
                <th className={cn("text-right py-3 px-4 font-medium", theme.textPrimary)}>Total</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", theme.border)}>
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Package className={cn("w-4 h-4 mr-2", theme.textSecondary)} />
                      <div>
                        <p className={cn("text-sm font-medium", theme.textPrimary)}>
                          {item.description || (item as any).variant_name || 'No description'}
                        </p>
                        {/* {((item as any).product_variant || item.productVariant) && (
                          <p className={cn("text-xs", theme.textSecondary)}>
                            Variant: {(item as any).product_variant || item.productVariant}
                          </p>
                        )} */}
                      </div>
                    </div>
                  </td>
                  <td className={cn("text-right py-3 px-4 text-sm", theme.textSecondary)}>
                    {item.quantity}
                  </td>
                  <td className={cn("text-right py-3 px-4 text-sm", theme.textSecondary)}>
                    {formatCurrency((item as any).unit_price || item.unitPrice || 0)}
                  </td>
                  <td className={cn("text-right py-3 px-4 text-sm font-medium", theme.textPrimary)}>
                    {formatCurrency((item as any).total_amount || (item as any).total_price || item.totalPrice || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className={cn("", theme.textSecondary)}>Subtotal:</span>
              <span className={cn("font-medium", theme.textPrimary)}>{formatCurrency((invoice as any).subtotal || (invoice as any).total_amount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className={cn("", theme.textSecondary)}>Discount:</span>
              <span className={cn("font-medium", theme.textPrimary)}>{formatCurrency((invoice as any).discount_amount || (invoice as any).discount || 0)}</span>
            </div>
            <div className={cn("border-t pt-2", theme.border)}>
              <div className="flex justify-between">
                <span className={cn("text-lg font-semibold", theme.textPrimary)}>Total:</span>
                <span className={cn("text-lg font-semibold", theme.textPrimary)}>{formatCurrency((invoice as any).total_amount || (invoice as any).grand_total || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Section */}
        <div className={cn("border-t pt-6", theme.border)}>
          <div className="flex justify-between items-center">
            <h4 className={cn("text-md font-medium", theme.textPrimary)}>Update Status</h4>
            <ThemedButton
              onClick={() => setShowStatusUpdate(!showStatusUpdate)}
              variant="secondary"
            >
              {showStatusUpdate ? 'Cancel' : 'Change Status'}
            </ThemedButton>
          </div>

          {showStatusUpdate && (
            <div className={cn("mt-4 p-4 rounded-lg border", theme.background, theme.border)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
                    className={cn("w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors", theme.background, theme.textPrimary, theme.border)}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {(newStatus === 'paid') && (
                  <div>
                    <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className={cn("w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors", theme.background, theme.textPrimary, theme.border)}
                    >
                      <option value="">Select method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="wallet">Wallet</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <ThemedButton
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === invoice.status}
                  variant="primary"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </ThemedButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemedModal>
  );
};

export default InvoiceDetailModal;
