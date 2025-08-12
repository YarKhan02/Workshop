// ==================== DATE SELECTOR WITH AVAILABILITY ====================

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { bookingAPI } from '../../../../api/booking';
import { useTheme, cn, ThemedInput } from '../../../ui';

interface AvailabilityInfo {
  available_slots: number;
  total_slots: number;
}

interface DateSelectorProps {
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => {
  const { theme } = useTheme();
  const [availabilityInfo, setAvailabilityInfo] = useState<AvailabilityInfo | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const fetchAvailability = async (date: string) => {
    if (!date) {
      setAvailabilityInfo(null);
      return;
    }
    
    setIsLoadingAvailability(true);
    try {
      const response = await bookingAPI.getAvailabilityForDate(date);
      setAvailabilityInfo(response);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailabilityInfo(null);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  useEffect(() => {
    if (value) {
      fetchAvailability(value);
    }
  }, [value]);

  const handleDateChange = (date: string) => {
    onChange(date);
  };

  const getAvailabilityDisplay = () => {
    if (!value) return null;
    
    if (isLoadingAvailability) {
      return (
        <p className={cn("text-sm mt-2", theme.textSecondary)}>
          Loading availability...
        </p>
      );
    }
    
    if (availabilityInfo) {
      const isAvailable = availabilityInfo.available_slots > 0;
      return (
        <p className={cn("text-sm mt-2", 
          isAvailable ? "text-green-600" : "text-red-600"
        )}>
          {isAvailable 
            ? `${availabilityInfo.available_slots} of ${availabilityInfo.total_slots} slots available`
            : `Fully booked (${availabilityInfo.total_slots} total slots)`
          }
        </p>
      );
    }
    
    return (
      <p className={cn("text-sm mt-2", theme.textSecondary)}>
        No availability data
      </p>
    );
  };

  return (
    <div className={className}>
      <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
        <Calendar className="inline-block w-4 h-4 mr-2" />
        Service Date {required && '*'}
      </label>
      <ThemedInput
        type="date"
        value={value}
        onChange={(e) => handleDateChange(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        required={required}
        disabled={disabled}
      />
      {getAvailabilityDisplay()}
    </div>
  );
};
