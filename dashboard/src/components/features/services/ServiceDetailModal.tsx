import React from 'react';
import { Edit2, Power, PowerOff } from 'lucide-react';
import { DetailModal } from '../../shared/overlays';
import { useTheme, cn, ThemedButton } from '../../ui';
import type { Service } from '../../../types/service';
import { SERVICE_CATEGORIES } from '../../../types/service';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (service: Service) => void;
  onToggleStatus: (serviceId: string) => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  const { theme } = useTheme();

  if (!service) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryDisplay = (category: string) => {
    return SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const actions = (
    <>
      <div className="flex space-x-2">
        <ThemedButton
          onClick={() => onToggleStatus(service.id)}
          variant="secondary"
          size="sm"
        >
          {service.is_active ? (
            <>
              <PowerOff className="h-4 w-4 mr-2" />
              Deactivate
            </>
          ) : (
            <>
              <Power className="h-4 w-4 mr-2" />
              Activate
            </>
          )}
        </ThemedButton>
      </div>
      
      <div className="flex space-x-3">
        <ThemedButton
          onClick={onClose}
          variant="secondary"
        >
          Close
        </ThemedButton>
        <ThemedButton
          onClick={() => onEdit(service)}
          variant="primary"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Service
        </ThemedButton>
      </div>
    </>
  );

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Service Details"
      actions={actions}
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>
                  Service Name
                </label>
                <p className={cn("text-base", theme.textPrimary)}>{service.name}</p>
              </div>
              
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>
                  Category
                </label>
                <p className={cn("text-base", theme.textPrimary)}>
                  {getCategoryDisplay(service.category)}
                </p>
              </div>
              
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>
                  Price
                </label>
                <p className={cn("text-base font-semibold", theme.textPrimary)}>
                  {formatPrice(service.price)}
                </p>
              </div>
              
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>
                  Status
                </label>
                <div className="mt-1">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    service.is_active
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  )}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={cn("text-lg font-medium mb-4", theme.textPrimary)}>
              Additional Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>
                  Created
                </label>
                <p className={cn("text-base", theme.textPrimary)}>
                  {formatDate(service.created_at)}
                </p>
              </div>
              
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>
                  Total Items
                </label>
                <p className={cn("text-base", theme.textPrimary)}>
                  {service.items?.length || 0} items included
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <div>
            <h3 className={cn("text-lg font-medium mb-3", theme.textPrimary)}>
              Description
            </h3>
            <p className={cn("text-base", theme.textSecondary, "leading-relaxed")}>
              {service.description}
            </p>
          </div>
        )}

        {/* Service Items */}
        {service.items && service.items.length > 0 && (
          <div>
            <h3 className={cn("text-lg font-medium mb-3", theme.textPrimary)}>
              Service Items ({service.items.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {service.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className={cn(
                    "p-3 rounded-md border",
                    theme.backgroundSecondary,
                    "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <span className={cn("text-sm", theme.textPrimary)}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailModal>
  );
};

export default ServiceDetailModal;
