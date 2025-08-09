import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, User, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useBookingFlow } from '../../../hooks/useBooking';
import { themeClasses } from '../../../config/theme';
import Layout from '../../layout/Layout';
import BookingStepper from './BookingStepper';
import ServiceSelection from '../steps/ServiceSelection';
import CarDetails from '../steps/CarDetails';
import TimeSlotSelection from '../steps/TimeSlotSelection';
import BookingReview from '../steps/BookingReview';
import { bookingQueries } from '../../../services/api/booking';
import toast from 'react-hot-toast';

import type { Service, Car as CarType, BookingCreateData } from '../../../services/interfaces/booking';

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    previousStep,
    resetFlow,
  } = useBookingFlow();

  // Store the selected service object for display purposes
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);

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
    setSelectedService(service);
    updateBookingData('service', service.id);
    nextStep();
  };

  const handleCarUpdate = (car: CarType) => {
    updateBookingData('car', car);
  };

  const handleDateSelect = (date: string) => {
    updateBookingData('date', date);
  };

  // Auto-progress to next step when date is selected
  React.useEffect(() => {
    if (currentStep === 3 && bookingData.date) {
      const timer = setTimeout(() => {
        nextStep();
      }, 500); // Small delay to show the selection confirmation
      return () => clearTimeout(timer);
    }
  }, [currentStep, bookingData.date, nextStep]);

  const handleBookingSubmit = async () => {
    try {
      console.log('Starting booking submission...');
      console.log('Current booking data:', bookingData);
      
      // Check if user is authenticated
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Ensure we have the correct data types
      const serviceId = typeof bookingData.service === 'string' 
        ? bookingData.service 
        : (bookingData.service as Service)?.id;
        
      const carId = bookingData.car.id;
      const dateValue = bookingData.date;

      console.log('Service ID:', serviceId);
      console.log('Car ID:', carId);
      console.log('Date Value:', dateValue);
      console.log('Customer ID:', user.id);

      if (!serviceId || !carId || !dateValue) {
        throw new Error('Missing required booking information');
      }

      // Transform to backend format
      const submissionData: BookingCreateData = {
        customer: user.id,
        service: serviceId,
        car: carId,
        booking_date: dateValue,
        customer_notes: bookingData.customer_notes || '',
      };

      console.log('Submitting booking data:', submissionData);

      const response = await bookingQueries.bookings.create(submissionData);

      console.log('Booking response:', response);

      if (response.data) {
        toast.success('Booking confirmed successfully!');
        navigate('/my-bookings');
        resetFlow();
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.service;
      case 2:
        return !!(
          bookingData.car.id &&
          bookingData.car.make &&
          bookingData.car.model &&
          bookingData.car.year &&
          bookingData.car.license_plate
        );
      case 3:
        return !!bookingData.date;
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
                onDateSelect={handleDateSelect}
              />
            )}

            {currentStep === 4 && (
              <BookingReview
                bookingData={bookingData}
                onUpdateBookingData={updateBookingData}
                onSubmit={handleBookingSubmit}
                selectedService={selectedService}
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
