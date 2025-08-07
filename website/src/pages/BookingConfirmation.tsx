import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Car, Phone, Mail, Home } from 'lucide-react';

interface BookingConfirmationData {
  service: {
    name: string;
    price: string;
    duration: number;
  };
  car: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    color: string;
  };
  timeSlot: {
    date: string;
    time: string;
  };
  customerNotes: string;
}

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingData = location.state?.bookingData as BookingConfirmationData;
  
  // Generate a mock booking ID
  const bookingId = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();

  if (!bookingData) {
    navigate('/book');
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-white/70 mb-6">
              Your car detailing appointment has been successfully scheduled
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 font-medium">
              Booking ID: <span className="font-bold ml-2">{bookingId}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Service & Car Details */}
            <div className="space-y-6">
              {/* Service Details */}
              <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Car className="w-6 h-6 mr-3 text-orange-400" />
                  Service Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-medium">{bookingData.service.name}</span>
                    <span className="text-orange-400 font-bold text-lg">{bookingData.service.price}</span>
                  </div>
                  <div className="text-white/60 text-sm">
                    Duration: {bookingData.service.duration} minutes
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Vehicle:</span>
                    <div className="text-white font-medium">
                      {bookingData.car.year} {bookingData.car.make} {bookingData.car.model}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">License Plate:</span>
                    <div className="text-white font-medium">{bookingData.car.licensePlate}</div>
                  </div>
                  {bookingData.car.color && (
                    <div>
                      <span className="text-white/60">Color:</span>
                      <div className="text-white font-medium">{bookingData.car.color}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Appointment & Contact Details */}
            <div className="space-y-6">
              {/* Appointment Details */}
              <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-orange-400" />
                  Appointment Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-orange-400 mr-3" />
                    <div>
                      <div className="text-white font-medium">
                        {formatDate(bookingData.timeSlot.date)}
                      </div>
                      <div className="text-white/60 text-sm">Date</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-400 mr-3" />
                    <div>
                      <div className="text-white font-medium">{bookingData.timeSlot.time}</div>
                      <div className="text-white/60 text-sm">Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-orange-400 mr-3" />
                    <div>
                      <div className="text-white font-medium">+91 98765 43210</div>
                      <div className="text-white/60 text-sm">For any queries or changes</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-orange-400 mr-3" />
                    <div>
                      <div className="text-white font-medium">support@detailinghub.com</div>
                      <div className="text-white/60 text-sm">Email support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {bookingData.customerNotes && (
            <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Special Instructions</h3>
              <p className="text-white/70">{bookingData.customerNotes}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">What Happens Next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
                <h4 className="font-semibold text-white mb-2">Confirmation Call</h4>
                <p className="text-white/70 text-sm">
                  We'll call you 24 hours before your appointment to confirm details
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <h4 className="font-semibold text-white mb-2">Pickup Service</h4>
                <p className="text-white/70 text-sm">
                  Our team will arrive at your location to collect your vehicle
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <h4 className="font-semibold text-white mb-2">Professional Service</h4>
                <p className="text-white/70 text-sm">
                  Expert detailing and prompt delivery back to you
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/my-bookings"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-semibold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500/50 text-white rounded-xl font-semibold hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Important Notice */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              A confirmation email has been sent to your registered email address. 
              Please save your booking ID for future reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
