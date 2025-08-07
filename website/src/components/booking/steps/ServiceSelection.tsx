import React from 'react';
import { Check } from 'lucide-react';
import { useServices } from '../../hooks/useBooking';
import { themeClasses } from '../../config/theme';
import type { BookingStepProps, Service } from '../../services/interfaces/booking';

interface ServiceSelectionProps extends BookingStepProps {
  onServiceSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  bookingData,
  onServiceSelect,
  isLoading = false,
}) => {
  const { services, loading, error } = useServices();

  const selectedServiceId = typeof bookingData.service === 'string' 
    ? bookingData.service 
    : bookingData.service?.id;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Loading Services...
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${themeClasses.card.primary} p-6 animate-pulse`}>
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
            Select Service
          </h2>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className={`${themeClasses.heading.section} text-white mb-4`}>
          Select Service
        </h2>
        <p className="text-white/70">Choose the service you'd like to book</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedServiceId === service.id}
            onSelect={() => onServiceSelect(service)}
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const cardClasses = `
    ${themeClasses.card.primary} 
    ${isSelected ? themeClasses.card.featured : ''} 
    p-6 cursor-pointer relative group
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className={cardClasses} onClick={disabled ? undefined : onSelect}>
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-black" />
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className={`${themeClasses.heading.card} mb-2`}>{service.name}</h3>
        <p className="text-white/60 text-sm mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-400">
            {service.price_display || `₹${service.base_price}`}
          </span>
          <span className="text-white/50 text-sm">
            {service.duration_minutes} mins
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-white font-medium text-sm">Features included:</h4>
        <ul className="space-y-1">
          {service.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-center text-white/60 text-sm">
              <Check className="w-3 h-3 text-orange-400 mr-2" />
              {feature}
            </li>
          ))}
          {service.features.length > 4 && (
            <li className="text-orange-400 text-sm">
              +{service.features.length - 4} more features
            </li>
          )}
        </ul>
      </div>
      
      <div className="mt-6">
        <button
          className={`
            w-full py-3 rounded-lg font-medium transition-all duration-300
            ${isSelected 
              ? 'bg-orange-500 text-black' 
              : 'bg-orange-500/10 border border-orange-500/30 text-white hover:bg-orange-500/20'
            }
          `}
          disabled={disabled}
        >
          {isSelected ? 'Selected' : 'Select Service'}
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;
