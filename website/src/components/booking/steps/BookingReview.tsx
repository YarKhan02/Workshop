import React, { useState } from 'react';
import { Car, Calendar, User, Mail, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { themeClasses } from '../../../config/theme';
import type { BookingStepProps, Service, TimeSlot } from '../../../services/interfaces/booking';

interface BookingReviewProps extends BookingStepProps {
  onSubmit: () => Promise<void>;
}

const BookingReview: React.FC<BookingReviewProps> = ({
  bookingData,
  onUpdateBookingData,
  onSubmit,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const selectedService = typeof bookingData.service === 'object' 
    ? bookingData.service as Service
    : null;

  const selectedTimeSlot = typeof bookingData.time_slot === 'object' 
    ? bookingData.time_slot as TimeSlot
    : null;

  const handleNotesChange = (notes: string) => {
    onUpdateBookingData('customer_notes', notes);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      await onSubmit();
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

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

  if (!selectedService || !selectedTimeSlot) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Incomplete Booking Information
          </h3>
          <p className="text-red-400">
            Please complete all previous steps before reviewing your booking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
          Review & Confirm
        </h2>
        <p className="text-white/70">Please review your booking details before confirming</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Booking Details */}
        <div className="space-y-6">
          {/* Service Details */}
          <div className={`${themeClasses.card.primary} p-6`}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Car className="w-6 h-6 mr-2 text-orange-400" />
              Service Details
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-medium text-white">{selectedService.name}</h4>
                <p className="text-white/60 text-sm">{selectedService.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Duration:</span>
                <span className="text-white">{selectedService.duration_minutes} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Price:</span>
                <span className="text-2xl font-bold text-orange-400">
                  {selectedService.price_display || `₹${selectedService.base_price}`}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className={`${themeClasses.card.primary} p-6`}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Car className="w-6 h-6 mr-2 text-orange-400" />
              Vehicle Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Vehicle:</span>
                <span className="text-white">
                  {bookingData.car.make} {bookingData.car.model} ({bookingData.car.year})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">License Plate:</span>
                <span className="text-white">{bookingData.car.license_plate}</span>
              </div>
              {bookingData.car.color && (
                <div className="flex justify-between">
                  <span className="text-white/70">Color:</span>
                  <span className="text-white">{bookingData.car.color}</span>
                </div>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className={`${themeClasses.card.primary} p-6`}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-orange-400" />
              Appointment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Date:</span>
                <span className="text-white">{formatDate(selectedTimeSlot.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Time:</span>
                <span className="text-white">
                  {formatTime(selectedTimeSlot.start_time)} - {formatTime(selectedTimeSlot.end_time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info & Notes */}
        <div className="space-y-6">
          {/* Customer Information */}
          {user && (
            <div className={`${themeClasses.card.primary} p-6`}>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-orange-400" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-orange-400" />
                  <span className="text-white">{user.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span className="text-white">{user.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className={`${themeClasses.card.primary} p-6`}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-orange-400" />
              Special Instructions
            </h3>
            <textarea
              value={bookingData.customer_notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50 resize-none"
              placeholder="Any special requests or instructions for your service..."
              disabled={isLoading || isSubmitting}
            />
          </div>

          {/* Payment Information */}
          <div className={`${themeClasses.card.primary} p-6`}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-orange-400" />
              Payment
            </h3>
            <div className="bg-orange-500/10 border border-orange-400/20 rounded-lg p-4">
              <p className="text-orange-200 text-sm">
                Payment will be collected at the time of service. We accept cash, card, and digital payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {submissionError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{submissionError}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading || isSubmitting}
          className={`
            ${themeClasses.button.primary} 
            px-8 py-4 rounded-lg text-lg font-semibold
            ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? 'Confirming Booking...' : 'Confirm Booking'}
        </button>
        <p className="text-white/60 text-sm mt-2">
          You will receive a confirmation email shortly after booking
        </p>
      </div>
    </div>
  );
};

export default BookingReview;
