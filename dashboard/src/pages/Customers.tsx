import React, { useState } from 'react';
import { Plus, Users, UserCheck, UserPlus } from 'lucide-react';
import type { Customer, CustomerUpdateData } from '../types/customer';

// Common Components
import {
  PageHeader,
  StatsGrid,
  SearchBar,
  Pagination,
} from '../components';

// Themed Components
import { useTheme, cn } from '../components/ui';

// Feature Components
import {
  CustomerTable,
  CustomerDetailModal,
  AddCustomerModal,
  EditCustomerModal,
} from '../components/features/customers';

// Hooks
import { useCustomers, useCustomerStats, useUpdateCustomer, useTableData, usePagination } from '../hooks';

const Customers: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination();

  // Use custom hooks
  const { data: customersData, isLoading, error } = useCustomers();
  const updateCustomerMutation = useUpdateCustomer();
  const { data: stats } = useCustomerStats();

  // Ensure customers is always an array
  const customers = Array.isArray(customersData) ? customersData : [];
  
  // Use the generic table data hook
  const { paginateItems } = useTableData(customers, {
    searchTerm,
    searchFields: ['name', 'email', 'phone_number'],
    itemsPerPage,
  });

  // Get paginated data
  const paginationData = paginateItems(currentPage);

  // Event handlers
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (customerId: string, data: CustomerUpdateData) => {
    await updateCustomerMutation.mutateAsync({ customerId, data });
    setIsEditModalOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetToFirstPage(); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Prepare stats data
  const statsData = [
    {
      label: 'Total Customers',
      value: stats?.total || 0,
      icon: <Users className="h-8 w-8" />,
      color: 'blue' as const,
    },
    {
      label: 'Returning Customers',
      value: stats?.returning || 0,
      icon: <UserCheck className="h-8 w-8" />,
      color: 'green' as const,
    },
    {
      label: 'New This Week',
      value: stats?.new_this_week || 0,
      icon: <UserPlus className="h-8 w-8" />,
      color: 'purple' as const,
      ...(stats?.new_this_week_percentage && stats.new_this_week_percentage > 0 && {
        change: {
          value: `${stats.new_this_week_percentage}%`,
          type: 'increase' as const,
        },
      }),
    },
  ];

  // Error state
  if (error) {
    return (
      <div className={cn(theme.components.card.base, "p-6")}>
        <div className="text-center py-8">
          <p className={cn("text-red-400")}>Error loading customers: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Customer Management"
        subtitle="Manage your workshop customer database"
        icon={<Users className="h-6 w-6 text-white" />}
        actionButton={{
          label: 'Add Customer',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
          variant: 'primary',
        }}
      />

      {/* Stats */}
      <StatsGrid stats={statsData} columns={3} />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search customers by name, email, or phone number..."
      />

      {/* Customers Table */}
      <div>
        <CustomerTable
          customers={paginationData.items}
          isLoading={isLoading}
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleEditCustomer}
        />

        {/* Pagination */}
        {paginationData.totalPages > 1 && (
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            startIndex={paginationData.startIndex}
            itemsPerPage={itemsPerPage}
            totalItems={paginationData.totalItems}
            onPageChange={handlePageChange}
            itemName="customers"
          />
        )}
      </div>

      {/* Modals */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditCustomer}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCustomerModal
        customer={selectedCustomer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Customers; 