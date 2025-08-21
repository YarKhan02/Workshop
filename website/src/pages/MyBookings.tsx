import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMyBookings } from '../hooks/useMyBookings';
import { theme } from '../config/theme';
import Layout from '../components/layout/Layout';
import PageHero from '../components/ui/PageHero';
import { BookingFilter, BookingList } from '../components/booking';
import Button from '../components/ui/Button';

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const {
    bookings,
    loading,
    error,
    filters,
    setFilters,
    rescheduleBooking,
    cancelBooking,
    rateBooking,
  } = useMyBookings();

  const handleViewDetails = (bookingId: string) => {
    console.log('View details for booking:', bookingId);
    // TODO: Navigate to booking details page
    // navigate(`/bookings/${bookingId}`);
  };

  const handleRateBooking = (bookingId: string) => {
    // For now, use a default rating of 5. In a real app, you'd open a rating modal
    rateBooking(bookingId, 5);
  };

  const getFilteredMessage = (status: string) => {
    const messages = {
      pending: "No pending bookings found.",
      confirmed: "No confirmed bookings found.",
      in_progress: "No bookings in progress.",
      completed: "No completed bookings found.",
      cancelled: "No cancelled bookings found.",
      all: "You don't have any bookings yet."
    };
    return messages[status as keyof typeof messages] || messages.all;
  };

  const getFilteredDescription = (status: string) => {
    if (status === 'all') {
      return "Ready to schedule your first service?";
    }
    return `Try a different filter or book a new service.`;
  };

  return (
    <Layout showFooter={false}>
      <div className={`min-h-screen bg-black text-white`}>
        {/* Hero Section */}
        <PageHero
          title="My Bookings"
          subtitle={user ? `Welcome back, ${user.name}! Here are your service appointments.` : "Manage your service appointments"}
          highlightedWord="Bookings"
          backgroundVariant="gradient"
        />

        <div className="container mx-auto px-4 py-16">
          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400">
              <p className="font-medium">Error loading bookings</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Filters */}
          <BookingFilter
            filters={filters}
            onFilterChange={setFilters}
          />

          {/* Bookings List */}
          <BookingList
            bookings={bookings}
            loading={loading}
            onReschedule={rescheduleBooking}
            onCancel={cancelBooking}
            onRate={handleRateBooking}
            onViewDetails={handleViewDetails}
            emptyMessage={getFilteredMessage(filters.status)}
            emptyDescription={getFilteredDescription(filters.status)}
            showBookNewButton={filters.status === 'all'}
          />

          {/* Quick Actions */}
          {bookings.length > 0 && !loading && (
            <div className="mt-12 text-center">
              <Link to="/book">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ChevronRight}
                  iconPosition="right"
                  className={theme.transitions.default}
                >
                  Book Another Service
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings; 