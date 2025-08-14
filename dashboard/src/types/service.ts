// ==================== SERVICE TYPES ====================

export interface ServiceItem {
  id: string;
  name: string;
  service: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  is_active: boolean;
  created_at: string;
  items?: ServiceItem[];
}

export type ServiceCategory = 
  | 'washing'
  | 'detailing'
  | 'maintenance'
  | 'repair'
  | 'inspection'
  | 'oil_change'
  | 'tire_services'
  | 'battery_services'
  | 'ac_servicing'
  | 'paint_and_body'
  | 'polishing'
  | 'modifications'
  | 'windshield_services'
  | 'engine_tuning'
  | 'breakdown_assistance';

export interface ServiceFormData {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  is_active: boolean;
  items: { name: string }[];
}

export interface ServiceUpdateData extends Partial<ServiceFormData> {}

export interface ServiceFilters {
  search?: string;
  category?: ServiceCategory;
  is_active?: boolean;
}

// API Response types
export interface ServicesResponse {
  services: Service[];
  total: number;
}

export interface ServiceStatsData {
  total: number;
  active: number;
  inactive: number;
  categories: number;
}

// Service Categories
export const SERVICE_CATEGORIES = {
  washing: 'Washing',
  detailing: 'Detailing', 
  maintenance: 'Maintenance',
  repair: 'Repair',
  inspection: 'Inspection',
  oil_change: 'Oil Change',
  tire_services: 'Tire Services',
  battery_services: 'Battery Services',
  ac_servicing: 'AC Servicing',
  paint_and_body: 'Paint and Body',
  polishing: 'Polishing',
  modifications: 'Modifications',
  windshield_services: 'Windshield Services',
  engine_tuning: 'Engine Tuning',
  breakdown_assistance: 'Breakdown Assistance',
} as const;

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
