import { apiClient } from '../api';
import { RegisterFormData, LoginFormData, UserProfile, UserCar } from '../interfaces/auth';

export const authAPI = {
  async register(userData: Omit<RegisterFormData, 'confirmPassword'>) {
    return apiClient.post<{ user: any; token: string }>('/auth/register/', {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    });
  },

  async login(credentials: LoginFormData) {
    return apiClient.post<{ user: any; token: string }>('/auth/login/', credentials);
  },

  async logout() {
    return apiClient.post('/auth/logout/');
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
