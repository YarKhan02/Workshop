import { apiClient } from '../api';
import { RegisterFormData, LoginFormData, UserProfile, UserCar } from '../interfaces/auth';

export const authAPI = {
  async register(userData: Omit<RegisterFormData, 'confirmPassword'>) {
    return apiClient.post<{ message: string; customer: any }>('/auth/register/', {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone_number: userData.phone,
      nic: userData.nic,
      password: userData.password,
      city: '',
      state: '',
      address: ''
    });
  },

  async login(credentials: LoginFormData) {
    return apiClient.post<{ user: any; role: string; message: string }>('/auth/login/customer/', credentials);
  },

  async logout() {
    return apiClient.post('/auth/logout/');
  },

  async verifyToken() {
    // Use dedicated auth status endpoint to verify authentication
    return apiClient.get('/auth/status/');
  },

  async getProfile() {
    return apiClient.get<UserProfile>('/auth/profile/');
  },

  async updateProfile(profileData: UserProfile) {
    return apiClient.put<UserProfile>('/auth/profile/', profileData);
  },

  async getUserCars() {
    return apiClient.get<UserCar[]>('/cars/');
  },

  async addUserCar(carData: Omit<UserCar, 'id' | 'isDefault'>) {
    return apiClient.post<UserCar>('/cars/', carData);
  },

  async updateUserCar(carId: string, carData: Partial<UserCar>) {
    return apiClient.put<UserCar>(`/cars/${carId}/`, carData);
  },

  async deleteUserCar(carId: string) {
    return apiClient.delete(`/cars/${carId}/`);
  },

  async setDefaultCar(carId: string) {
    return apiClient.post(`/cars/${carId}/set-default/`);
  },
};

export const authQueries = {
  getProfile: () => ({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
  }),

  getUserCars: () => ({
    queryKey: ['user-cars'],
    queryFn: () => authAPI.getUserCars(),
  }),
};

// Re-export customer bookings API for easy access
export { customerBookingsAPI } from './customerBookings';
