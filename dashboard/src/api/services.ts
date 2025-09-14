import { apiClient } from './client';
import type { Service, ServiceFormData, ServiceFilters, ServiceStatsData } from '../types/service';

// ==================== SERVICES API ====================

export const servicesApi = {
  // Get all services (both active and inactive)
  getAllServices: async (filters?: ServiceFilters): Promise<Service[]> => {
    const response = await apiClient.get('/services/', {
      params: filters
    });
    return response.data;
  },

  // Get only active services
  getActiveServices: async (category?: string): Promise<Service[]> => {
    const response = await apiClient.get('/services/list/', {
      params: category ? { category } : {}
    });
    return response.data;
  },

  // Get detailed service information with items
  getServiceDetails: async (): Promise<Service[]> => {
    const response = await apiClient.get('/services/details/');
    return response.data;
  },

  // Get single service detail
  getServiceDetail: async (serviceId: string): Promise<Service> => {
    const response = await apiClient.get(`/services/${serviceId}/detail/`);
    return response.data;
  },

  // Create new service
  createService: async (data: ServiceFormData): Promise<Service> => {
    const response = await apiClient.post('/services/add/', data);
    return response.data;
  },

  // Update service
  updateService: async (serviceId: string, data: Partial<ServiceFormData>): Promise<Service> => {
    const response = await apiClient.patch(`/services/${serviceId}/update`, data);
    return response.data;
  },

  // Toggle service active status
  toggleServiceStatus: async (serviceId: string): Promise<Service> => {
    const response = await apiClient.patch(`/services/${serviceId}/toggle-status/`);
    return response.data;
  },

  // Delete service
  deleteService: async (serviceId: string): Promise<void> => {
    await apiClient.delete(`/services/${serviceId}/`);
  },

  // Get service statistics
  getServiceStats: async (): Promise<ServiceStatsData> => {
    const response = await apiClient.get('/services/stats/');
    return response.data;
  },
};
