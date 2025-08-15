import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { themeClasses } from '../config/theme';
import Layout from '../components/layout/Layout';
import { LoadingSpinner, ErrorState } from '../components/common';
import {
  ConfirmationHeader,
  ServiceDetailsCard,
  AppointmentDetailsCard,
  CustomerInfoCard,
  VehicleInfoCard,
  SpecialInstructionsCard,
  ConfirmationActions
} from '../components/booking';
import { useBookingConfirmation } from '../hooks/useBookingConfirmation';

const BookingConfirmation: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  
  const { booking, loading, error } = useBookingConfirmation(bookingId);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading booking details..." />
      </Layout>
    );
  }

  if (error || !booking) {
    return (
      <Layout>
        <ErrorState message={error || 'Booking not found'} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={themeClasses.section.primary}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <ConfirmationHeader
              title="Booking Confirmed!"
              subtitle="Your service has been successfully booked. We've sent a confirmation email with all the details."
            />

            {/* Booking Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Left Column - Service & Timing */}
              <div className="space-y-6">
                <ServiceDetailsCard 
                  service={booking.service} 
                  totalAmount={booking.total_amount} 
                />
                <AppointmentDetailsCard 
                  bookingId={booking.id} 
                />
              </div>

              {/* Right Column - Customer & Vehicle */}
              <div className="space-y-6">
                <CustomerInfoCard 
                  userName={user?.name} 
                  userEmail={user?.email} 
                />
                <VehicleInfoCard car={booking.car} />
                
                {/* Special Instructions */}
                {booking.customer_notes && (
                  <SpecialInstructionsCard notes={booking.customer_notes} />
                )}
              </div>
            </div>

            
            {/* Action Buttons */}
            <ConfirmationActions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;