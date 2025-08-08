import React from 'react';
import { Calendar } from 'lucide-react';
import { themeClasses } from '../../../config/theme';
import { formatDate, formatTime } from '../../../utils/bookingUtils';
import type { TimeSlot } from '../../../services/interfaces/booking';

interface AppointmentDetailsCardProps {
  timeSlot: TimeSlot;
  bookingId: string;
}

const AppointmentDetailsCard: React.FC<AppointmentDetailsCardProps> = ({ timeSlot, bookingId }) => {
  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Calendar className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        Appointment Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/70">Date:</span>
          <span className="text-white">{formatDate(timeSlot.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Time:</span>
          <span className="text-white">
            {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Booking ID:</span>
          <span className="text-white font-mono">{bookingId.slice(-8).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsCard;
