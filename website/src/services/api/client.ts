// API client configuration for the website
import { handleAuthError } from '../../utils/authErrorHandler';

const API_BASE_URL = 'https://api.detailinghubpk.com';
// const API_BASE_URL = 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  results?: T;
  message?: string;
  status: number;
  count?: number;
  next?: string;
  previous?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    // The browser will automatically include the HTTP-only cookies
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Include HTTP-only cookies
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.detail || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        data: data.results || data,
        status: response.status,
        message: data.message,
        count: data.count,
        next: data.next,
        previous: data.previous
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle authentication errors globally
      const wasHandled = handleAuthError(error);
      if (!wasHandled) {
        // Re-throw error if not an auth error
        throw error;
      }
      
      // For auth errors, still throw to let calling code handle it
      // but the auto-logout will already be triggered
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
