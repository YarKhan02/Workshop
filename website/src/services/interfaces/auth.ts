export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserCar {
  id: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  isDefault: boolean;
}

export interface AuthState {
  loading: boolean;
  showPassword: boolean;
  showConfirmPassword?: boolean;
}

export interface ProfileState {
  isEditing: boolean;
  showAddCar: boolean;
}

export interface NewCarData extends Omit<UserCar, 'id' | 'isDefault'> {}

export interface ValidationErrors {
  [key: string]: string;
}
