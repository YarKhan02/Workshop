// ==================== CAR TYPES ====================

// ==================== CORE CAR INTERFACES ====================

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  vin?: string;
  mileage?: number;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  display_name?: string; // For UI display purposes: "BMW M3 (ABC-123)"
  created_at?: string;
  updated_at?: string;
}

// Customer interface specifically for car context
export interface CarCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  full_name?: string; // For display purposes
}

// ==================== FORM DATA INTERFACES ====================

export interface CarFormData {
  customer_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  vin?: string;
  mileage?: number;
  notes?: string;
}

export interface CarCreateData extends CarFormData {}

export interface CarUpdateData extends Partial<CarFormData> {}

// ==================== MODAL PROP INTERFACES ====================

export interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string; // Pre-selected customer
}

export interface EditCarModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (carId: string, data: CarFormData) => Promise<void>;
}

export interface CarDetailModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (car: Car) => void;
  onDelete: (carId: string) => void;
}

// ==================== TABLE INTERFACES ====================

export interface CarTableProps {
  cars: Car[];
  isLoading: boolean;
  onViewCar: (car: Car) => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: string) => void;
}

// ==================== API INTERFACES ====================

export interface CarFilters {
  searchTerm?: string;
  customerId?: string;
  make?: string;
  year?: number;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
}

export interface CarStatsData {
  totalCars: number;
  filteredCars: number;
  uniqueOwners: number;
  averageYear: number;
}
