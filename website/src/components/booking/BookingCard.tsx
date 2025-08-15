import React from 'react';
import { Calendar, Car, Star } from 'lucide-react';
import { MyBooking, MyBookingStatus } from '../../services/interfaces/booking';
import { theme } from '../../config/theme';
import Card from '../ui/Card';
// import Button from '../ui/Button';

interface BookingCardProps {
  booking: MyBooking;
  onReschedule?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onRate?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  // onReschedule,
  // onCancel,
  // onRate,
  // onViewDetails
}) => {
  const getStatusStyles = (status: MyBookingStatus): string => {
    const statusStyles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      in_progress: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      no_show: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      rescheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return statusStyles[status] || statusStyles.pending;
  };

  const getStatusText = (status: MyBookingStatus): string => {
    const statusTexts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      no_show: 'No Show',
      rescheduled: 'Rescheduled'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return `PKR ${numPrice.toLocaleString()}`;
  };

  // const showRescheduleButton = booking.status === 'pending' || booking.status === 'confirmed';
  // const showCancelButton = booking.status === 'pending' || booking.status === 'confirmed';
  // const showRateButton = booking.status === 'completed' && !booking.rating;

  return (
    <Card
      variant="default"
      hover
      className={`${theme.transitions.default} group`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          {/* Booking Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`text-xl font-bold text-white group-hover:${theme.gradients.textPrimary} ${theme.transitions.default}`}>
                {booking.serviceName}
              </h3>
              <p className="text-white/60 text-sm">Booking ID: {booking.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`${theme.gradients.textPrimary} font-bold text-lg`}>
                {formatPrice(booking.totalAmount)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <Car className={`w-5 h-5 text-orange-400 mr-3`} />
              <div>
                <div className="text-white font-medium">
                  {booking.carMake} {booking.carModel}
                </div>
                <div className="text-white/60 text-sm">{booking.carLicensePlate}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className={`w-5 h-5 text-orange-400 mr-3`} />
              <div>
                <div className="text-white font-medium">{formatDate(booking.scheduledDate)}</div>
                <div className="text-white/60 text-sm">Date</div>
              </div>
            </div>
          </div>

          {/* Rating for completed bookings */}
          {booking.status === 'completed' && booking.rating && (
            <div className="flex items-center mb-4">
              <span className="text-white/60 text-sm mr-3">Your Rating:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-white/60 text-sm">({booking.rating}/5)</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {/* <div className="flex items-center gap-3 mt-4 lg:mt-0">
          {showRescheduleButton && onReschedule && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReschedule(booking.id)}
            >
              Reschedule
            </Button>
          )}
          
          {showCancelButton && onCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </Button>
          )}
          
          {showRateButton && onRate && (
            <Button
              variant="secondary"
              size="sm"
              icon={Star}
              onClick={() => onRate(booking.id)}
            >
              Rate Service
            </Button>
          )}

          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(booking.id)}
            >
              View Details
            </Button>
          )} */}
        {/* </div> */}
      </div>
    </Card>
  );
};

export default BookingCard;
