import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Star, CheckCircle, Sparkles, Droplets, Wrench, Zap, Award } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      name: 'Quick Wash',
      description: 'Perfect for regular maintenance and quick refreshment',
      price: '₹399',
      originalPrice: '₹499',
      duration: '30-45 mins',
      icon: Car,
      features: [
        'Exterior hand wash',
        'Tire cleaning',
        'Window cleaning',
        'Quick dry',
        'Tire shine'
      ],
      popular: false,
      category: 'Basic'
    },
    {
      name: 'Premium Exterior',
      description: 'Complete exterior detailing with protection',
      price: '₹1,299',
      originalPrice: '₹1,599',
      duration: '2-3 hours',
      icon: Sparkles,
      features: [
        'Hand wash with premium products',
        'Clay bar treatment',
        'Paint correction (minor)',
        'Ceramic coating application',
        'Tire and wheel detailing',
        'Window treatment'
      ],
      popular: true,
      category: 'Premium'
    },
    {
      name: 'Interior Deep Clean',
      description: 'Professional interior cleaning and protection',
      price: '₹899',
      originalPrice: '₹1,199',
      duration: '2-3 hours',
      icon: Shield,
      features: [
        'Complete vacuum cleaning',
        'Dashboard restoration',
        'Leather conditioning',
        'Fabric protection',
        'Odor elimination',
        'UV protection treatment'
      ],
      popular: false,
      category: 'Interior'
    },
    {
      name: 'Full Detailing',
      description: 'Complete transformation inside and out',
      price: '₹2,499',
      originalPrice: '₹2,999',
      duration: '4-6 hours',
      icon: Star,
      features: [
        'Everything from Premium Exterior',
        'Everything from Interior Deep Clean',
        'Engine bay cleaning',
        'Paint correction',
        'Ceramic coating',
        '6-month protection warranty'
      ],
      popular: true,
      category: 'Complete'
    },
    {
      name: 'Paint Correction',
      description: 'Professional paint restoration and correction',
      price: '₹3,999',
      originalPrice: '₹4,999',
      duration: '6-8 hours',
      icon: Award,
      features: [
        'Multi-stage paint correction',
        'Swirl mark removal',
        'Scratch removal',
        'Paint enhancement',
        'Premium ceramic coating',
        '1-year warranty'
      ],
      popular: false,
      category: 'Specialty'
    },
    {
      name: 'Ceramic Coating',
      description: 'Ultimate paint protection with ceramic technology',
      price: '₹5,999',
      originalPrice: '₹7,499',
      duration: '1-2 days',
      icon: Zap,
      features: [
        'Premium ceramic coating',
        'Paint preparation',
        'Multi-layer application',
        'Hydrophobic protection',
        'UV protection',
        '2-year warranty'
      ],
      popular: false,
      category: 'Protection'
    }
  ];

  const addOns = [
    {
      name: 'Engine Bay Cleaning',
      price: '₹299',
      icon: Wrench,
      description: 'Deep cleaning of engine compartment'
    },
    {
      name: 'Headlight Restoration',
      price: '₹399',
      icon: Sparkles,
      description: 'Restore cloudy headlights to crystal clear'
    },
    {
      name: 'Odor Treatment',
      price: '₹199',
      icon: Droplets,
      description: 'Professional odor elimination treatment'
    },
    {
      name: 'Pet Hair Removal',
      price: '₹299',
      icon: Shield,
      description: 'Specialized pet hair removal service'
    }
  ];

  const categories = ['All', 'Basic', 'Premium', 'Interior', 'Complete', 'Specialty', 'Protection'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-primary-500/10"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Professional Services
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Our Premium{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              From quick washes to complete transformations, we offer comprehensive car detailing 
              services to keep your vehicle looking its absolute best.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-black shadow-lg'
                    : 'bg-black/50 border border-orange-900/30 text-white/70 hover:bg-orange-500/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.name} 
                  className={`relative bg-black/50 border border-orange-900/30 rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300 ${
                    service.popular ? 'border-orange-500 scale-105 shadow-orange-500/20' : 'hover:border-orange-500'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      service.popular ? 'bg-gradient-to-r from-primary-600 to-primary-500' : 'bg-primary-500/20'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${service.popular ? 'text-black' : 'text-primary-400'}`} />
                    </div>
                    
                    <div className="mb-4">
                      <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-white/70 mb-6">{service.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl font-bold text-primary-400">{service.price}</span>
                        <span className="text-lg text-white/50 line-through">{service.originalPrice}</span>
                      </div>
                      <div className="text-sm text-primary-400 font-medium">
                        {service.duration}
                      </div>
                      <div className="text-sm text-green-400 font-medium">
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
                      className={`block w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        service.popular
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-black hover:from-primary-500 hover:to-primary-400 shadow-lg'
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

      {/* Add-on Services */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Add-on Services
            </h2>
            <p className="text-xl text-white/70">
              Enhance your detailing package with these additional services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => {
              const IconComponent = addon.icon;
              return (
                <div key={index} className="bg-black/50 border border-orange-900/30 rounded-xl p-6 hover:border-orange-500 transition-all duration-200 hover:shadow-lg">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{addon.name}</h3>
                    <p className="text-sm text-white/70 mb-4">{addon.description}</p>
                    <div className="text-lg font-bold text-primary-400">{addon.price}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Book Your Service?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            Choose your perfect detailing package and book online. Our expert team will 
            transform your vehicle with professional care and attention to detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-gradient-to-r from-primary-600 to-primary-500 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-500 hover:to-primary-400 transition-all duration-200 shadow-2xl"
            >
              Book Service Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-primary-500/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-500/10 transition-all duration-200"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
