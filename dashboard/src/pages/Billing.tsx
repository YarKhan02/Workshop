"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, Banknote, Clock } from 'lucide-react';
import { useTheme, cn } from '../components/ui';

// Common Components
import {
  PageHeader,
  StatsGrid,
  SearchBar,
  Pagination,
} from '../components';

// Feature Components
import {
  BillingTable,
  InvoiceDetailModal,
  AddInvoiceModal,
  EditInvoiceModal,
} from '../components/features/billing';
import {
  useInvoices,
  useBillingStats,
  useUpdateInvoiceStatus,
} from '../hooks/useBilling';
import { usePagination } from '../hooks/usePagination';
import type { Invoice, InvoiceStatus, PaymentMethod, BillingFilters as BillingFiltersType } from '../types/billing';

// Currency utility
import { formatCurrency } from '../utils/currency';

const Billing: React.FC = () => {
  const { theme } = useTheme();
  
  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination();
  
  // State for filters (without hardcoded pagination)
  const [filters, setFilters] = useState<BillingFiltersType>({
    search: '',
    status: undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Keep filters in sync with pagination state
  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      page: currentPage, 
      limit: itemsPerPage 
    }));
  }, [currentPage, itemsPerPage]);

  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // React Query hooks
  const { data: invoiceResponse, isLoading: loadingInvoices, refetch: refetchInvoices } = useInvoices(filters);
  const { data: stats, isLoading: loadingStats } = useBillingStats();
  const updateStatusMutation = useUpdateInvoiceStatus();

  // Extract invoices and pagination from response
  const invoices = invoiceResponse?.data || [];
  const pagination = invoiceResponse?.pagination;

  // Pagination state from server response
  const totalPages = pagination?.total_pages || 1;
  const totalItems = pagination?.total_count || 0;

  // Filter handlers
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
    resetToFirstPage(); // Reset pagination when searching
  };

  const handleStatusChange = (status: InvoiceStatus | '') => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === '' ? undefined : status, 
      page: 1 
    }));
    resetToFirstPage(); // Reset pagination when filtering
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    onPageChange(page); // Update global pagination state
  };

  // Invoice actions
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleStatusUpdate = async (
    id: string, 
    status: InvoiceStatus, 
    paymentMethod?: PaymentMethod
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        invoiceId: id,
        status,
        paymentMethod,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddInvoiceSuccess = () => {
    setShowAddModal(false);
    refetchInvoices();
  };

  const handleEditInvoiceSuccess = () => {
    setShowEditModal(false);
    setSelectedInvoice(null);
    refetchInvoices();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Finance HQ"
        subtitle="Manage orders, payments, and elite billing"
        actionButton={{
          label: 'Create Invoice',
          icon: Plus,
          onClick: () => setShowAddModal(true),
          variant: 'primary',
        }}
      />

        {/* Statistics Cards */}
        <StatsGrid
          stats={stats ? [
            {
              title: 'Total Revenue',
              value: formatCurrency(stats.totalRevenue),
              icon: <Banknote className="h-8 w-8" />,
              color: 'green' as const,
            },
            {
              title: 'Total Orders',
              value: stats.totalOrders.toString(),
              icon: <FileText className="h-8 w-8" />,
              color: 'blue' as const,
            },
            {
              title: 'Outstanding',
              value: formatCurrency(stats.outstandingAmount),
              icon: <Clock className="h-8 w-8" />,
              color: 'yellow' as const,
            },
            {
              title: 'Monthly Revenue',
              value: formatCurrency(stats.monthlyRevenue),
              icon: <Banknote className="h-8 w-8" />,
              color: 'purple' as const,
            },
          ] : []}
          loading={loadingStats}
          columns={4}
        />

        {/* Search and Filter Section */}
        <div className={cn("rounded-lg border p-6", theme.background, theme.border)}>
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              searchTerm={filters.search || ''}
              onSearchChange={handleSearchChange}
              placeholder="Search orders by customer name, email, or order ID..."
              compact={true}
            />
            <div className="sm:w-48">
              <select
                value={filters.status || ''}
                onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus | '')}
                className={cn("w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors", theme.background, theme.textPrimary, theme.border)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <BillingTable
          invoices={invoices}
          loading={loadingInvoices}
          onRowClick={handleViewInvoice}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          itemName="invoices"
        />

        {/* Modals */}
        <AddInvoiceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddInvoiceSuccess}
          customers={[]}
          jobs={null}
        />

        {showDetailModal && selectedInvoice && (
          <InvoiceDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedInvoice(null);
            }}
            invoice={selectedInvoice}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {showEditModal && selectedInvoice && (
          <EditInvoiceModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedInvoice(null);
            }}
            onSuccess={handleEditInvoiceSuccess}
            invoice={selectedInvoice}
            customers={[]}
          />
        )}
    </div>
  );
};

export default Billing;