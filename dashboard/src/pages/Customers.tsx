import React, { useState } from 'react';
import { Plus, Users, Filter, Search } from 'lucide-react';
import type { Customer, CustomerUpdateData } from '../types/customer';

// Common Components
import {
  PageHeader,
  StatsGrid,
  SearchBar,
  Pagination,
} from '../components/common';

// Feature Components
import {
  CustomerTable,
  CustomerDetailModal,
  AddCustomerModal,
  EditCustomerModal,
} from '../components/features/customers';

// Hooks
import { useCustomers, useUpdateCustomer } from '../hooks/useCustomers';
import { useTableData } from '../hooks/useTableData';
import { usePagination } from '../hooks/usePagination';

const Customers: React.FC = () => {
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
  
  // Ensure customers is always an array
  const customers = Array.isArray(customersData) ? customersData : [];
  
  // Use the generic table data hook
  const { paginateItems, totalFilteredItems } = useTableData(customers, {
    searchTerm,
    searchFields: ['first_name', 'last_name', 'email', 'phone_number'],
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
      value: customers.length,
      icon: Users,
      color: 'red' as const,
    },
    {
      label: 'Filtered Results',
      value: totalFilteredItems,
      icon: Filter,
      color: 'green' as const,
    },
    {
      label: 'Search Mode',
      value: searchTerm ? 'Active' : 'Idle',
      icon: Search,
      color: 'purple' as const,
    },
  ];

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md">
        <div className="text-center py-8">
          <p className="text-red-400">Error loading customers: {error.message}</p>
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
        actionButton={{
          label: 'Add Customer',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
          variant: 'primary',
        }}
      />

      {/* Stats */}
      <StatsGrid stats={statsData} />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search customers by name, email, or phone number..."
      />

      {/* Customers Table */}
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
        />
      )}

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