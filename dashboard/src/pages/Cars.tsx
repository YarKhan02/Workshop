import React, { useState } from 'react';
import { Plus, Car as CarIcon, Filter, Users } from 'lucide-react';
import type { Car } from '../types';

// Common Components
import {
  PageHeader,
  StatsGrid,
  SearchBar,
  Pagination,
} from '../components/common';

// Feature Components
import {
  CarTable,
  CarDetailModal,
  AddCarModal,
  EditCarModal,
} from '../components/features/cars';

// Hooks
import { useCars, useDeleteCar } from '../hooks/useCars';
import { useTableData } from '../hooks/useTableData';
import { usePagination } from '../hooks/usePagination';

// Utils
import { filterCars, calculateCarStats } from '../utils/carUtils';

const Cars: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination();

  // Use custom hooks
  const { data: carsData, isLoading, error } = useCars();
  const deleteCarMutation = useDeleteCar();
  
  // Ensure cars is always an array
  const cars = Array.isArray(carsData) ? carsData : [];
  
  // Use the generic table data hook
  const { paginateItems } = useTableData(cars, {
    searchTerm,
    searchFields: ['make', 'model', 'license_plate', 'color', 'vin'],
    itemsPerPage,
  });

  // Get paginated data
  const paginationData = paginateItems(currentPage);

  // Calculate stats
  const filteredCars = filterCars(cars, { searchTerm });
  const stats = calculateCarStats(cars, filteredCars);

  // Event handlers
  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setIsDetailModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsEditModalOpen(true);
  };

  const handleDeleteCar = (carId: string) => {
    deleteCarMutation.mutate(carId, {
      onSuccess: () => {
        setIsDetailModalOpen(false);
      },
    });
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
      label: 'Total Vehicles',
      value: stats.totalCars,
      icon: CarIcon,
      color: 'red' as const,
    },
    {
      label: 'Filtered Results',
      value: stats.filteredCars,
      icon: Filter,
      color: 'green' as const,
    },
    {
      label: 'Vehicle Owners',
      value: stats.uniqueOwners,
      icon: Users,
      color: 'purple' as const,
    },
  ];

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 p-6 backdrop-blur-md">
        <div className="text-center py-8">
          <p className="text-red-400">Error loading vehicles: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Vehicle Management"
        subtitle="Manage customer vehicles in the workshop"
        actionButton={{
          label: 'Add Vehicle',
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
        placeholder="Search vehicles by make, model, plate, or VIN..."
      />

      {/* Cars Table */}
      <CarTable
        cars={paginationData.items}
        isLoading={isLoading}
        onViewCar={handleViewCar}
        onEditCar={handleEditCar}
        onDeleteCar={handleDeleteCar}
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
      <CarDetailModal
        car={selectedCar}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditCar}
        onDelete={handleDeleteCar}
      />

      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCarModal
        car={selectedCar}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Cars; 