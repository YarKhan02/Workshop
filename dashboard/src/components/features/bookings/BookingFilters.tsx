// ==================== BOOKING FILTERS COMPONENT ====================

import React from 'react';
import { Search } from 'lucide-react';
import { useTheme, cn, ThemedCard, ThemedInput, ThemedButton } from '../../ui';
import type { BookingFiltersProps } from '../../../types/booking';

const BookingFilters: React.FC<BookingFiltersProps> = ({
  searchTerm,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onClearFilters,
}) => {
  const { theme } = useTheme();

  return (
    <ThemedCard className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>Search Service Data</label>
          <div className="relative">
            <Search className={cn("absolute left-3 top-3", theme.textSecondary)} size={20} />
            <ThemedInput
              type="text"
              placeholder="Search by customer, vehicle, or service..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>Service Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className={cn("w-full px-3 py-3 border rounded-xl transition-all duration-300", theme.background, theme.textPrimary, theme.border)}
          >
            <option value="">All Status</option>
            <option value="pending">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Service</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>Service Date</label>
          <ThemedInput
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <ThemedButton
            onClick={onClearFilters}
            variant="secondary"
            className="w-full"
          >
            Clear Filters
          </ThemedButton>
        </div>
      </div>
    </ThemedCard>
  );
};

export default BookingFilters;
