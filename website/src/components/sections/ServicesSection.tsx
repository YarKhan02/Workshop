import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Car } from 'lucide-react';
import { themeClasses } from '../../config/theme';
import { servicesAPI, Service } from '../../services/api/services';

interface ServicesSectionProps {
  title: string;
  subtitle: string;
  ctaLink: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  subtitle,
  ctaLink
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Format price to PKR currency
  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;

  // Fetch first 3 services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getServices(undefined, true);
        if (response.data) {
          // Take only first 3 services
          setServices(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Loading services...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const isPopular = index === 1;
              const hasDiscount = service.originalPrice && service.originalPrice > service.price;
              const discountAmount = hasDiscount ? service.originalPrice! - service.price : 0;
              
              return (
                <div 
                  key={service.id} 
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
                      <Car className={`w-10 h-10 ${isPopular ? 'text-black' : 'text-orange-400'} relative z-10`} />
                      {isPopular && (
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 to-orange-600/50 animate-ping"></div>
                      )}
                    </div>
                    
                    <h3 className={themeClasses.heading.card}>{service.name}</h3>
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
                      <ul className="space-y-3 mb-8">
                        {service.items.slice(0, 4).map((item) => (
                          <li key={item.id} className="flex items-center text-white/70">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            {item.name}
                          </li>
                        ))}
                        {service.items.length > 4 && (
                          <li className="text-white/50 text-sm">
                            +{service.items.length - 4} more items
                          </li>
                        )}
                      </ul>
                    )}
                    
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
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No services available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
