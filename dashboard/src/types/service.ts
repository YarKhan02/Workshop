// ==================== SERVICE TYPES ====================

export interface Service {
  id: string;
  name: string;
  code: string;
  category: string;
  base_price: number;
  estimated_duration_minutes: number;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  name: string;
  code: string;
  category: string;
  base_price: number;
  estimated_duration_minutes: number;
  description?: string;
  is_active?: boolean;
}

export interface ServiceUpdateData extends Partial<ServiceFormData> {}

export interface ServiceFilters {
  search?: string;
  category?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
}

// API Response types
export interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  limit: number;
}

export interface ServiceStatsData {
  totalServices: number;
  activeServices: number;
  categoriesCount: number;
  averagePrice: number;
}

// Service Categories
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  services_count: number;
}

export enum ServiceCategoryEnum {
  BASIC_WASH = 'basic_wash',
  PREMIUM_WASH = 'premium_wash',
  INTERIOR_DETAILING = 'interior_detailing',
  EXTERIOR_DETAILING = 'exterior_detailing',
  FULL_DETAILING = 'full_detailing',
  CERAMIC_COATING = 'ceramic_coating',
  PAINT_CORRECTION = 'paint_correction',
  HEADLIGHT_RESTORATION = 'headlight_restoration',
  LEATHER_CARE = 'leather_care',
  ENGINE_BAY_CLEANING = 'engine_bay_cleaning'
}
