import React from 'react';
import { Car, FileText, Calendar, Clock } from 'lucide-react';
import { InvoiceBooking } from '../../services/interfaces/invoice';

interface InvoiceServiceDetailsProps {
  booking: InvoiceBooking;
}

const InvoiceServiceDetails: React.FC<InvoiceServiceDetailsProps> = ({ booking }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-orange-600">Service Details:</h3>
      <div className="space-y-2 text-gray-600">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          {booking.car.year} {booking.car.make} {booking.car.model}
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {booking.car.license_plate}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {booking.time_slot.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {booking.time_slot.start_time} - {booking.time_slot.end_time}
        </div>
      </div>
    </div>
  );
};

export default InvoiceServiceDetails;
