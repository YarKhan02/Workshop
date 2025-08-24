import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { DataTable } from '../../shared/data';
import { useTheme, cn } from '../../ui';
import type { Customer, CustomerTableProps } from '../../../types';

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  onViewCustomer,
  onEditCustomer,
}) => {
  const { theme } = useTheme();

  const columns = [
    {
      key: 'nic',
      header: 'NIC',
      render: (customer: Customer) => (
        <div>
          <div className={cn("text-sm font-medium", theme.textPrimary)}>
            {customer.nic}
          </div>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div>
          <div className={cn("text-sm font-medium", theme.textPrimary)}>
            {customer.name}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (customer: Customer) => (
        <div>
          <div className={cn("text-sm", theme.textPrimary)}>{customer.email}</div>
          <div className={cn("text-sm", theme.textSecondary)}>{customer.phone_number}</div>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Location',
      render: (customer: Customer) => (
        <div className={cn("text-sm", theme.textPrimary)}>
          {customer.city && customer.state ? `${customer.city}, ${customer.state}` : customer.address}
        </div>
      ),
    },
    {
      key: 'vehicles',
      header: 'Vehicles',
      render: (customer: Customer) => (
        <div className={cn("text-sm", theme.textSecondary)}>
          {customer.cars?.length || 0} vehicles
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: onViewCustomer,
      className: theme.components.table.actionButtonView,
    },
    {
      label: 'Edit Customer',
      icon: Edit,
      onClick: onEditCustomer,
      className: theme.components.table.actionButtonEdit,
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage="No customers found"
      loadingMessage="Loading customer database..."
    />
  );
};

export default CustomerTable;
