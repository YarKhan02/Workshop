import React from 'react';
import { Car } from 'lucide-react';
import { themeClasses } from '../../../config/theme';
import { formatCurrency } from '../../../utils/bookingUtils';
import type { Service } from '../../../services/interfaces/booking';

interface ServiceDetailsCardProps {
  service: Service;
  totalAmount: number;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service, totalAmount }) => {
  return (
    <div className={`${themeClasses.card.primary} p-6`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Car className={`w-6 h-6 mr-2 ${themeClasses.iconColors.orange}`} />
        Service Details
      </h3>
      <div className="space-y-3">
        <div>
          <h4 className="text-lg font-medium text-white">{service.name}</h4>
          <p className="text-white/60 text-sm">{service.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Duration:</span>
          <span className="text-white">{service.duration_minutes} minutes</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Amount:</span>
          <span className={`text-2xl font-bold ${themeClasses.iconColors.orange}`}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsCard;
