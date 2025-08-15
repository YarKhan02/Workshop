import React from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { DataTable } from '../../shared/data';
import { useTheme, cn } from '../../ui';
import type { Service } from '../../../types/service';
import { SERVICE_CATEGORIES } from '../../../types/service';

interface ServiceTableProps {
  services: Service[];
  isLoading: boolean;
  onViewService: (service: Service) => void;
  onEditService: (service: Service) => void;
  onToggleStatus: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  isLoading,
  onViewService,
  onEditService,
  onDeleteService,
}) => {
  const { theme } = useTheme();

  // Safely handle services data - always ensure it's an array
  const safeServices = React.useMemo(() => {
    try {
      if (!services) return [];
      if (!Array.isArray(services)) return [];
      
      // Filter out any invalid service objects
      return services.filter(service => {
        return service && 
               typeof service === 'object' && 
               typeof service.id === 'string' && 
               typeof service.name === 'string';
      });
    } catch (error) {
      console.warn('Error processing services data:', error);
      return [];
    }
  }, [services]);

  const formatPrice = (price: number | string | undefined) => {
    try {
      const numPrice = typeof price === 'string' ? parseFloat(price) : (price || 0);
      if (isNaN(numPrice)) return 'PKR 0';
      
      return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numPrice);
    } catch (error) {
      console.warn('Error formatting price:', error);
      return 'PKR 0';
    }
  };

  const getCategoryDisplay = (category: string | undefined) => {
    try {
      if (!category || typeof category !== 'string') return 'Unknown';
      return SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES] || category;
    } catch (error) {
      console.warn('Error getting category display:', error);
      return 'Unknown';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Service',
      render: (service: Service) => {
        try {
          return (
            <div className="flex flex-col">
              <div className={cn("text-sm font-medium", theme.textPrimary)}>
                {service?.name || 'Unknown Service'}
              </div>
              {service?.description && (
                <div className={cn("text-sm", theme.textSecondary, "truncate max-w-xs")}>
                  {service.description}
                </div>
              )}
            </div>
          );
        } catch (error) {
          console.warn('Error rendering service name:', error);
          return <div className={cn("text-sm", theme.textPrimary)}>Unknown Service</div>;
        }
      },
    },
    {
      key: 'category',
      header: 'Category',
      render: (service: Service) => {
        try {
          return (
            <span className={cn("text-sm", theme.textPrimary)}>
              {getCategoryDisplay(service?.category)}
            </span>
          );
        } catch (error) {
          console.warn('Error rendering category:', error);
          return <span className={cn("text-sm", theme.textPrimary)}>Unknown</span>;
        }
      },
    },
    {
      key: 'price',
      header: 'Price',
      render: (service: Service) => {
        try {
          return (
            <span className={cn("text-sm font-medium", theme.textPrimary)}>
              {formatPrice(service?.price)}
            </span>
          );
        } catch (error) {
          console.warn('Error rendering price:', error);
          return <span className={cn("text-sm", theme.textPrimary)}>PKR 0</span>;
        }
      },
    },
    {
      key: 'items',
      header: 'Items',
      render: (service: Service) => {
        try {
          const itemCount = service?.items?.length || 0;
          return (
            <span className={cn("text-sm", theme.textSecondary)}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          );
        } catch (error) {
          console.warn('Error rendering items:', error);
          return <span className={cn("text-sm", theme.textSecondary)}>0 items</span>;
        }
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (service: Service) => {
        try {
          const isActive = service?.is_active ?? false;
          return (
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            )}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          );
        } catch (error) {
          console.warn('Error rendering status:', error);
          return (
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            )}>
              Unknown
            </span>
          );
        }
      },
    },
  ];

  const actions = [
    {
      label: 'View service',
      icon: Eye,
      onClick: (service: Service) => {
        try {
          if (service?.id) {
            onViewService(service);
          }
        } catch (error) {
          console.warn('Error viewing service:', error);
        }
      },
    },
    {
      label: 'Edit service',
      icon: Edit2,
      onClick: (service: Service) => {
        try {
          if (service?.id) {
            onEditService(service);
          }
        } catch (error) {
          console.warn('Error editing service:', error);
        }
      },
    },
    {
      label: 'Delete service',
      icon: Trash2,
      onClick: (service: Service) => {
        try {
          if (service?.id) {
            onDeleteService(service.id);
          }
        } catch (error) {
          console.warn('Error deleting service:', error);
        }
      },
      className: "p-1 text-red-600 hover:text-red-400",
    },
  ];

  return (
    <DataTable
      data={safeServices}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage={safeServices.length === 0 && !isLoading ? "No services available. Check your connection or try refreshing." : "No services found"}
      loadingMessage="Loading services..."
      // Remove onRowClick to prevent conflicts with action buttons
      // Users can still use the View action button to see details
    />
  );
};

export default ServiceTable;
