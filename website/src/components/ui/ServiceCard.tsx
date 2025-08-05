import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, LucideIcon } from 'lucide-react';
import { themeClasses } from '../../config/theme';

interface Service {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  duration: string;
  icon: LucideIcon;
  features: string[];
  popular: boolean;
  category: string;
}

interface ServiceCardProps {
  service: Service;
  ctaLink?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, ctaLink = '/book' }) => {
  const IconComponent = service.icon;
  
  return (
    <div className={`relative ${themeClasses.card.primary} p-8 ${
      service.popular ? themeClasses.card.featured : 'hover:border-orange-500'
    }`}>
      {service.popular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className={themeClasses.badge.popular}>
            ⭐ MOST POPULAR ⭐
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center relative overflow-hidden ${
          service.popular ? themeClasses.iconContainer.featured : themeClasses.iconContainer.primary
        }`}>
          <IconComponent className={`w-10 h-10 ${service.popular ? 'text-black' : 'text-orange-400'} relative z-10`} />
          {service.popular && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 animate-ping"></div>
          )}
        </div>
        
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium text-orange-300 bg-orange-500/20 rounded-full border border-orange-500/30">
            {service.category}
          </span>
        </div>
        
        <h3 className={`${themeClasses.heading.card} mb-3`}>{service.name}</h3>
        <p className="text-white/70 mb-6">{service.description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-6 text-white/60">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{service.duration}</span>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl font-bold text-orange-400">{service.price}</span>
            <span className="text-xl text-white/50 line-through">{service.originalPrice}</span>
          </div>
          <div className={themeClasses.badge.discount}>
            Save ₹{parseInt(service.originalPrice.replace('₹', '').replace(',', '')) - parseInt(service.price.replace('₹', '').replace(',', ''))}
          </div>
        </div>
        
        <ul className="space-y-3 mb-8 text-left">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-white/70">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Link
          to={ctaLink}
          className={`block w-full py-4 px-8 rounded-2xl font-bold transition-all duration-300 ${
            service.popular
              ? `${themeClasses.button.primary} shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1`
              : themeClasses.button.outline
          }`}
        >
          Book This Service
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
