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
  // Additional fields for UI
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
    
    return apiClient.get<Service[]>('/services/', params);
  },

  // Get service details by ID
  getService: async (id: string) => {
    return apiClient.get<Service>(`/services/${id}/detail/`);
  },

  // Get service categories (based on available services)
  getCategories: async () => {
    // This will extract unique categories from services
    const response = await apiClient.get<Service[]>('/services/');
    const categories = new Set<string>();
    
    if (response.data) {
      response.data.forEach(service => {
        if (service.category) {
          categories.add(service.category);
        }
      });
    }
    
    return Array.from(categories).map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
    }));
  },
};
