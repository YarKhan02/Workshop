"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, DollarSign, Clock } from 'lucide-react';

// Common Components
import {
  PageHeader,
  StatsGrid,
  SearchBar,
  Pagination,
} from '../components/common';

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
import type { Invoice, InvoiceStatus, PaymentMethod, BillingFilters as BillingFiltersType } from '../types/billing';

const Billing: React.FC = () => {
  // State for filters and pagination
  const [filters, setFilters] = useState<BillingFiltersType>({
    search: '',
    status: undefined,
    page: 1,
    limit: 10,
  });

  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // React Query hooks
  const { data: invoices = [], isLoading: loadingInvoices, refetch: refetchInvoices } = useInvoices(filters);
  const { data: stats, isLoading: loadingStats } = useBillingStats();
  const updateStatusMutation = useUpdateInvoiceStatus();

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    const customerName = `${invoice.customer?.first_name || ''} ${invoice.customer?.last_name || ''}`;
    const matchesSearch = !filters.search || 
      customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.id?.toString().includes(filters.search);
    const matchesStatus = !filters.status || invoice.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  // Pagination state (would typically come from API response)
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Update pagination when invoices change
  useEffect(() => {
    if (filteredInvoices) {
      setTotalItems(filteredInvoices.length);
      setTotalPages(Math.ceil(filteredInvoices.length / (filters.limit || 10)));
    }
  }, [filteredInvoices, filters.limit]);

  // Filter handlers
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleStatusChange = (status: InvoiceStatus | '') => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === '' ? undefined : status, 
      page: 1 
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
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
              value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue),
              icon: <DollarSign className="h-8 w-8" />,
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
              value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.outstandingAmount),
              icon: <Clock className="h-8 w-8" />,
              color: 'yellow' as const,
            },
            {
              title: 'Monthly Revenue',
              value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.monthlyRevenue),
              icon: <DollarSign className="h-8 w-8" />,
              color: 'purple' as const,
            },
          ] : []}
          loading={loadingStats}
          columns={4}
        />

        {/* Search and Filter Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
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
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
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
          invoices={filteredInvoices}
          loading={loadingInvoices}
          onRowClick={handleViewInvoice}
        />

        {/* Pagination */}
        <Pagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={filters.limit || 10}
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