import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ChevronRight } from 'lucide-react';
import { MyBooking } from '../../services/interfaces/booking';
import BookingCard from './BookingCard';
import Button from '../ui/Button';

interface BookingListProps {
  bookings: MyBooking[];
  loading?: boolean;
  onReschedule?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onRate?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  showBookNewButton?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  loading = false,
  onReschedule,
  onCancel,
  onRate,
  onViewDetails,
  emptyMessage = "No Bookings Found",
  emptyDescription = "You don't have any bookings yet. Ready to schedule your first service?",
  showBookNewButton = true
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-black/50 border border-orange-900/30 rounded-2xl p-6 animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-6 bg-gray-700 rounded w-48"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-6 bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-700 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-12">
          <Car className="w-16 h-16 text-orange-400/50 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">{emptyMessage}</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            {emptyDescription}
          </p>
          {showBookNewButton && (
            <Link to="/book">
              <Button
                variant="primary"
                size="lg"
                icon={ChevronRight}
                iconPosition="right"
              >
                Book New Service
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onReschedule={onReschedule}
          onCancel={onCancel}
          onRate={onRate}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default BookingList;
