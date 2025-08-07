import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, User, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookingFlow } from '../../hooks/useBooking';
import { themeClasses } from '../../config/theme';
import Layout from '../layout/Layout';
import BookingStepper from './BookingStepper';
import ServiceSelection from './ServiceSelection';
import CarDetails from './CarDetails';
import TimeSlotSelection from './TimeSlotSelection';
import BookingReview from './BookingReview';
import { bookingQueries } from '../../services/api/booking';
import toast from 'react-hot-toast';

import type { Service, TimeSlot, Car as CarType } from '../../services/interfaces/booking';

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    previousStep,
    resetFlow,
  } = useBookingFlow();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/book');
    }
  }, [isAuthenticated, navigate]);

  const steps = [
    { number: 1, title: 'Select Service', icon: Car },
    { number: 2, title: 'Vehicle Details', icon: User },
    { number: 3, title: 'Date & Time', icon: Calendar },
    { number: 4, title: 'Review & Confirm', icon: CheckCircle },
  ];

  const handleServiceSelect = (service: Service) => {
    updateBookingData('service', service.id);
    nextStep();
  };

  const handleCarUpdate = (car: CarType) => {
    updateBookingData('car', car);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    updateBookingData('time_slot', timeSlot.id);
    nextStep();
  };

  const handleBookingSubmit = async () => {
    try {
      // Ensure we have the correct data types
      const serviceId = typeof bookingData.service === 'string' 
        ? bookingData.service 
        : (bookingData.service as Service)?.id;
        
      const timeSlotId = typeof bookingData.time_slot === 'string' 
        ? bookingData.time_slot 
        : (bookingData.time_slot as TimeSlot)?.id;

      if (!serviceId || !timeSlotId) {
        throw new Error('Missing required booking information');
      }

      const response = await bookingQueries.bookings.create({
        service: serviceId,
        car: bookingData.car,
        time_slot: timeSlotId,
        customer_notes: bookingData.customer_notes,
      });

      if (response.data) {
        toast.success('Booking confirmed successfully!');
        navigate('/my-bookings');
        resetFlow();
      }
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to create booking. Please try again.');
      throw error;
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.service;
      case 2:
        return !!(
          bookingData.car.make &&
          bookingData.car.model &&
          bookingData.car.year &&
          bookingData.car.license_plate
        );
      case 3:
        return !!bookingData.time_slot;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      nextStep();
    } else {
      toast.error('Please complete all required fields before proceeding.');
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <Layout>
      <div className={`${themeClasses.section.primary} min-h-screen`}>
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`${themeClasses.heading.hero} text-white mb-4`}>
              Book Your Service
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Schedule professional car detailing at your convenience
            </p>
          </div>

          {/* Progress Stepper */}
          <BookingStepper steps={steps} currentStep={currentStep} />

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {currentStep === 1 && (
              <ServiceSelection
                bookingData={bookingData}
                onUpdateBookingData={updateBookingData}
                onServiceSelect={handleServiceSelect}
              />
            )}

            {currentStep === 2 && (
              <CarDetails
                bookingData={bookingData}
                onUpdateBookingData={updateBookingData}
                onCarUpdate={handleCarUpdate}
              />
            )}

            {currentStep === 3 && (
              <TimeSlotSelection
                bookingData={bookingData}
                onUpdateBookingData={updateBookingData}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}

            {currentStep === 4 && (
              <BookingReview
                bookingData={bookingData}
                onUpdateBookingData={updateBookingData}
                onSubmit={handleBookingSubmit}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center mt-12 max-w-6xl mx-auto">
              <button
                onClick={previousStep}
                disabled={currentStep === 1}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                  transition-all duration-300
                  ${currentStep === 1
                    ? 'opacity-50 cursor-not-allowed text-gray-500'
                    : `${themeClasses.button.secondary} hover:bg-white/10`
                  }
                `}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="text-center text-white/60">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < 3 && (
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                    transition-all duration-300
                    ${canProceedToNextStep()
                      ? themeClasses.button.primary
                      : 'opacity-50 cursor-not-allowed bg-gray-600 text-gray-300'
                    }
                  `}
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {currentStep === 3 && canProceedToNextStep() && (
                <button
                  onClick={handleNextStep}
                  className={`${themeClasses.button.primary} flex items-center space-x-2 px-6 py-3 rounded-lg font-medium`}
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookingFlow;
