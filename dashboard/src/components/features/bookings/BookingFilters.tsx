// ==================== BOOKING FILTERS COMPONENT ====================

import React from 'react';
import { Search } from 'lucide-react';
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
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-6 rounded-xl shadow-2xl border border-gray-700/30 backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search Service Data</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer, vehicle, or service..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Service Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
          >
            <option value="" className="bg-gray-800">All Status</option>
            <option value="pending" className="bg-gray-800">Scheduled</option>
            <option value="confirmed" className="bg-gray-800">Confirmed</option>
            <option value="in_progress" className="bg-gray-800">In Service</option>
            <option value="completed" className="bg-gray-800">Completed</option>
            <option value="cancelled" className="bg-gray-800">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Service Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
          />
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;
