import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MyBookings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-black/50 border border-orange-900/30 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">
            My <span className="text-orange-400">Bookings</span>
          </h2>
          {user && (
            <p className="text-white/70 text-lg mb-4">
              Welcome, <span className="text-orange-400 font-semibold">{user.name}</span>!
            </p>
          )}
          <p className="text-white/70 text-lg">
            View and manage your service bookings here. Keep track of your appointment history and upcoming services.
          </p>
          
          <div className="mt-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">No Bookings Found</h3>
              <p className="text-white/70">
                You don't have any bookings yet. Ready to schedule your first service?{' '}
                <Link to="/book" className="text-orange-400 hover:text-orange-300 font-semibold">
                  Book an appointment
                </Link>{' '}
                today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings; 