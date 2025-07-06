import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Star, Clock, CheckCircle, Sparkles, Droplets, Wrench } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      name: 'Basic Exterior Wash',
      description: 'Complete exterior cleaning with hand wash and drying',
      price: '₹299',
      duration: '1-2 hours',
      icon: Car,
      features: [
        'Hand wash with premium shampoo',
        'Tire and wheel cleaning',
        'Window cleaning',
        'Drying with microfiber towels',
        'Tire dressing'
      ],
      popular: false
    },
    {
      name: 'Interior Cleaning',
      description: 'Deep interior cleaning and sanitization',
      price: '₹399',
      duration: '2-3 hours',
      icon: Shield,
      features: [
        'Vacuum cleaning of all surfaces',
        'Dashboard and console cleaning',
        'Seat cleaning and conditioning',
        'Door panels and handles',
        'Odor removal and sanitization'
      ],
      popular: false
    },
    {
      name: 'Full Detailing',
      description: 'Complete car detailing inside and out',
      price: '₹1,499',
      duration: '4-6 hours',
      icon: Star,
      features: [
        'Complete exterior wash',
        'Interior deep cleaning',
        'Clay bar treatment',
        'Waxing and protection',
        'Tire and wheel detailing',
        'Engine bay cleaning'
      ],
      popular: true
    },
    {
      name: 'Premium Package',
      description: 'Ultimate detailing experience with premium products',
      price: '₹2,999',
      duration: '6-8 hours',
      icon: Sparkles,
      features: [
        'All full detailing services',
        'Paint correction',
        'Ceramic coating',
        'Leather conditioning',
        'Headlight restoration',
        'Interior protection'
      ],
      popular: false
    },
    {
      name: 'Quick Wash',
      description: 'Fast exterior wash for busy schedules',
      price: '₹199',
      duration: '30-45 minutes',
      icon: Clock,
      features: [
        'Quick hand wash',
        'Basic tire cleaning',
        'Window cleaning',
        'Quick drying'
      ],
      popular: false
    },
    {
      name: 'Engine Bay Cleaning',
      description: 'Professional engine bay cleaning and detailing',
      price: '₹599',
      duration: '2-3 hours',
      icon: Wrench,
      features: [
        'Engine degreasing',
        'Component cleaning',
        'Hose and wire cleaning',
        'Protective coating',
        'Safety checks'
      ],
      popular: false
    }
  ];

  const addOnServices = [
    {
      name: 'Paint Protection',
      description: 'Long-lasting paint protection coating',
      price: '₹1,999',
      duration: '2-3 hours'
    },
    {
      name: 'Headlight Restoration',
      description: 'Restore cloudy headlights to like-new condition',
      price: '₹799',
      duration: '1-2 hours'
    },
    {
      name: 'Leather Conditioning',
      description: 'Deep leather cleaning and conditioning',
      price: '₹499',
      duration: '1-2 hours'
    },
    {
      name: 'Odor Removal',
      description: 'Professional odor elimination treatment',
      price: '₹399',
      duration: '1 hour'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional car detailing services tailored to your needs. 
              From basic washes to premium detailing packages.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailing Packages</h2>
            <p className="text-lg text-gray-600">
              Choose the perfect package for your vehicle
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden ${
                  service.popular ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
              >
                {service.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                      <div className="text-sm text-gray-500">{service.duration}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to="/book"
                    className={`w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                      service.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Book This Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-on Services</h2>
            <p className="text-lg text-gray-600">
              Enhance your detailing experience with these additional services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOnServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-blue-600">{service.price}</span>
                  <span className="text-sm text-gray-500">{service.duration}</span>
                </div>
                <Link
                  to="/book"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center block"
                >
                  Add to Booking
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-lg text-gray-600">
              How we ensure your car gets the best treatment
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-gray-600">We inspect your vehicle and recommend the best services</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparation</h3>
              <p className="text-gray-600">Proper setup and protection of sensitive areas</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailing</h3>
              <p className="text-gray-600">Professional cleaning using premium products</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Inspection</h3>
              <p className="text-gray-600">Quality check and customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Service?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Choose your preferred service and book your appointment today.
          </p>
          <Link
            to="/book"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services; 