import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface Service {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  icon: LucideIcon;
  features: string[];
}

interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: Service[];
  ctaLink: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  subtitle,
  services,
  ctaLink
}) => {
  return (
    <section className={themeClasses.section.primary}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className={themeClasses.badge.primary}>
            <Star className="w-5 h-5 mr-2 animate-pulse" />
            Premium Services
          </div>
          <h2 className={`${themeClasses.heading.section} text-white mb-6 mt-6`}>
            {title}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isPopular = index === 1;
            
            return (
              <div 
                key={service.name} 
                className={`relative ${themeClasses.card.primary} p-8 ${
                  isPopular ? themeClasses.card.featured : 'hover:border-orange-500'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className={themeClasses.badge.popular}>
                      ⭐ MOST POPULAR ⭐
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center relative overflow-hidden ${
                    isPopular ? themeClasses.iconContainer.featured : themeClasses.iconContainer.primary
                  }`}>
                    <IconComponent className={`w-10 h-10 ${isPopular ? 'text-black' : 'text-orange-400'} relative z-10`} />
                    {isPopular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 animate-ping"></div>
                    )}
                  </div>
                  
                  <h3 className={themeClasses.heading.card}>{service.name}</h3>
                  <p className="text-white/70 mb-6">{service.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-4xl font-bold text-orange-400">{service.price}</span>
                      <span className="text-xl text-white/50 line-through">{service.originalPrice}</span>
                    </div>
                    <div className={themeClasses.badge.discount}>
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
                    to={ctaLink}
                    className={`block w-full py-4 px-8 rounded-2xl font-bold transition-all duration-300 ${
                      isPopular
                        ? `${themeClasses.button.primary} shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1`
                        : themeClasses.button.outline
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
  );
};

export default ServicesSection;
