import React from 'react';
import { Edit, Coins, Download } from 'lucide-react';
import { DataTable } from '../../shared/data';
import { useTheme, cn } from '../../ui';
import type { MiscellaneousBillTableProps, MiscellaneousBill } from '../../../types';
import { formatCurrency, formatDate, downloadBill } from '../../../utils/miscellaneousBillUtils';

const MiscellaneousBillTable: React.FC<MiscellaneousBillTableProps> = ({
  bills,
  isLoading,
  onEditBill,
//   onDeleteBill,
}) => {
  const { theme } = useTheme();
  
//   const handleDeleteClick = (bill: MiscellaneousBill) => {
//     if (window.confirm(`Are you sure you want to delete "${bill.title}"? This action cannot be undone.`)) {
//       onDeleteBill(bill.id);
//     }
//   };

  const columns = [
    {
      key: 'title',
      header: 'Bill Title',
      render: (bill: MiscellaneousBill) => (
        <div>
          <div className={cn("text-sm font-semibold", theme.textPrimary)}>
            {bill.title}
          </div>
          {bill.description && (
            <div className={cn("text-xs mt-1", theme.textSecondary)}>
              {bill.description.length > 50 
                ? `${bill.description.slice(0, 50)}...` 
                : bill.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (bill: MiscellaneousBill) => (
        <div className="flex items-center space-x-2">
          <Coins className={cn("h-4 w-4", theme.textSecondary)} />
          <span className={cn("font-semibold", theme.textPrimary)}>
            {formatCurrency(bill.amount)}
          </span>
        </div>
      ),
    },
    {
      key: 'paid_on',
      header: 'Date Paid',
      render: (bill: MiscellaneousBill) => (
        <span className={cn("text-sm", theme.textSecondary)}>
          {formatDate(bill.paid_on)}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Edit Bill',
      icon: Edit,
      onClick: onEditBill,
      className: theme.components.table.actionButtonEdit,
    },
    {
      label: 'Download Bill',
      icon: Download,
      onClick: (bill: MiscellaneousBill) => downloadBill(bill),
      className: theme.components.table.actionButtonAdd,
    },
    // {
    //   label: 'Delete Bill',
    //   icon: Trash2,
    //   onClick: handleDeleteClick,
    //   className: theme.components.table.actionButtonDelete,
    // },
  ];

  return (
    <DataTable
      data={bills}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage="No miscellaneous bills found"
      loadingMessage="Loading bills..."
    />
  );
};

export default MiscellaneousBillTable;
