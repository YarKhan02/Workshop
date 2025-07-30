// ==================== CAR TABLE COMPONENT ====================

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '../../shared/data';
import { useTheme, cn } from '../../ui';
import type { Car, CarTableProps } from '../../../types';

const CarTable: React.FC<CarTableProps> = ({
  cars,
  isLoading,
  onViewCar,
  onEditCar,
  onDeleteCar,
}) => {
  const { theme } = useTheme();
  
  const handleDeleteClick = (car: Car) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      onDeleteCar(car.id);
    }
  };

  const columns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (car: Car) => (
        <div>
          <div className={cn("text-sm font-semibold", theme.textPrimary)}>
            {car.year} {car.make} {car.model}
          </div>
        </div>
      ),
    },
    {
      key: 'license_plate',
      header: 'License Plate',
      render: (car: Car) => (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300")}>
          {car.license_plate}
        </span>
      ),
    },
    {
      key: 'color',
      header: 'Color',
      render: (car: Car) => (
        <div className="flex items-center gap-2">
          <div 
            className={cn("w-3 h-3 rounded-full border shadow-sm", theme.border)}
            style={{ backgroundColor: car.color.toLowerCase() }}
          ></div>
          <span className={cn("text-sm capitalize", theme.textPrimary)}>{car.color}</span>
        </div>
      ),
    },
    {
      key: 'vin',
      header: 'VIN',
      render: (car: Car) => (
        <div className={cn("text-xs font-mono", theme.textSecondary)}>
          {car.vin?.slice(-8) || 'N/A'}
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: onViewCar,
      className: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 p-1.5 rounded-lg',
    },
    {
      label: 'Edit Vehicle',
      icon: Edit,
      onClick: onEditCar,
      className: 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200 p-1.5 rounded-lg',
    },
    {
      label: 'Delete Vehicle',
      icon: Trash2,
      onClick: handleDeleteClick,
      className: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 p-1.5 rounded-lg',
    },
  ];

  return (
    <DataTable
      data={cars}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage="No vehicles found"
      loadingMessage="Loading vehicle database..."
    />
  );
};

export default CarTable;
