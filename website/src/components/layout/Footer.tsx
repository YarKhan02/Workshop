import React from 'react';
import { Phone, Mail, MapPin, Clock, Car, Star, Shield, Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-orange-900/30">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Detailing Hub</h3>
                <p className="text-sm text-orange-400">POWERED BY BIKE DOCTORS</p>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed">
              Professional car detailing services with premium products, expert technicians, 
              and guaranteed satisfaction. Your vehicle deserves the best care.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-orange-900/20 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-orange-900/20 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
              <div className="w-10 h-10 bg-orange-900/20 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer">
                <span className="text-sm font-bold">@</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-white/70 hover:text-orange-400 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="text-white/70 hover:text-orange-400 transition-colors duration-300">
                  Services
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-white/70 hover:text-orange-400 transition-colors duration-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/book" className="text-white/70 hover:text-orange-400 transition-colors duration-300">
                  Book Now
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/70 hover:text-orange-400 transition-colors duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/my-bookings" className="text-white/70 hover:text-orange-400 transition-colors duration-300">
                  My Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Our Services</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-white/70">
                <Star className="w-4 h-4 text-orange-400 mr-2" />
                Exterior Detailing
              </li>
              <li className="flex items-center text-white/70">
                <Shield className="w-4 h-4 text-orange-400 mr-2" />
                Interior Deep Clean
              </li>
              <li className="flex items-center text-white/70">
                <Car className="w-4 h-4 text-orange-400 mr-2" />
                Premium Full Detail
              </li>
              <li className="flex items-center text-white/70">
                <Users className="w-4 h-4 text-orange-400 mr-2" />
                Ceramic Coating
              </li>
              <li className="flex items-center text-white/70">
                <Clock className="w-4 h-4 text-orange-400 mr-2" />
                Paint Correction
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Call Us</p>
                  <p className="text-white/70">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-white/70">info@detailinghub.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Address</p>
                  <p className="text-white/70">123 Auto Street, Car City<br />Mumbai, Maharashtra 400001</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Working Hours</p>
                  <p className="text-white/70">Mon-Sun: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-900/30 bg-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/50 text-sm">
              © 2025 Detailing Hub. All rights reserved. Powered by Bike Doctors.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/50 hover:text-orange-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-white/50 hover:text-orange-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-white/50 hover:text-orange-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
