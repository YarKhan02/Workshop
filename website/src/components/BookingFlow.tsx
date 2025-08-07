import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, Clock, User, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  features: string[];
}

interface CarDetails {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface BookingData {
  service: Service | null;
  car: CarDetails;
  timeSlot: TimeSlot | null;
  customerNotes: string;
}

const BookingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    car: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: ''
    },
    timeSlot: null,
    customerNotes: ''
  });


  // Refs for car details form
  const carMakeRef = React.useRef<HTMLInputElement>(null);
  const carModelRef = React.useRef<HTMLInputElement>(null);
  const carYearRef = React.useRef<HTMLInputElement>(null);
  const carLicensePlateRef = React.useRef<HTMLInputElement>(null);
  const carColorRef = React.useRef<HTMLInputElement>(null);
  const carNotesRef = React.useRef<HTMLTextAreaElement>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();


  // Memoize the update functions to prevent re-creation on each render
  const updateBookingData = React.useCallback((field: keyof BookingData, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleServiceSelect = React.useCallback((service: Service) => {
    updateBookingData('service', service);
  }, [updateBookingData]);

  const handleTimeSlotSelect = React.useCallback((slot: TimeSlot) => {
    updateBookingData('timeSlot', slot);
  }, [updateBookingData]);

  const services: Service[] = [
    {
      id: '1',
      name: 'Exterior Detailing',
      description: 'Complete exterior cleaning with premium products and ceramic coating',
      price: '₹1,299',
      duration: 120,
      features: ['Hand wash', 'Tire detailing', 'Window cleaning', 'Ceramic protection', 'Paint correction']
    },
    {
      id: '2',
      name: 'Interior Deep Clean',
      description: 'Professional interior cleaning and sanitization service',
      price: '₹899',
      duration: 90,
      features: ['Vacuum cleaning', 'Dashboard restoration', 'Leather treatment', 'Odor removal', 'UV protection']
    },
    {
      id: '3',
      name: 'Premium Full Detail',
      description: 'Complete transformation inside and out with premium protection',
      price: '₹2,499',
      duration: 180,
      features: ['Everything included', 'Paint correction', 'Ceramic coating', 'Interior protection', '6-month warranty']
    }
  ];

  // Mock time slots - in real app, fetch from API
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const times = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];
      times.forEach((time) => {
        slots.push({
          id: `${date.toISOString().split('T')[0]}-${time}`,
          date: date.toISOString().split('T')[0],
          time: time,
          available: Math.random() > 0.3 // Random availability
        });
      });
    }
    
    return slots;
  };

  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const steps = [
    { number: 1, title: 'Select Service', icon: Car },
    { number: 2, title: 'Car Details', icon: User },
    { number: 3, title: 'Date & Time', icon: Calendar },
    { number: 4, title: 'Review & Confirm', icon: CheckCircle }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      // If moving from step 2 (Car Details), collect the form data
      if (currentStep === 2) {
        const carData = {
          make: carMakeRef.current?.value?.trim() || '',
          model: carModelRef.current?.value?.trim() || '',
          year: carYearRef.current?.value?.trim() || '',
          licensePlate: carLicensePlateRef.current?.value?.trim() || '',
          color: carColorRef.current?.value?.trim() || ''
        };
        setBookingData(prev => ({ ...prev, car: carData }));
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login', { state: { from: '/book', bookingData } });
      return;
    }

    try {
      // Collect final car details and customer notes
      const finalCarData = {
        make: carMakeRef.current?.value?.trim() || '',
        model: carModelRef.current?.value?.trim() || '',
        year: carYearRef.current?.value?.trim() || '',
        licensePlate: carLicensePlateRef.current?.value?.trim() || '',
        color: carColorRef.current?.value?.trim() || ''
      };
      const customerNotes = carNotesRef.current?.value?.trim() || '';

      const finalBookingData = {
        ...bookingData,
        car: finalCarData,
        customerNotes: customerNotes
      };

      // Here you would submit to your API
      console.log('Booking Data:', finalBookingData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to confirmation page
      navigate('/checkout', { 
        state: { 
          bookingData: {
            service: finalBookingData.service?.name,
            price: parseInt(finalBookingData.service?.price.replace('₹', '').replace(',', '') || '0'),
            originalPrice: parseInt(finalBookingData.service?.price.replace('₹', '').replace(',', '') || '0') + 300,
            car: finalBookingData.car,
            timeSlot: finalBookingData.timeSlot,
            customerNotes: finalBookingData.customerNotes
          }
        } 
      });
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  // Step 1: Service Selection
  const ServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Service</h2>
        <p className="text-white/70">Select the perfect detailing package for your vehicle</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-2 ${
              bookingData.service?.id === service.id
                ? 'border-orange-500 bg-orange-500/10 scale-105'
                : 'border-orange-900/30 bg-black/50 hover:border-orange-500/50'
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-white/70 mb-4 text-sm">{service.description}</p>
              <div className="text-2xl font-bold text-orange-400 mb-4">{service.price}</div>
              <div className="text-sm text-white/60 mb-4">Duration: {service.duration} minutes</div>
              <ul className="space-y-1 text-sm text-white/70">
                {service.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 2: Car Details
  const CarDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Your Car Details</h2>
        <p className="text-white/70">Help us prepare for your vehicle</p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Car Make *</label>
            <input
              ref={carMakeRef}
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50"
              placeholder="e.g., Toyota, Honda, BMW"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Car Model *</label>
            <input
              ref={carModelRef}
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50"
              placeholder="e.g., Camry, Civic, X5"
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Year *</label>
            <input
              ref={carYearRef}
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50"
              placeholder="e.g., 2020"
              maxLength={4}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Color</label>
            <input
              ref={carColorRef}
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50"
              placeholder="e.g., White, Black, Silver"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">License Plate *</label>
          <input
            ref={carLicensePlateRef}
            type="text"
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50"
            placeholder="e.g., MH01AB1234"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Additional Notes (Optional)</label>
          <textarea
            ref={carNotesRef}
            rows={3}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-white/50 resize-none"
            placeholder="Any special instructions or requirements for your vehicle..."
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Date & Time Selection
  const DateTimeSelection = () => {
    const groupedSlots = timeSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Select Date & Time</h2>
          <p className="text-white/70">Choose your preferred appointment slot</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {Object.entries(groupedSlots).map(([date, slots]) => {
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const dateString = dateObj.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            });
            
            return (
              <div key={date} className="mb-10">
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4 mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-orange-400" />
                    {dayName}
                  </h3>
                  <p className="text-orange-300 ml-9">{dateString}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => {
                        if (slot.available) {
                          handleTimeSlotSelect(slot);
                        }
                      }}
                      disabled={!slot.available}
                      className={`group relative p-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                        bookingData.timeSlot?.id === slot.id
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg shadow-orange-500/25'
                          : slot.available
                          ? 'bg-black/60 border-2 border-orange-900/30 text-white hover:border-orange-500/50 hover:bg-orange-500/10'
                          : 'bg-gray-800/30 border-2 border-gray-700/30 text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Clock className={`w-5 h-5 mb-2 ${
                          bookingData.timeSlot?.id === slot.id ? 'text-black' : 'text-orange-400'
                        }`} />
                        <span className="font-bold">{slot.time}</span>
                        {slot.available ? (
                          <span className={`text-xs mt-1 ${
                            bookingData.timeSlot?.id === slot.id ? 'text-black/70' : 'text-green-400'
                          }`}>
                            Available
                          </span>
                        ) : (
                          <span className="text-xs mt-1 text-red-400">
                            Booked
                          </span>
                        )}
                      </div>
                      
                      {bookingData.timeSlot?.id === slot.id && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-800" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Step 4: Review & Confirm
  const ReviewConfirm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Review Your Booking</h2>
        <p className="text-white/70">Please confirm your booking details</p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Service Details */}
        <div className="bg-black/50 border border-orange-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
          {bookingData.service && (
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-medium">{bookingData.service.name}</span>
                <span className="text-orange-400 font-bold">{bookingData.service.price}</span>
              </div>
              <p className="text-white/70 text-sm mb-3">{bookingData.service.description}</p>
              <div className="text-sm text-white/60">Duration: {bookingData.service.duration} minutes</div>
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="bg-black/50 border border-orange-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Car Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Make & Model:</span>
              <div className="text-white font-medium">{bookingData.car.make} {bookingData.car.model}</div>
            </div>
            <div>
              <span className="text-white/60">Year:</span>
              <div className="text-white font-medium">{bookingData.car.year}</div>
            </div>
            <div>
              <span className="text-white/60">License Plate:</span>
              <div className="text-white font-medium">{bookingData.car.licensePlate}</div>
            </div>
            <div>
              <span className="text-white/60">Color:</span>
              <div className="text-white font-medium">{bookingData.car.color || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-black/50 border border-orange-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Appointment Details</h3>
          {bookingData.timeSlot && (
            <div className="text-sm">
              <div className="mb-2">
                <span className="text-white/60">Date:</span>
                <div className="text-white font-medium">
                  {new Date(bookingData.timeSlot.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div>
                <span className="text-white/60">Time:</span>
                <div className="text-white font-medium">{bookingData.timeSlot.time}</div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Notes */}
        <div className="bg-black/50 border border-orange-900/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Special Instructions (Optional)</h3>
          <textarea
            value={bookingData.customerNotes}
            onChange={(e) => setBookingData(prev => ({ ...prev, customerNotes: e.target.value }))}
            className="w-full px-4 py-3 bg-black/50 border border-orange-900/30 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            rows={4}
            placeholder="Any special instructions or areas of concern for your vehicle..."
          />
        </div>

        {!isAuthenticated && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-300 text-sm">
              You'll be redirected to login before confirming your booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.service !== null;
      case 2:
        // Check the actual input values using refs
        const make = carMakeRef.current?.value?.trim() || '';
        const model = carModelRef.current?.value?.trim() || '';
        const year = carYearRef.current?.value?.trim() || '';
        const licensePlate = carLicensePlateRef.current?.value?.trim() || '';
        return make && model && year && licensePlate;
      case 3:
        return bookingData.timeSlot !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-orange-500 border-orange-500 text-black'
                      : 'border-orange-900/30 text-white/60'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-orange-400' : 'text-white/60'
                    }`}>
                      Step {step.number}
                    </div>
                    <div className={`text-xs ${
                      currentStep >= step.number ? 'text-white' : 'text-white/40'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {step.number < steps.length && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-orange-500' : 'bg-orange-900/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-black/50 border border-orange-900/30 rounded-2xl shadow-xl p-8 mb-8">
          {currentStep === 1 && <ServiceSelection />}
          {currentStep === 2 && <CarDetailsForm />}
          {currentStep === 3 && <DateTimeSelection />}
          {currentStep === 4 && <ReviewConfirm />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-8 py-4 bg-black/50 border border-orange-900/30 text-white rounded-xl hover:border-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleBookingSubmit}
              disabled={!canProceed()}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
