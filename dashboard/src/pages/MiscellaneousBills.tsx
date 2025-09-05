import React, { useState } from 'react';
import { Plus, Receipt, Coins, TrendingUp, Calendar } from 'lucide-react';

// Types
import type { MiscellaneousBill } from '../types';

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
  MiscellaneousBillTable,
  AddMiscellaneousBillModal,
  EditMiscellaneousBillModal,
} from '../components/features/miscellaneousBills';

// Hooks
import { 
  useMiscellaneousBills, 
//   useDeleteMiscellaneousBill, 
  useTableData, 
  usePagination 
} from '../hooks';

// Utils
import { 
  filterMiscellaneousBills, 
  calculateMiscellaneousBillStats,
  formatCurrency
} from '../utils/miscellaneousBillUtils';

const MiscellaneousBills: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<MiscellaneousBill | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination();

  // Use custom hooks
  const { data: billsData, isLoading, error } = useMiscellaneousBills();
//   const deleteBillMutation = useDeleteMiscellaneousBill();
  
  // Ensure bills is always an array
  const bills = Array.isArray(billsData) ? billsData : [];
  
  // Use the generic table data hook
  const { paginateItems } = useTableData(bills, {
    searchTerm,
    searchFields: ['title', 'description'],
    itemsPerPage,
  });

  // Get paginated data
  const paginationData = paginateItems(currentPage);

  // Calculate stats
  const filteredBills = filterMiscellaneousBills(bills, { searchTerm });
  const stats = calculateMiscellaneousBillStats(bills, filteredBills);

  // Event handlers
  const handleEditBill = (bill: MiscellaneousBill) => {
    setSelectedBill(bill);
    setIsEditModalOpen(true);
  };

//   const handleDeleteBill = (billId: string) => {
//     deleteBillMutation.mutate(billId);
//   };

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
      label: 'Total Bills',
      value: stats.totalBills,
      icon: <Receipt className="h-8 w-8" />,
      color: 'blue' as const,
    },
    {
      label: 'Total Amount',
      value: formatCurrency(stats.totalAmount),
      icon: <Coins className="h-8 w-8" />,
      color: 'green' as const,
    },
    {
      label: 'Average Amount',
      value: formatCurrency(stats.avgAmount),
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'orange' as const,
    },
    {
      label: 'This Month',
      value: stats.thisMonthBills,
      icon: <Calendar className="h-8 w-8" />,
      color: 'purple' as const,
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={cn("text-center", theme.textSecondary)}>
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Failed to load miscellaneous bills</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Miscellaneous Bills"
        subtitle="Track additional expenses like utilities, chai, office supplies, etc."
        actionButton={{
          label: 'Add New Bill',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
          variant: 'primary',
        }}
      />

      {/* Stats */}
      <StatsGrid stats={statsData} />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Search bills by title or description..."
          className="w-full sm:w-96"
        />
        
        <div className="text-sm text-gray-400">
          Showing {paginationData.items.length} of {paginationData.totalItems} bills
        </div>
      </div>

      {/* Bills Table */}
      <div className={cn("rounded-xl border overflow-hidden", theme.border, theme.background)}>
        <MiscellaneousBillTable
          bills={paginationData.items}
          isLoading={isLoading}
          onEditBill={handleEditBill}
        //   onDeleteBill={handleDeleteBill}
        />
      </div>

      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationData.totalPages}
          totalItems={paginationData.totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          itemName="bills"
        />
      )}

      {/* Modals */}
      <AddMiscellaneousBillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditMiscellaneousBillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bill={selectedBill}
      />
    </div>
  );
};

export default MiscellaneousBills;
