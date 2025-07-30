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
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div>
          <div className={cn("text-sm font-medium", theme.textPrimary)}>
            {customer.first_name} {customer.last_name}
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
      className: 'text-orange-400 hover:text-orange-300 transition-colors duration-200 p-1 rounded-lg hover:bg-orange-500/20',
    },
    {
      label: 'Edit Customer',
      icon: Edit,
      onClick: onEditCustomer,
      className: 'text-emerald-400 hover:text-emerald-300 transition-colors duration-200 p-1 rounded-lg hover:bg-emerald-500/20',
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
