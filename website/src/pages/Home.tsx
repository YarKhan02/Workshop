import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Star, Shield, Clock, Users, CheckCircle, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      name: 'Exterior Detailing',
      description: 'Complete exterior cleaning with premium products and ceramic coating',
      price: '₹1,299',
      originalPrice: '₹1,599',
      icon: Car,
      features: ['Hand wash', 'Tire detailing', 'Window cleaning', 'Ceramic protection', 'Paint correction']
    },
    {
      name: 'Interior Deep Clean',
      description: 'Professional interior cleaning and sanitization service',
      price: '₹899',
      originalPrice: '₹1,199',
      icon: Shield,
      features: ['Vacuum cleaning', 'Dashboard restoration', 'Leather treatment', 'Odor removal', 'UV protection']
    },
    {
      name: 'Premium Full Detail',
      description: 'Complete transformation inside and out with premium protection',
      price: '₹2,499',
      originalPrice: '₹2,999',
      icon: Star,
      features: ['Everything included', 'Paint correction', 'Ceramic coating', 'Interior protection', '6-month warranty']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Expert Professionals',
      description: 'Certified technicians with years of experience in automotive detailing'
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Fast service with guaranteed completion time and doorstep pickup'
    },
    {
      icon: Users,
      title: '100% Satisfaction',
      description: 'Money-back guarantee on all services with premium quality assurance'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Amazing service! My car looks brand new. The team is professional and punctual.',
      location: 'Mumbai'
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Best detailing service in the city. The ceramic coating is still perfect after 6 months.',
      location: 'Delhi'
    },
    {
      name: 'Amit Patel',
      rating: 5,
      comment: 'Incredible attention to detail. They transformed my 5-year-old car completely.',
      location: 'Bangalore'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-black to-orange-500/5"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-20 h-20 border-2 border-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border-2 border-orange-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-orange-600 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-orange-500 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-10 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-bounce"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-orange-500/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-orange-600/20 to-transparent rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24 z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Premium Car Detailing Service
              </div>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              Your Car Deserves the{' '}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
                Best Care
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/70 mb-10 max-w-4xl mx-auto leading-relaxed">
              Professional car detailing services with premium products, expert technicians, 
              and guaranteed satisfaction. Transform your vehicle into a masterpiece.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/book"
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-black px-10 py-5 rounded-2xl font-bold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="flex items-center">
                  Book Service Now
                  <Sparkles className="w-5 h-5 ml-2 group-hover:animate-spin" />
                </span>
              </Link>
              <Link
                to="/services"
                className="border-2 border-orange-500/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 backdrop-blur-sm"
              >
                View Services
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group cursor-pointer">
                <div className="text-4xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">500+</div>
                <div className="text-white/50 group-hover:text-white/70 transition-colors duration-300">Happy Customers</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-4xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">5★</div>
                <div className="text-white/50 group-hover:text-white/70 transition-colors duration-300">Average Rating</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-4xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">24/7</div>
                <div className="text-white/50 group-hover:text-white/70 transition-colors duration-300">Service Available</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-4xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">100%</div>
                <div className="text-white/50 group-hover:text-white/70 transition-colors duration-300">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-orange-500/20 rounded-full text-orange-400 font-medium mb-6 backdrop-blur-sm border border-orange-500/30">
              <Star className="w-5 h-5 mr-2 animate-pulse" />
              Premium Services
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Choose Your Perfect Package
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From basic cleaning to premium protection, we have the perfect service for your vehicle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.name} 
                  className={`relative bg-gradient-to-br from-black/70 to-black/90 border border-orange-900/30 rounded-3xl shadow-2xl p-8 transform hover:-translate-y-4 transition-all duration-500 hover:shadow-orange-500/20 ${
                    index === 1 ? 'border-orange-500 scale-105 shadow-orange-500/30' : 'hover:border-orange-500'
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        ⭐ MOST POPULAR ⭐
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center relative overflow-hidden ${
                      index === 1 ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg' : 'bg-orange-500/20 border-2 border-orange-500/50'
                    }`}>
                      <IconComponent className={`w-10 h-10 ${index === 1 ? 'text-black' : 'text-orange-400'} relative z-10`} />
                      {index === 1 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 animate-ping"></div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-white/70 mb-6">{service.description}</p>
                    
                    <div className="mb-8">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl font-bold text-orange-400">{service.price}</span>
                        <span className="text-xl text-white/50 line-through">{service.originalPrice}</span>
                      </div>
                      <div className="text-sm text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full inline-block">
                        Save ₹{parseInt(service.originalPrice.replace('₹', '').replace(',', '')) - parseInt(service.price.replace('₹', '').replace(',', ''))}
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-white/70">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to="/book"
                      className={`block w-full py-4 px-8 rounded-2xl font-bold transition-all duration-300 ${
                        index === 1
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black hover:from-orange-400 hover:to-orange-500 shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1'
                          : 'bg-orange-900/20 border border-orange-500/30 text-white hover:bg-orange-500/20'
                      }`}
                    >
                      Book This Service
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Detailing Hub?
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We're not just another car wash. We're your vehicle's best friend.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-orange-500/50">
                    <IconComponent className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-orange-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed text-lg">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">15+</div>
              <div className="text-gray-300 font-medium">Years Experience</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-gray-300 font-medium">Expert Technicians</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">5000+</div>
              <div className="text-gray-300 font-medium">Cars Detailed</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-gray-300 font-medium">Eco-Friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              What Our Customers{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Real reviews from real customers who love our service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current group-hover:animate-pulse" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{testimonial.comment}"</p>
                <div className="border-t border-gray-700 pt-6">
                  <div className="font-bold text-white text-lg">{testimonial.name}</div>
                  <div className="text-orange-400 text-sm font-medium">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-black to-orange-500/10"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-radial from-orange-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="text-6xl lg:text-7xl font-bold mb-8">
              Ready to Transform{' '}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Your Vehicle?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Book your detailing service today and experience the difference professional care makes. 
              Your car will thank you!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/book"
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-black px-12 py-6 rounded-2xl font-bold text-xl hover:from-orange-400 hover:to-orange-500 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-2"
              >
                <span className="flex items-center justify-center">
                  Book Service Now
                  <Car className="w-6 h-6 ml-3 group-hover:animate-bounce" />
                </span>
              </Link>
              <Link
                to="/contact"
                className="border-2 border-orange-500/50 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 backdrop-blur-sm"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;