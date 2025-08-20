import { apiClient } from '../api';
import { RegisterFormData, LoginFormData, UserProfile } from '../interfaces/auth';

export const authAPI = {
  async register(userData: Omit<RegisterFormData, 'confirmPassword'>) {
    return apiClient.post<{ message: string; customer: any }>('/auth/customer/register/', {
      full_name: userData.fullName,
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
    return apiClient.post<{ user: any; role: string; message: string }>('/auth/customer/login/', credentials);
  },

  async logout() {
    return apiClient.post('/auth/logout/');
  },

  async verifyToken() {
    return apiClient.get('/auth/customer/status/');
  },

  async getProfile() {
    return apiClient.get<UserProfile>('/auth/profile/');
  },

  async updateProfile(profileData: UserProfile) {
    return apiClient.put<UserProfile>('/auth/profile/', profileData);
  },
};

export const authQueries = {
  getProfile: () => ({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
  }),
};

// Re-export customer bookings API for easy access
export { customerBookingsAPI } from './customerBookings';
