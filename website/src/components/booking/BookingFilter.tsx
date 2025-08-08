import React from 'react';
import { Filter } from 'lucide-react';
import { MyBookingFilters } from '../../services/interfaces/booking';
import { theme } from '../../config/theme';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface BookingFilterProps {
  filters: MyBookingFilters;
  onFilterChange: (filters: MyBookingFilters) => void;
  options?: FilterOption[];
}

const defaultFilterOptions: FilterOption[] = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const BookingFilter: React.FC<BookingFilterProps> = ({
  filters,
  onFilterChange,
  options = defaultFilterOptions
}) => {
  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...filters,
      status
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-white/70">
          <Filter className="w-5 h-5 mr-2" />
          Filter by status:
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${theme.transitions.default} ${
                filters.status === option.value
                  ? `${theme.gradients.primaryBrand} text-black`
                  : `bg-black/50 border border-orange-900/30 text-white hover:border-orange-500/50`
              }`}
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 text-xs opacity-70">({option.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingFilter;
