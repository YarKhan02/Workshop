import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  ServiceType, 
  JobStatus, 
  PaymentStatus, 
  AttendanceStatus
} from '../types';

// Date formatting utilities
export const formatDate = (date: Date | string, formatString: string = 'MMM dd, yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatDateTime = (date: Date | string) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatTime = (date: Date | string) => {
  return formatDate(date, 'HH:mm');
};

export const getRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Currency formatting - using centralized utility
export { formatCurrency } from './currency';

// Status color utilities
export const getStatusColor = (status: JobStatus | PaymentStatus | AttendanceStatus) => {
  switch (status) {
    case JobStatus.SCHEDULED:
    case PaymentStatus.PENDING:
      return 'bg-blue-100 text-blue-800';
    case JobStatus.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-800';
    case JobStatus.COMPLETED:
    case PaymentStatus.PAID:
    case AttendanceStatus.PRESENT:
      return 'bg-green-100 text-green-800';
    case JobStatus.DELIVERED:
      return 'bg-purple-100 text-purple-800';
    case JobStatus.CANCELLED:
    case PaymentStatus.CANCELLED:
    case AttendanceStatus.ABSENT:
      return 'bg-red-100 text-red-800';
    case PaymentStatus.OVERDUE:
      return 'bg-orange-100 text-orange-800';
    case AttendanceStatus.LATE:
      return 'bg-amber-100 text-amber-800';
    case AttendanceStatus.HALF_DAY:
      return 'bg-indigo-100 text-indigo-800';
    case AttendanceStatus.LEAVE:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Service type utilities
export const getServiceTypeColor = (serviceType: ServiceType) => {
  switch (serviceType) {
    case ServiceType.BASIC_WASH:
      return 'bg-blue-100 text-blue-800';
    case ServiceType.PREMIUM_WASH:
      return 'bg-indigo-100 text-indigo-800';
    case ServiceType.INTERIOR_DETAILING:
      return 'bg-green-100 text-green-800';
    case ServiceType.EXTERIOR_DETAILING:
      return 'bg-yellow-100 text-yellow-800';
    case ServiceType.FULL_DETAILING:
      return 'bg-purple-100 text-purple-800';
    case ServiceType.CERAMIC_COATING:
      return 'bg-pink-100 text-pink-800';
    case ServiceType.PAINT_CORRECTION:
      return 'bg-red-100 text-red-800';
    case ServiceType.HEADLIGHT_RESTORATION:
      return 'bg-orange-100 text-orange-800';
    case ServiceType.LEATHER_CARE:
      return 'bg-brown-100 text-brown-800';
    case ServiceType.ENGINE_BAY_CLEANING:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};





// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateLicensePlate = (plate: string): boolean => {
  // Basic validation for Indian license plates
  const plateRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
  return plateRegex.test(plate.replace(/\s/g, '').toUpperCase());
};

// Calculation utilities
export const calculateTax = (subtotal: number, taxRate: number = 18): number => {
  return (subtotal * taxRate) / 100;
};

export const calculateDiscount = (subtotal: number, discountPercentage: number): number => {
  return (subtotal * discountPercentage) / 100;
};

export const calculateTotal = (subtotal: number, taxAmount: number, discountAmount: number): number => {
  return subtotal + taxAmount - discountAmount;
};

// Time utilities
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
};

// Search utilities
export const searchFilter = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(term);
    })
  );
};

// Sort utilities
export const sortByDate = <T extends { createdAt: Date }>(items: T[], ascending: boolean = false): T[] => {
  return [...items].sort((a, b) => {
    const comparison = a.createdAt.getTime() - b.createdAt.getTime();
    return ascending ? comparison : -comparison;
  });
};

export const sortByName = <T extends { name: string }>(items: T[], ascending: boolean = true): T[] => {
  return [...items].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return ascending ? comparison : -comparison;
  });
};

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate unique IDs
export const generateId = (): string => {
  return crypto.randomUUID();
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Utility function for combining class names
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}; 