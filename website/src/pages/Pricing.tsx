import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Star, CheckCircle, Sparkles, Crown, Zap } from 'lucide-react';

const Pricing: React.FC = () => {
  const pricingTiers = [
    {
      name: 'Essential',
      price: '₹499',
      originalPrice: '₹699',
      description: 'Perfect for regular maintenance',
      icon: Car,
      features: [
        'Exterior hand wash',
        'Interior vacuum',
        'Window cleaning',
        'Tire cleaning',
        'Basic drying',
        'Air freshener'
      ],
      popular: false,
      buttonText: 'Choose Essential',
      savings: '₹200'
    },
    {
      name: 'Premium',
      price: '₹1,299',
      originalPrice: '₹1,699',
      description: 'Most popular choice for car enthusiasts',
      icon: Star,
      features: [
        'Everything in Essential',
        'Clay bar treatment',
        'Paint correction (minor)',
        'Interior deep clean',
        'Leather conditioning',
        'Ceramic coating prep',
        'Tire dressing',
        '30-day protection'
      ],
      popular: true,
      buttonText: 'Choose Premium',
      savings: '₹400'
    },
    {
      name: 'Ultimate',
      price: '₹2,999',
      originalPrice: '₹3,999',
      description: 'Complete transformation package',
      icon: Crown,
      features: [
        'Everything in Premium',
        'Multi-stage paint correction',
        'Premium ceramic coating',
        'Engine bay detailing',
        'Headlight restoration',
        'Interior protection',
        'Odor elimination',
        '6-month warranty',
        'Free pickup & delivery'
      ],
      popular: false,
      buttonText: 'Choose Ultimate',
      savings: '₹1,000'
    }
  ];

  const addOnPricing = [
    {
      category: 'Protection Services',
      services: [
        { name: 'Ceramic Coating (Premium)', price: '₹3,999', duration: '6-8 hours' },
        { name: 'Paint Protection Film', price: '₹8,999', duration: '1-2 days' },
        { name: 'Interior Protection', price: '₹1,299', duration: '2-3 hours' },
        { name: 'Undercarriage Protection', price: '₹899', duration: '1-2 hours' }
      ]
    },
    {
      category: 'Restoration Services',
      services: [
        { name: 'Paint Correction (Single Stage)', price: '₹1,999', duration: '4-6 hours' },
        { name: 'Paint Correction (Multi Stage)', price: '₹3,999', duration: '8-12 hours' },
        { name: 'Headlight Restoration', price: '₹599', duration: '1-2 hours' },
        { name: 'Trim Restoration', price: '₹799', duration: '2-3 hours' }
      ]
    },
    {
      category: 'Specialty Services',
      services: [
        { name: 'Engine Bay Detailing', price: '₹599', duration: '2-3 hours' },
        { name: 'Pet Hair Removal', price: '₹399', duration: '1-2 hours' },
        { name: 'Odor Elimination', price: '₹299', duration: '1 hour' },
        { name: 'Convertible Top Cleaning', price: '₹899', duration: '2-3 hours' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-orange-500/10"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Transparent Pricing
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Simple, Honest{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              No hidden fees, no surprises. Choose the perfect package for your vehicle 
              and see exactly what you'll get for your investment.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Choose Your Package
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              All packages include professional service, premium products, and our satisfaction guarantee
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <div 
                  key={tier.name} 
                  className={`relative bg-black/50 border border-orange-900/30 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:-translate-y-2 ${
                    tier.popular 
                      ? 'border-orange-500 scale-105 shadow-2xl shadow-orange-500/20' 
                      : 'hover:border-orange-500'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-orange-600 to-orange-500' 
                        : 'bg-orange-500/20'
                    }`}>
                      <IconComponent className={`w-10 h-10 ${tier.popular ? 'text-black' : 'text-orange-400'}`} />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-3">{tier.name}</h3>
                    <p className="text-white/70 mb-6">{tier.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-4xl font-bold text-orange-400">{tier.price}</span>
                        <span className="text-xl text-white/50 line-through">{tier.originalPrice}</span>
                      </div>
                      <div className="text-lg text-green-400 font-semibold">
                        Save {tier.savings}
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8 text-left">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to="/book"
                      className={`block w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-black hover:from-orange-500 hover:to-orange-400 shadow-lg'
                          : 'bg-orange-900/20 border border-orange-500/30 text-white hover:bg-orange-500/20'
                      }`}
                    >
                      {tier.buttonText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-on Pricing */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Add-on Services
            </h2>
            <p className="text-xl text-white/70">
              Enhance your package with specialized services
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {addOnPricing.map((category, index) => (
              <div key={index} className="bg-black/50 border border-orange-900/30 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex justify-between items-center p-4 bg-orange-900/10 border border-orange-900/20 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">{service.name}</div>
                        <div className="text-sm text-white/60">{service.duration}</div>
                      </div>
                      <div className="text-lg font-bold text-orange-400">{service.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Our Pricing Makes Sense
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">100% Satisfaction Guarantee</h3>
              <p className="text-white/70">
                Not happy with the service? We'll make it right or refund your money.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Products</h3>
              <p className="text-white/70">
                We use only the best products from trusted brands for long-lasting results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Expert Technicians</h3>
              <p className="text-white/70">
                Certified professionals with years of experience in automotive detailing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            Book your service today and see why thousands of customers trust us with their vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-500 hover:to-orange-400 transition-all duration-200 shadow-2xl"
            >
              Book Service Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-orange-500/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-500/10 transition-all duration-200"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing; 