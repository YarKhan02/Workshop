import React from 'react';
import { CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import type { InvoiceStatus } from '../../../../types/billing';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  showIcon?: boolean;
  className?: string;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = ""
}) => {
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'pending':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'draft':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      case 'cancelled':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
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
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'draft':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatus = (status: InvoiceStatus) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(status)} ${className}`}>
      {showIcon && getStatusIcon(status)}
      {formatStatus(status)}
    </span>
  );
};

export default InvoiceStatusBadge;
