import axios from 'axios';

// const API_BASE_URL = 'https://api.detailinghubpk.com';
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests (this is all we need)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      return Promise.reject(error)
    }
    return Promise.reject(error);
  }
);