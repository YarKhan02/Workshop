import React from 'react';
import { Car, Clock, Phone, MapPin, Star } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block fixed right-0 top-24 w-80 h-[calc(100vh-6rem)] bg-gray-900 shadow-xl border-l border-gray-800 p-6 overflow-y-auto z-40">
      <div className="space-y-6">
        {/* Quick Contact */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-white">Call Us</p>
                <p className="text-sm text-gray-300">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-white">Visit Us</p>
                <p className="text-sm text-gray-300">123 Main Street, City</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-white">Working Hours</p>
                <p className="text-sm text-gray-300">Mon-Sat: 8AM-8PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Why Choose Us</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Professional Service</p>
                <p className="text-xs text-gray-300">Expert technicians with years of experience</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Car className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Quality Products</p>
                <p className="text-xs text-gray-300">Premium detailing products and equipment</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Quick Service</p>
                <p className="text-xs text-gray-300">Fast turnaround time guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Popular Services</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-sm text-gray-300">Exterior Wash</span>
              <span className="text-sm font-medium text-orange-400">₹299</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-sm text-gray-300">Interior Cleaning</span>
              <span className="text-sm font-medium text-orange-400">₹399</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-sm text-gray-300">Full Detailing</span>
              <span className="text-sm font-medium text-orange-400">₹1,499</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-300">Premium Package</span>
              <span className="text-sm font-medium text-orange-400">₹2,999</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Customer Reviews</h3>
          <div className="space-y-3">
            <div className="bg-gray-700 rounded p-3 border border-gray-600">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-300 ml-2">5.0</span>
              </div>
              <p className="text-sm text-gray-300">"Excellent service! My car looks brand new. Highly recommended!"</p>
              <p className="text-xs text-gray-400 mt-2">- Rahul Sharma</p>
            </div>
            <div className="bg-gray-700 rounded p-3 border border-gray-600">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-300 ml-2">5.0</span>
              </div>
              <p className="text-sm text-gray-300">"Professional team, great attention to detail. Will definitely come back!"</p>
              <p className="text-xs text-gray-400 mt-2">- Priya Patel</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 