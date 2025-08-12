// ==================== CAR SELECTOR COMPONENT ====================

import React from 'react';
import { Car as CarIcon } from 'lucide-react';
import { useCarsByCustomer } from '../../../../hooks/useCars';
import { useTheme, cn } from '../../../ui';

interface Car {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  year?: number;
}

interface CarSelectorProps {
  customerId: string | null;
  value: string;
  onChange: (carId: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CarSelector: React.FC<CarSelectorProps> = ({
  customerId,
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => {
  const { theme } = useTheme();

  // Fetch customer cars
  const { data: customerCars = [], isLoading } = useCarsByCustomer(customerId);

  const getPlaceholderText = () => {
    if (!customerId) return "Select customer first...";
    if (isLoading) return "Loading vehicles...";
    if (customerCars.length === 0) return "No vehicles found";
    return "Select vehicle...";
  };

  return (
    <div className={className}>
      <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
        <CarIcon className="inline-block w-4 h-4 mr-2" />
        Vehicle {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 border rounded-xl transition-all duration-300",
          theme.background,
          theme.textPrimary,
          theme.border,
          (disabled || !customerId || isLoading) && "opacity-50 cursor-not-allowed"
        )}
        required={required}
        disabled={disabled || !customerId || isLoading}
      >
        <option value="">{getPlaceholderText()}</option>
        {(customerCars as Car[]).map((car: Car) => (
          <option key={car.id} value={car.id}>
            {`${car.make} ${car.model} (${car.license_plate})`}
          </option>
        ))}
      </select>
    </div>
  );
};
