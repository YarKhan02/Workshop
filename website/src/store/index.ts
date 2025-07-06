import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Customer,
  Car,
  Job,
  ServicePackage,
  Invoice,
  InventoryItem,
  Staff,
  Attendance,
  DashboardStats,
  Booking,
  TimeSlot,
} from '../types/index';

import {
  ServiceType,
  JobStatus,
  PaymentStatus,
  StaffRole,
  AttendanceStatus
} from '../types/index';

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
  inventoryItems: InventoryItem[];
  staff: Staff[];
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
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  
  // Car Actions
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  
  // Job Actions
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  setSelectedJob: (job: Job | null) => void;
  
  // Service Package Actions
  addServicePackage: (servicePackage: Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateServicePackage: (id: string, updates: Partial<ServicePackage>) => void;
  deleteServicePackage: (id: string) => void;
  
  // Invoice Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Staff Actions
  addStaff: (staff: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
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
  getCustomerById: (id: string) => Customer | undefined;
  getCarById: (id: string) => Car | undefined;
  getJobById: (id: string) => Job | undefined;
  getStaffById: (id: string) => Staff | undefined;
  getCarsByCustomerId: (customerId: string) => Car[];
  getJobsByCustomerId: (customerId: string) => Job[];
  getJobsByStatus: (status: JobStatus) => Job[];
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
      inventoryItems: [],
      staff: [],
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
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
      },
      
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date() }
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
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ cars: [...state.cars, newCar] }));
      },
      
      updateCar: (id, updates) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, ...updates, updatedAt: new Date() } : car
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
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ jobs: [...state.jobs, newJob] }));
      },
      
      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates, updatedAt: new Date() } : job
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
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ servicePackages: [...state.servicePackages, newServicePackage] }));
      },
      
      updateServicePackage: (id, updates) => {
        set((state) => ({
          servicePackages: state.servicePackages.map((servicePackage) =>
            servicePackage.id === id
              ? { ...servicePackage, ...updates, updatedAt: new Date() }
              : servicePackage
          ),
        }));
      },
      
      deleteServicePackage: (id) => {
        set((state) => ({
          servicePackages: state.servicePackages.filter((servicePackage) => servicePackage.id !== id),
        }));
      },
      
      // Invoice Actions
      addInvoice: (invoice) => {
        const newInvoice: Invoice = {
          ...invoice,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ invoices: [...state.invoices, newInvoice] }));
      },
      
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updates, updatedAt: new Date() } : invoice
          ),
        }));
      },
      
      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }));
      },
      
      // Inventory Actions
      addInventoryItem: (item) => {
        const newItem: InventoryItem = {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ inventoryItems: [...state.inventoryItems, newItem] }));
      },
      
      updateInventoryItem: (id, updates) => {
        set((state) => ({
          inventoryItems: state.inventoryItems.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
          ),
        }));
      },
      
      deleteInventoryItem: (id) => {
        set((state) => ({
          inventoryItems: state.inventoryItems.filter((item) => item.id !== id),
        }));
      },
      
      // Staff Actions
      addStaff: (staff) => {
        const newStaff: Staff = {
          ...staff,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ staff: [...state.staff, newStaff] }));
      },
      
      updateStaff: (id, updates) => {
        set((state) => ({
          staff: state.staff.map((staffMember) =>
            staffMember.id === id ? { ...staffMember, ...updates, updatedAt: new Date() } : staffMember
          ),
        }));
      },
      
      deleteStaff: (id) => {
        set((state) => ({
          staff: state.staff.filter((staffMember) => staffMember.id !== id),
        }));
      },
      
      // Attendance Actions
      addAttendance: (attendance) => {
        const newAttendance: Attendance = {
          ...attendance,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ attendance: [...state.attendance, newAttendance] }));
      },
      
      updateAttendance: (id, updates) => {
        set((state) => ({
          attendance: state.attendance.map((att) =>
            att.id === id ? { ...att, ...updates, updatedAt: new Date() } : att
          ),
        }));
      },
      
      deleteAttendance: (id) => {
        set((state) => ({
          attendance: state.attendance.filter((att) => att.id !== id),
        }));
      },
      
      // Booking Actions
      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ bookings: [...state.bookings, newBooking] }));
      },
      
      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, ...updates, updatedAt: new Date() } : booking
          ),
        }));
      },
      
      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id),
        }));
      },
      
      // Dashboard Actions
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      
      // Utility Actions
      getCustomerById: (id) => get().customers.find((customer) => customer.id === id),
      getCarById: (id) => get().cars.find((car) => car.id === id),
      getJobById: (id) => get().jobs.find((job) => job.id === id),
      getStaffById: (id) => get().staff.find((staffMember) => staffMember.id === id),
      getCarsByCustomerId: (customerId) => get().cars.filter((car) => car.customerId === customerId),
      getJobsByCustomerId: (customerId) => get().jobs.filter((job) => job.customerId === customerId),
      getJobsByStatus: (status) => get().jobs.filter((job) => job.status === status),
    }),
    {
      name: 'car-detailing-store',
    }
  )
); 