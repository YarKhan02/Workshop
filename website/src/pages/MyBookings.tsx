import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, ChevronRight, Filter, Star, RotateCcw, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  service: {
    name: string;
    price: string;
  };
  car: {
    make: string;
    model: string;
    licensePlate: string;
  };
  date: string;
  time: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  rating?: number;
  createdAt: string;
}

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleReschedule = (bookingId: string) => {
    console.log('Reschedule booking:', bookingId);
    toast.success('Reschedule request submitted! You will be contacted shortly.');
    // TODO: Implement reschedule functionality
  };

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      console.log('Cancel booking:', bookingId);
      toast.success('Booking cancelled successfully!');
      // TODO: Implement cancel functionality - remove from list or update status
    }
  };

  const handleRate = (bookingId: string) => {
    console.log('Rate booking:', bookingId);
    toast.success('Rating submitted! Thank you for your feedback.');
    // TODO: Implement rating functionality
  };

  const handleViewDetails = (bookingId: string) => {
    console.log('View details for booking:', bookingId);
    toast('Booking details will be available soon!');
    // TODO: Navigate to booking details page
  };

  // Mock booking data - in real app, fetch from API
  const mockBookings: Booking[] = [
    {
      id: 'BK12345678',
      service: { name: 'Premium Full Detail', price: '₹2,499' },
      car: { make: 'BMW', model: 'X5', licensePlate: 'MH01AB1234' },
      date: '2025-08-15',
      time: '10:00',
      status: 'upcoming',
      createdAt: '2025-08-07'
    },
    {
      id: 'BK87654321',
      service: { name: 'Exterior Detailing', price: '₹1,299' },
      car: { make: 'Toyota', model: 'Camry', licensePlate: 'MH02CD5678' },
      date: '2025-07-20',
      time: '14:00',
      status: 'completed',
      rating: 5,
      createdAt: '2025-07-18'
    },
    {
      id: 'BK11223344',
      service: { name: 'Interior Deep Clean', price: '₹899' },
      car: { make: 'Honda', model: 'Civic', licensePlate: 'MH03EF9012' },
      date: '2025-07-05',
      time: '11:30',
      status: 'completed',
      rating: 4,
      createdAt: '2025-07-03'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBookings = filterStatus === 'all' 
    ? mockBookings 
    : mockBookings.filter(booking => booking.status === filterStatus);

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Bookings</span>
          </h1>
          {user && (
            <p className="text-white/70 text-lg">
              Welcome back, <span className="text-orange-400 font-semibold">{user.name}</span>! 
              Here are your service appointments.
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center text-white/70">
              <Filter className="w-5 h-5 mr-2" />
              Filter by status:
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filterStatus === option.value
                      ? 'bg-orange-500 text-black'
                      : 'bg-black/50 border border-orange-900/30 text-white hover:border-orange-500/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-black/50 border border-orange-900/30 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    {/* Booking Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                          {booking.service.name}
                        </h3>
                        <p className="text-white/60 text-sm">Booking ID: {booking.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-400 font-bold text-lg">{booking.service.price}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <Car className="w-5 h-5 text-orange-400 mr-3" />
                        <div>
                          <div className="text-white font-medium">
                            {booking.car.make} {booking.car.model}
                          </div>
                          <div className="text-white/60 text-sm">{booking.car.licensePlate}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-orange-400 mr-3" />
                        <div>
                          <div className="text-white font-medium">{formatDate(booking.date)}</div>
                          <div className="text-white/60 text-sm">Date</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-orange-400 mr-3" />
                        <div>
                          <div className="text-white font-medium">{booking.time}</div>
                          <div className="text-white/60 text-sm">Time</div>
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
                  <div className="flex items-center gap-3 mt-4 lg:mt-0">
                    {booking.status === 'upcoming' && (
                      <>
                        <button 
                          onClick={() => handleReschedule(booking.id)}
                          className="flex items-center px-4 py-2 bg-orange-900/20 border border-orange-500/30 text-white rounded-lg hover:bg-orange-500/20 transition-all duration-300"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleCancel(booking.id)}
                          className="flex items-center px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'completed' && !booking.rating && (
                      <button 
                        onClick={() => handleRate(booking.id)}
                        className="flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-300"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate Service
                      </button>
                    )}

                    <button 
                      onClick={() => handleViewDetails(booking.id)}
                      className="flex items-center px-4 py-2 bg-black/50 border border-orange-900/30 text-white rounded-lg hover:border-orange-500/50 transition-all duration-300"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-black/50 border border-orange-900/30 rounded-2xl p-12">
              <Car className="w-16 h-16 text-orange-400/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Bookings Found</h3>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                {filterStatus === 'all' 
                  ? "You don't have any bookings yet. Ready to schedule your first service?"
                  : `No ${filterStatus} bookings found. Try a different filter or book a new service.`
                }
              </p>
              <Link
                to="/book"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-semibold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg"
              >
                Book New Service
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {filteredBookings.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-semibold hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg"
            >
              Book Another Service
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings; 