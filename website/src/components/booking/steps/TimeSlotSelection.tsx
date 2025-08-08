import React from 'react';
import { Calendar, Clock, Check } from 'lucide-react';
import { useTimeSlots } from '../../../hooks/useBooking';
import { themeClasses } from '../../../config/theme';
import type { BookingStepProps, TimeSlot, Service } from '../../../services/interfaces/booking';

interface TimeSlotSelectionProps extends BookingStepProps {
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  bookingData,
  onTimeSlotSelect,
  isLoading = false,
}) => {
  const selectedService = typeof bookingData.service === 'object' 
    ? bookingData.service 
    : null;

  const { timeSlots, loading, error } = useTimeSlots({
    service: selectedService?.id,
  });

  const selectedTimeSlotId = typeof bookingData.time_slot === 'string' 
    ? bookingData.time_slot 
    : bookingData.time_slot?.id;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Loading Available Times...
          </h2>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4 w-32"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-12 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
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
            Select Date & Time
          </h2>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Group time slots by date
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
          Select Date & Time
        </h2>
        <p className="text-white/70">Choose your preferred appointment slot</p>
        {selectedService && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-400/20 rounded-full px-4 py-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-orange-200 text-sm">
              {selectedService.name} • {selectedService.duration_minutes} minutes
            </span>
          </div>
        )}
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Available Slots
          </h3>
          <p className="text-white/60">
            No time slots are currently available. Please try again later or contact us directly.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <DateSlotGroup
              key={date}
              date={date}
              timeSlots={groupedSlots[date]}
              selectedTimeSlotId={selectedTimeSlotId}
              onTimeSlotSelect={onTimeSlotSelect}
              disabled={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface DateSlotGroupProps {
  date: string;
  timeSlots: TimeSlot[];
  selectedTimeSlotId?: string;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  disabled?: boolean;
}

const DateSlotGroup: React.FC<DateSlotGroupProps> = ({
  date,
  timeSlots,
  selectedTimeSlotId,
  onTimeSlotSelect,
  disabled = false,
}) => {
  const formattedDate = formatDate(date);
  const availableSlots = timeSlots.filter(slot => slot.is_available);

  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 text-orange-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">{formattedDate}</h3>
        <span className="ml-auto text-sm text-white/60">
          {availableSlots.length} available
        </span>
      </div>

      {availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">No available slots for this date</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableSlots.map((slot) => (
            <TimeSlotButton
              key={slot.id}
              timeSlot={slot}
              isSelected={selectedTimeSlotId === slot.id}
              onSelect={() => onTimeSlotSelect(slot)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TimeSlotButtonProps {
  timeSlot: TimeSlot;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  timeSlot,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const buttonClasses = `
    relative p-3 rounded-lg border transition-all duration-300 flex items-center justify-center
    ${isSelected 
      ? 'bg-orange-500 text-black border-orange-500' 
      : 'bg-black/50 border-orange-900/30 text-white hover:bg-orange-500/10 hover:border-orange-500/50'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  return (
    <button
      className={buttonClasses}
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
    >
      {isSelected && (
        <Check className="w-4 h-4 absolute top-1 right-1" />
      )}
      <div className="text-center">
        <div className="font-medium">
          {formatTime(timeSlot.start_time)}
        </div>
        <div className="text-xs opacity-75">
          {formatTime(timeSlot.end_time)}
        </div>
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
