import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { DataTable } from '../../common';
import type { Customer, CustomerTableProps } from '../../../types';

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  onViewCustomer,
  onEditCustomer,
}) => {
  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div>
          <div className="text-sm font-medium text-gray-100">
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
          <div className="text-sm text-gray-100">{customer.email}</div>
          <div className="text-sm text-gray-400">{customer.phone_number}</div>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Location',
      render: (customer: Customer) => (
        <div className="text-sm text-gray-100">
          {customer.city && customer.state ? `${customer.city}, ${customer.state}` : customer.address}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (customer: Customer) => (
        <div className="flex gap-2">
          {/* Actions will be handled by DataTable */}
        </div>
      ),
    },
    {
      key: 'vehicles',
      header: 'Vehicles',
      render: (customer: Customer) => (
        <div className="text-sm text-gray-200">
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
      className: 'text-orange-400 hover:text-orange-300',
    },
    {
      label: 'Edit Customer',
      icon: Edit,
      onClick: onEditCustomer,
      className: 'text-red-400 hover:text-red-300',
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
