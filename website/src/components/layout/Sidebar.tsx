import React from 'react';
import { Car, Clock, Phone, MapPin, Star } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-80 bg-white shadow-sm border-l border-gray-200 p-6">
      <div className="space-y-6">
        {/* Quick Contact */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Call Us</p>
                <p className="text-sm text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Visit Us</p>
                <p className="text-sm text-gray-600">123 Main Street, City</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Working Hours</p>
                <p className="text-sm text-gray-600">Mon-Sat: 8AM-8PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Us</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Professional Service</p>
                <p className="text-xs text-gray-600">Expert technicians with years of experience</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Car className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Quality Products</p>
                <p className="text-xs text-gray-600">Premium detailing products and equipment</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Quick Service</p>
                <p className="text-xs text-gray-600">Fast turnaround time guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Services</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Exterior Wash</span>
              <span className="text-sm font-medium text-gray-900">₹299</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Interior Cleaning</span>
              <span className="text-sm font-medium text-gray-900">₹399</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Full Detailing</span>
              <span className="text-sm font-medium text-gray-900">₹1,499</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Premium Package</span>
              <span className="text-sm font-medium text-gray-900">₹2,999</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Reviews</h3>
          <div className="space-y-3">
            <div className="bg-white rounded p-3">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">5.0</span>
              </div>
              <p className="text-sm text-gray-700">"Excellent service! My car looks brand new. Highly recommended!"</p>
              <p className="text-xs text-gray-500 mt-2">- Rahul Sharma</p>
            </div>
            <div className="bg-white rounded p-3">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">5.0</span>
              </div>
              <p className="text-sm text-gray-700">"Professional team, great attention to detail. Will definitely come back!"</p>
              <p className="text-xs text-gray-500 mt-2">- Priya Patel</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 