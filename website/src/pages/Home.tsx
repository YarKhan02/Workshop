import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Star, Shield, Clock, Users, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      name: 'Exterior Wash',
      description: 'Complete exterior cleaning with premium products',
      price: '₹299',
      icon: Car,
      features: ['Hand wash', 'Tire cleaning', 'Window cleaning', 'Drying']
    },
    {
      name: 'Interior Cleaning',
      description: 'Deep interior cleaning and sanitization',
      price: '₹399',
      icon: Shield,
      features: ['Vacuum cleaning', 'Dashboard cleaning', 'Seat cleaning', 'Odor removal']
    },
    {
      name: 'Full Detailing',
      description: 'Complete car detailing inside and out',
      price: '₹1,499',
      icon: Star,
      features: ['Exterior wash', 'Interior cleaning', 'Waxing', 'Tire dressing']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Professional Service',
      description: 'Expert technicians with years of experience'
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Fast service with guaranteed completion time'
    },
    {
      icon: Users,
      title: 'Customer Satisfaction',
      description: '100% satisfaction guaranteed on all services'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Professional Car Detailing Services
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Transform your vehicle with our premium detailing services. 
                Expert care for your car's appearance and value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Book Now
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                >
                  View Services
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <Car className="h-24 w-24 mx-auto mb-4 text-white" />
                  <h3 className="text-2xl font-bold mb-2">Premium Care</h3>
                  <p className="text-blue-100">Your car deserves the best treatment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide professional car detailing services with attention to detail and customer satisfaction.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our range of professional car detailing services
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                    <Link
                      to="/book"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Car?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Book your appointment today and experience the difference of professional car detailing.
          </p>
          <Link
            to="/book"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 