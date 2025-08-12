// ==================== SERVICE SELECTOR COMPONENT ====================

import React from 'react';
import { FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceAPI } from '../../../../api/booking';
import { useTheme, cn } from '../../../ui';
import { formatCurrency } from '../../../../utils/currency';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ServiceSelectorProps {
  value: string;
  onChange: (serviceId: string, serviceData?: Service) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => {
  const { theme } = useTheme();

  // Fetch services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceAPI.getServices(),
  });

  const handleServiceChange = (serviceId: string) => {
    const selectedService = (services as Service[]).find(s => s.id === serviceId);
    onChange(serviceId, selectedService);
  };

  return (
    <div className={className}>
      <label className={cn("block text-sm font-medium mb-2", theme.textSecondary)}>
        <FileText className="inline-block w-4 h-4 mr-2" />
        Service Type {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => handleServiceChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 border rounded-xl transition-all duration-300",
          theme.background,
          theme.textPrimary,
          theme.border,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        required={required}
        disabled={disabled || isLoading}
      >
        <option value="">
          {isLoading ? "Loading services..." : "Select service..."}
        </option>
        {(services as Service[]).map((service: Service) => (
          <option key={service.id} value={service.id}>
            {service.name} - {formatCurrency(service.price)}
          </option>
        ))}
      </select>
    </div>
  );
};
