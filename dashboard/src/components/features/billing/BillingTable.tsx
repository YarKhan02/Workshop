import React from 'react';
import { useTheme, cn } from '../../ui';
import DataTable from '../../shared/data/DataTable';
import type { Invoice } from '../../../types/billing';
import { formatCurrency } from '../../../utils/currency';

interface BillingTableProps {
  invoices: Invoice[];
  onRowClick: (invoice: Invoice) => void;
  loading?: boolean;
}

const BillingTable: React.FC<BillingTableProps> = ({ invoices, onRowClick, loading = false }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className={cn("rounded-lg border p-8", theme.background, theme.border)}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className={cn("ml-3", theme.textSecondary)}>Loading invoices...</span>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      render: (invoice: any) => (
        <div>
          <div className={cn("text-sm font-medium", theme.textPrimary)}>
            {invoice.customer?.first_name || ''} {invoice.customer?.last_name || ''}
          </div>
          <div className={cn("text-sm", theme.textSecondary)}>{invoice.customer?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (invoice: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          invoice.invoice_type === 'booking' 
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        }`}>
          {invoice.invoice_type === 'booking' ? 'Service' : 'Product'}
        </span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (invoice: any) => (
        <span className={cn("text-sm", theme.textSecondary)}>
          {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice: any) => (
        <span className={cn("text-sm font-medium", theme.textPrimary)}>
          {formatCurrency(Number(invoice.total_amount || 0))}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
          {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Unknown'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      data={invoices}
      columns={columns}
      isLoading={loading}
      emptyMessage="No invoices found"
      onRowClick={onRowClick}
    />
  );
};

export default BillingTable;
