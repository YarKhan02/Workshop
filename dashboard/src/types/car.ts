// ==================== CAR TYPES ====================

// ==================== CORE CAR INTERFACES ====================

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  customer: string;
  created_at?: string;
  is_active?: boolean;
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

// Form data types are derived in hooks/useCars.ts and api/cars.ts as Omit<Car, 'id'>

export interface CarCreateData {
  customer: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
}

export interface CarUpdateData extends Partial<CarCreateData> {}

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
  onSave?: (carId: string, data: CarCreateData) => Promise<void>;
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
