import { apiClient } from './client';

export interface ServiceItem {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  is_active: boolean;
  created_at: string;
  items: ServiceItem[];
  originalPrice?: number;
  discountAmount?: number;
}

export interface ServiceCategory {
  value: string;
  label: string;
}

// Services API
export const servicesAPI = {
  
  // Get all services with items
  getServices: async (category?: string, is_active?: boolean) => {
    const params: any = {};
    if (category) params.category = category;
    if (is_active !== undefined) params.is_active = is_active;
    
    return apiClient.get<Service[]>('/services/list/', params);
  },

  // Get service details by ID
  getService: async (id: string) => {
    return apiClient.get<Service>(`/services/${id}/detail/`);
  },
};
