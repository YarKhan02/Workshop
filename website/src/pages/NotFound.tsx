import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Car } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative text-center max-w-2xl mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <Car className="w-16 h-16 text-black" />
          </div>
          
          <div className="text-8xl font-bold text-orange-400 mb-4">404</div>
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-xl text-white/70 mb-8">
            Oops! The page you're looking for seems to have taken a detour. 
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
          >
            <Home className="w-6 h-6 group-hover:animate-bounce" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-3 border-2 border-orange-500/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-orange-900/30">
          <p className="text-white/70 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Our Services
            </Link>
            <span className="text-white/30">•</span>
            <Link
              to="/book"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Book a Service
            </Link>
            <span className="text-white/30">•</span>
            <Link
              to="/contact"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Contact Us
            </Link>
            <span className="text-white/30">•</span>
            <Link
              to="/pricing"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
