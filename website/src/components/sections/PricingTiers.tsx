import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface PricingTier {
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  popular: boolean;
  buttonText: string;
  savings: string;
}

interface PricingTiersProps {
  tiers: PricingTier[];
}

const PricingTiers: React.FC<PricingTiersProps> = ({ tiers }) => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Choose Your Package
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            All packages include professional service, premium products, and our satisfaction guarantee
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => {
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
  );
};

export default PricingTiers;
