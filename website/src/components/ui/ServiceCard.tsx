import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Car } from 'lucide-react';
import { themeClasses } from '../../config/theme';
import type { Service as ApiService } from '../../services/api/services';

interface ServiceCardProps {
  service: ApiService;
  ctaLink?: string;
  popular?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, ctaLink = '/book', popular = false }) => {
  // Format price to PKR currency
  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;
  
  // Calculate discount if originalPrice is provided
  const hasDiscount = service.originalPrice && service.originalPrice > service.price;
  const discountAmount = hasDiscount ? service.originalPrice! - service.price : 0;
  
  return (
    <div className={`relative ${themeClasses.card.primary} p-8 ${
      popular ? themeClasses.card.featured : 'hover:border-orange-500'
    }`}>
      {popular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className={themeClasses.badge.popular}>
            ⭐ MOST POPULAR ⭐
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center relative overflow-hidden ${
          popular ? themeClasses.iconContainer.featured : themeClasses.iconContainer.primary
        }`}>
          <Car className={`w-10 h-10 ${popular ? 'text-black' : 'text-orange-400'} relative z-10`} />
          {popular && (
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
        
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl font-bold text-orange-400">{formatPrice(service.price)}</span>
            {hasDiscount && (
              <span className="text-xl text-white/50 line-through">{formatPrice(service.originalPrice!)}</span>
            )}
          </div>
          {hasDiscount && (
            <div className={themeClasses.badge.discount}>
              Save PKR {discountAmount.toLocaleString()}
            </div>
          )}
        </div>
        
        {service.items && service.items.length > 0 && (
          <ul className="space-y-3 mb-8 text-left">
            {service.items.map((item) => (
              <li key={item.id} className="flex items-center text-white/70">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                {item.name}
              </li>
            ))}
          </ul>
        )}
        
        <Link
          to={ctaLink}
          className={`block w-full py-4 px-8 rounded-2xl font-bold transition-all duration-300 ${
            popular
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
