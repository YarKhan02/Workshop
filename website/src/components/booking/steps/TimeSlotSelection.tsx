import React, { useState, useEffect } from 'react';
import { Calendar, Check } from 'lucide-react';
import { bookingQueries } from '../../../services/api/booking';
import { themeClasses } from '../../../config/theme';
import type { BookingStepProps } from '../../../services/interfaces/booking';

interface DateSelectionProps extends BookingStepProps {
  onDateSelect: (date: string) => void;
}

interface AvailableDate {
  date: string;
  available: boolean;
  slots_available: number;
}

const TimeSlotSelection: React.FC<DateSelectionProps> = ({
  bookingData,
  onDateSelect,
  isLoading = false,
}) => {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loadingDates, setLoadingDates] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedService = typeof bookingData.service === 'object' 
    ? bookingData.service 
    : null;

  // Set initial selected date if exists in booking data
  useEffect(() => {
    if (bookingData.date && typeof bookingData.date === 'string') {
      setSelectedDate(bookingData.date);
    }
  }, [bookingData.date]);

  // Fetch available dates for the next 2 weeks
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        setLoadingDates(true);
        setError(null);
        
        const today = new Date().toISOString().split('T')[0];
        const response = await bookingQueries.dates.getAvailable(today, 14);
        
        if (response.data) {
          setAvailableDates(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err: any) {
        setError('Failed to load available dates');
        console.error('Error fetching available dates:', err);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchAvailableDates();
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  if (loadingDates) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Loading Available Dates...
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className="h-20 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Select Date
          </h2>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
          Select Date
        </h2>
        <p className="text-white/70">Choose your preferred appointment date</p>
        {selectedService && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-400/20 rounded-full px-4 py-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="text-orange-200 text-sm">
              {selectedService.name} • {selectedService.estimated_duration_minutes} minutes
            </span>
          </div>
        )}
      </div>

      {/* Date Selection Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Available Dates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {availableDates.map((dateItem) => (
            <DateCard
              key={dateItem.date}
              date={dateItem.date}
              available={dateItem.available}
              slotsAvailable={dateItem.slots_available}
              isSelected={selectedDate === dateItem.date}
              onSelect={() => handleDateSelect(dateItem.date)}
              disabled={!dateItem.available || isLoading}
            />
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="text-center py-6">
          <div className="bg-orange-500/10 border border-orange-400/20 rounded-lg p-4 inline-block">
            <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h4 className="text-lg font-medium text-white mb-1">
              Date Selected
            </h4>
            <p className="text-orange-200">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface DateCardProps {
  date: string;
  available: boolean;
  slotsAvailable: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const DateCard: React.FC<DateCardProps> = ({
  date,
  available,
  slotsAvailable,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const cardClasses = `
    relative p-4 rounded-lg border transition-all duration-300 cursor-pointer text-center
    ${isSelected 
      ? 'bg-orange-500 text-black border-orange-500' 
      : available 
        ? 'bg-black/50 border-orange-900/30 text-white hover:bg-orange-500/10 hover:border-orange-500/50'
        : 'bg-gray-800/50 border-gray-700/30 text-gray-500 cursor-not-allowed'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });

  return (
    <button
      className={cardClasses}
      onClick={disabled || !available ? undefined : onSelect}
      disabled={disabled || !available}
    >
      {isSelected && (
        <Check className="w-4 h-4 absolute top-1 right-1" />
      )}
      <div className="space-y-1">
        <div className="text-xs font-medium">{dayName}</div>
        <div className="text-lg font-bold">{dayNumber}</div>
        <div className="text-xs">{monthName}</div>
        {available && (
          <div className="text-xs mt-2 opacity-75">
            {slotsAvailable} slots
          </div>
        )}
      </div>
    </button>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Otherwise, format as a readable date
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export default TimeSlotSelection;
