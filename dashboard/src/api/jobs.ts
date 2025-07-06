import { apiClient } from './client';

export interface Job {
  id: number;
  customerId: number;
  carId: number;
  assignedTo?: number;
  jobType: 'basic_wash' | 'full_detail' | 'interior_detail' | 'exterior_detail' | 'premium_detail' | 'custom';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: string;
  endTime?: string;
  price: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
  customerNotes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  services: string[];
  materials: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  car?: {
    id: number;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  assignedStaff?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: number;
  assignedTo?: number;
}

export interface JobResponse {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Get all jobs with filters
export const getJobs = async (filters: JobFilters = {}): Promise<JobResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.customerId) params.append('customerId', filters.customerId.toString());
  if (filters.assignedTo) params.append('assignedTo', filters.assignedTo.toString());

  const response = await apiClient.get(`/jobs?${params.toString()}`);
  return response.data;
};

// Get single job by ID
export const getJobById = async (id: number): Promise<{ job: Job }> => {
  const response = await apiClient.get(`/jobs/${id}`);
  return response.data;
};

// Create new job
export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; job: Job }> => {
  const response = await apiClient.post('/jobs', jobData);
  return response.data;
};

// Update job
export const updateJob = async (id: number, jobData: Partial<Job>): Promise<{ message: string; job: Job }> => {
  const response = await apiClient.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/jobs/${id}`);
  return response.data;
};

// Update job status
export const updateJobStatus = async (id: number, status: string): Promise<{ message: string; job: Job }> => {
  const response = await apiClient.patch(`/jobs/${id}/status`, { status });
  return response.data;
}; 