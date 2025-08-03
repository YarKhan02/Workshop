import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Book: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-black/50 border border-orange-900/30 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Book an <span className="text-orange-400">Appointment</span>
          </h2>
          {user && (
            <p className="text-white/70 text-lg mb-4">
              Welcome back, <span className="text-orange-400 font-semibold">{user.name}</span>!
            </p>
          )}
          <p className="text-white/70 text-lg">
            Schedule your car service appointment here. Our professional team is ready to make your vehicle shine!
          </p>
          
          <div className="mt-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">Coming Soon</h3>
              <p className="text-white/70">
                Our online booking system is being developed. Please call us at{' '}
                <a href="tel:+919876543210" className="text-orange-400 hover:text-orange-300 font-semibold">
                  +91 98765 43210
                </a>{' '}
                to schedule your appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book; 