import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/services';
import type { Service, ServiceFormData, ServiceFilters } from '../types/service';

// Query Keys
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters?: ServiceFilters) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
  stats: () => [...serviceKeys.all, 'stats'] as const,
};

// ==================== QUERY HOOKS ====================

export const useServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => servicesApi.getAllServices(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid flooding the backend
    retryDelay: 1000, // Wait 1 second before retry
  });
};

export const useActiveServices = (category?: string) => {
  return useQuery({
    queryKey: ['services', 'active', category],
    queryFn: () => servicesApi.getActiveServices(category),
    staleTime: 5 * 60 * 1000,
  });
};

export const useServiceDetails = () => {
  return useQuery({
    queryKey: serviceKeys.details(),
    queryFn: () => servicesApi.getServiceDetails(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useServiceDetail = (serviceId: string) => {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => servicesApi.getServiceDetail(serviceId),
    enabled: !!serviceId,
  });
};

export const useServiceStats = () => {
  return useQuery({
    queryKey: serviceKeys.stats(),
    queryFn: () => servicesApi.getServiceStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once for stats
    retryDelay: 1000,
  });
};

// ==================== MUTATION HOOKS ====================

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServiceFormData) => servicesApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: Partial<ServiceFormData> }) =>
      servicesApi.updateService(serviceId, data),
    onSuccess: (_, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(serviceId) });
    },
  });
};

export const useToggleServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => servicesApi.toggleServiceStatus(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(serviceId) });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => servicesApi.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
};
