import React, { useState } from 'react';
import { Plus, Wrench, CheckCircle, XCircle, Activity } from 'lucide-react';
import type { Service, ServiceFormData } from '../types/service';

// Common Components
import {
  PageHeader,
  StatsGrid,
  SearchBar,
  Pagination,
  ConfirmationDialog,
} from '../components';

// UI Components
import { ThemedButton, useTheme, cn } from '../components/ui';

// Feature Components
import {
  ServiceTable,
  AddServiceModal,
  ServiceDetailModal,
} from '../components/features/services';

// Hooks
import { 
  useServices, 
  useServiceStats, 
  useCreateService, 
  useToggleServiceStatus, 
  useDeleteService,
  useTableData, 
  usePagination 
} from '../hooks';

const Services: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination();

  // Use custom hooks
  const { data: servicesData, isLoading, error } = useServices();
  const { data: stats } = useServiceStats();
  const createServiceMutation = useCreateService();
  const toggleStatusMutation = useToggleServiceStatus();
  const deleteServiceMutation = useDeleteService();

  // Ensure services is always an array and handle different response structures
  let services: Service[] = [];
  
  if (servicesData) {
    if (Array.isArray(servicesData)) {
      services = servicesData;
    } else if (typeof servicesData === 'object' && 'data' in servicesData && Array.isArray((servicesData as any).data)) {
      services = (servicesData as any).data;
    } else if (typeof servicesData === 'object' && 'results' in servicesData && Array.isArray((servicesData as any).results)) {
      services = (servicesData as any).results;
    }
  }

  // Handle error state gracefully - just log it, don't crash the page
  const safeServices = () => {
    if (error) {
      const errorMessage = typeof error === 'string' 
        ? error 
        : error?.message 
        || (error as any)?.response?.data?.message 
        || 'Backend service unavailable';
      
      console.warn('Services API Error:', errorMessage);
      // Return empty array so table shows "no data" instead of crashing
      return [];
    }
    return services;
  };

  // Get the safe services array
  const currentServices = safeServices();
  
  // Use the generic table data hook with safe services
  const { paginateItems } = useTableData(currentServices, {
    searchTerm,
    searchFields: ['name', 'description', 'category'],
    itemsPerPage,
  });

  // Get paginated data
  const paginationData = paginateItems(currentPage);

  // Event handlers
  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    // TODO: Add edit modal when needed
    console.log('Edit service:', service);
  };

  const handleToggleStatus = async (serviceId: string) => {
    try {
      await toggleStatusMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      try {
        await deleteServiceMutation.mutateAsync(serviceToDelete);
      } catch (error) {
        console.error('Error deleting service:', error);
      } finally {
        setServiceToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleCreateService = async (data: ServiceFormData) => {
    await createServiceMutation.mutateAsync(data);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetToFirstPage(); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  // Prepare stats data with fallbacks (even on errors)
  const statsData = [
    {
      label: 'Total Services',
      value: error ? 0 : (stats?.total || 0),
      icon: <Wrench className="h-8 w-8" />,
      color: 'blue' as const,
    },
    {
      label: 'Active Services',
      value: error ? 0 : (stats?.active || 0),
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'green' as const,
    },
    {
      label: 'Inactive Services',
      value: error ? 0 : (stats?.inactive || 0),
      icon: <XCircle className="h-8 w-8" />,
      color: 'red' as const,
    },
    {
      label: 'Categories',
      value: error ? 0 : (stats?.categories || 0),
      icon: <Activity className="h-8 w-8" />,
      color: 'purple' as const,
    },
  ];

  // Handle empty state (only show when no services and no search term, but not on errors)
  const renderEmptyState = () => {
    if (isLoading || error) return null;
    
    if (currentServices.length === 0 && !searchTerm) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <Wrench className={cn("h-16 w-16 mx-auto", theme.textTertiary)} />
            </div>
            <h3 className={cn("text-xl font-semibold mb-3", theme.textPrimary)}>
              No Services Found
            </h3>
            <p className={cn("text-sm mb-6", theme.textSecondary)}>
              Get started by creating your first service. Services help you organize and manage your workshop offerings.
            </p>
            <ThemedButton
              onClick={() => setIsAddModalOpen(true)}
              variant="primary"
              className="mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Service
            </ThemedButton>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Service Management"
        subtitle="Manage your workshop services and service items"
        icon={<Wrench className="h-6 w-6 text-white" />}
        actionButton={{
          label: 'Add Service',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
          variant: 'primary',
        }}
      />

      {/* Stats */}
      <StatsGrid stats={statsData} columns={4} />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search services by name, description, or category..."
      />

      {/* Services Table or Empty State */}
      {renderEmptyState() || (
        <div>
          <ServiceTable
            services={paginationData.items}
            isLoading={isLoading && !error} // Don't show loading spinner if there's an error
            onViewService={handleViewService}
            onEditService={handleEditService}
            onToggleStatus={handleToggleStatus}
            onDeleteService={handleDeleteService}
          />

          {/* Pagination */}
          {paginationData.totalPages > 1 && (
            <Pagination
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              startIndex={paginationData.startIndex}
              itemsPerPage={itemsPerPage}
              totalItems={paginationData.totalItems}
              onPageChange={handlePageChange}
              itemName="services"
            />
          )}
        </div>
      )}

      {/* Modals */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditService}
        onToggleStatus={handleToggleStatus}
      />

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateService}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={confirmDeleteService}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone and will remove all associated data."
        confirmText="Delete Service"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteServiceMutation.isPending}
      />
    </div>
  );
};

export default Services;