import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Clock, User } from 'lucide-react';

// Components
import {
  PageHeader,
  Pagination,
  StatsGrid,
} from '../components';
import {
  BookingTable,
  BookingFilters as BookingFiltersComponent,
} from '../components/features/bookings';
import AddBookingModal from '../components/features/bookings/AddBookingModal';
import BookingDetailModal from '../components/features/bookings/BookingDetailModal';
import EditBookingModal from '../components/features/bookings/EditBookingModal';

// Hooks
import { useBookings, useBookingStats } from '../hooks/useBookings';
import { usePagination } from '../hooks/usePagination';
import type { BookingFilters } from '../api/booking';
import type { Booking } from '../types/booking';
import type { StatItem } from '../components/common/StatsGrid';

const Bookings: React.FC = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination();

  // Prepare filters for API
  const filters: BookingFilters = {
    page: currentPage,
    page_size: itemsPerPage,
    ...(searchTerm && { search: searchTerm }),
    ...(statusFilter && { status: statusFilter }),
    ...(dateFilter && { date_from: dateFilter, date_to: dateFilter }),
  };

  // Fetch bookings and stats using hooks
  const { data: bookingsData, isLoading, error: bookingsError } = useBookings(filters);
  const { data: statsData, error: statsError } = useBookingStats();

  // Handle API errors
  if (bookingsError || statsError) {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-br from-red-800/50 to-red-900/50 border border-red-600/30 rounded-xl p-6 backdrop-blur-md">
          <h3 className="font-bold text-red-300">Error loading workshop schedule</h3>
          <p className="text-red-200">Please check if your backend server is running on port 8000.</p>
          <p className="text-sm mt-1 text-red-400">Error: {(bookingsError as Error)?.message || (statsError as Error)?.message}</p>
        </div>
      </div>
    );
  }

  // Extract data from API responses
  const bookings = bookingsData?.bookings || [];
  const pagination = bookingsData?.pagination;
  const stats = statsData || {
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    todayBookings: 0
  };

  // Convert stats to StatItem format for StatsGrid
  const statsItems: StatItem[] = [
    {
      label: 'Total Appointments',
      value: stats.totalBookings,
      icon: <Calendar className="h-8 w-8" />,
      color: 'orange',
    },
    {
      label: 'Completed Services',
      value: stats.completedBookings,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'green',
    },
    {
      label: 'Pending Services',
      value: stats.pendingBookings,
      icon: <Clock className="h-8 w-8" />,
      color: 'yellow',
    },
    {
      label: "Today's Schedule",
      value: stats.todayBookings,
      icon: <User className="h-8 w-8" />,
      color: 'purple',
    },
  ];

  // Event handlers
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
    resetToFirstPage();
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Service Schedule"
        subtitle="Manage workshop service appointments and bookings"
        actionButton={{
          label: 'Schedule Service',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
          variant: 'primary',
        }}
      />

      {/* Stats */}
      <StatsGrid stats={statsItems} columns={4} />

      {/* Search and Filters */}
      <BookingFiltersComponent
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Bookings Table */}
      <BookingTable
        bookings={bookings}
        isLoading={isLoading}
        onViewBooking={handleViewBooking}
        onEditBooking={handleEditBooking}
      />

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Pagination
          currentPage={pagination.current_page || currentPage}
          totalPages={pagination.total_pages}
          startIndex={((pagination.current_page || currentPage) - 1) * itemsPerPage + 1}
          itemsPerPage={itemsPerPage}
          totalItems={pagination.total_count}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <AddBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
      />

      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default Bookings; 