import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Customer,
  Car,
  Job,
  ServicePackage,
  Invoice,
  Attendance,
  DashboardStats,
  Booking,
  TimeSlot,
} from '../types';

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  currentUser: any | null;
  
  // Data
  customers: Customer[];
  cars: Car[];
  jobs: Job[];
  servicePackages: ServicePackage[];
  invoices: Invoice[];
  attendance: Attendance[];
  bookings: Booking[];
  timeSlots: TimeSlot[];
  
  // UI State
  isLoading: boolean;
  currentView: 'customer' | 'admin';
  selectedCustomer: Customer | null;
  selectedJob: Job | null;
  
  // Dashboard
  dashboardStats: DashboardStats | null;
  
  // Actions
  setAuthenticated: (authenticated: boolean, user?: any) => void;
  setLoading: (loading: boolean) => void;
  setCurrentView: (view: 'customer' | 'admin') => void;
  
  // Customer Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  
  // Car Actions
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCar: (id: number, updates: Partial<Car>) => void;
  deleteCar: (id: number) => void;
  
  // Job Actions
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: number, updates: Partial<Job>) => void;
  deleteJob: (id: number) => void;
  setSelectedJob: (job: Job | null) => void;
  
  // Service Package Actions
  addServicePackage: (servicePackage: Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateServicePackage: (id: string, updates: Partial<ServicePackage>) => void;
  deleteServicePackage: (id: string) => void;
  
  // Invoice Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: number, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: number) => void;
  
  // Attendance Actions
  addAttendance: (attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAttendance: (id: string, updates: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;
  
  // Booking Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  
  // Dashboard Actions
  setDashboardStats: (stats: DashboardStats) => void;
  
  // Utility Actions
  getCustomerById: (id: number) => Customer | undefined;
  getCarById: (id: number) => Car | undefined;
  getJobById: (id: number) => Job | undefined;
  getCarsByCustomerId: (customerId: number) => Car[];
  getJobsByCustomerId: (customerId: number) => Job[];
  getJobsByStatus: (status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => Job[];
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      currentUser: null,
      customers: [],
      cars: [],
      jobs: [],
      servicePackages: [],
      invoices: [],
      attendance: [],
      bookings: [],
      timeSlots: [],
      isLoading: false,
      currentView: 'customer',
      selectedCustomer: null,
      selectedJob: null,
      dashboardStats: null,
      
      // Authentication Actions
      setAuthenticated: (authenticated, user) => 
        set({ isAuthenticated: authenticated, currentUser: user }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setCurrentView: (view) => set({ currentView: view }),
      
      // Customer Actions
      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
      },
      
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
              : customer
          ),
        }));
      },
      
      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }));
      },
      
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      
      // Car Actions
      addCar: (car) => {
        const newCar: Car = {
          ...car,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ cars: [...state.cars, newCar] }));
      },
      
      updateCar: (id, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, ...updates, updatedAt: new Date().toISOString() } : car
          ),
        }));
      },
      
      deleteCar: (id) => {
        set((state) => ({
          cars: state.cars.filter((car) => car.id !== id),
        }));
      },
      
      // Job Actions
      addJob: (job) => {
        const newJob: Job = {
          ...job,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ jobs: [...state.jobs, newJob] }));
      },
      
      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job
          ),
        }));
      },
      
      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        }));
      },
      
      setSelectedJob: (job) => set({ selectedJob: job }),
      
      // Service Package Actions
      addServicePackage: (servicePackage) => {
        const newServicePackage: ServicePackage = {
          ...servicePackage,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ servicePackages: [...state.servicePackages, newServicePackage] }));
      },
      
      updateServicePackage: (id, updates) => {
        set((state) => ({
          servicePackages: state.servicePackages.map((sp) =>
            sp.id === id ? { ...sp, ...updates, updatedAt: new Date() } : sp
          ),
        }));
      },
      
      deleteServicePackage: (id) => {
        set((state) => ({
          servicePackages: state.servicePackages.filter((sp) => sp.id !== id),
        }));
      },
      
      // Invoice Actions
      addInvoice: (invoice) => {
        const newInvoice: Invoice = {
          ...invoice,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ invoices: [...state.invoices, newInvoice] }));
      },
      
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updates, updatedAt: new Date().toISOString() } : invoice
          ),
        }));
      },
      
      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }));
      },
      
      // Attendance Actions
      addAttendance: (attendance) => {
        const newAttendance: Attendance = {
          ...attendance,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ attendance: [...state.attendance, newAttendance] }));
      },
      
      updateAttendance: (id, updates) => {
        set((state) => ({
          attendance: state.attendance.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
          ),
        }));
      },
      
      deleteAttendance: (id) => {
        set((state) => ({
          attendance: state.attendance.filter((a) => a.id !== id),
        }));
      },
      
      // Booking Actions
      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ bookings: [...state.bookings, newBooking] }));
      },
      
      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
          ),
        }));
      },
      
      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        }));
      },
      
      // Dashboard Actions
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      
      // Utility Actions
      getCustomerById: (id) => get().customers.find((customer) => customer.id === id),
      getCarById: (id) => get().cars.find((car) => car.id === id),
      getJobById: (id) => get().jobs.find((job) => job.id === id),
      getCarsByCustomerId: (customerId) => get().cars.filter((car) => car.customerId === customerId),
      getJobsByCustomerId: (customerId) => get().jobs.filter((job) => job.customerId === customerId),
      getJobsByStatus: (status) => get().jobs.filter((job) => job.status === status),
    })
  )
); 